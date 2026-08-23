import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import sequelize from './db.js';
import { adminRouter, adminJs } from './admin.js';
import {
  User,
  Patient,
  LaboratoryValues,
  DailyRecord
} from './models/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors({
  origin: '*',
  credentials: true
}));

// Setup AdminJS
app.use(adminJs.options.rootPath, adminRouter);

// Standard JSON parser for other API routes
app.use(express.json());

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token required' });

  jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkeyforicuaw', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// API Routes
// 1. Auth Endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check local default admin
    const defaultEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const defaultPassword = process.env.ADMIN_PASSWORD || 'adminpassword';
    
    if (email === defaultEmail && password === defaultPassword) {
      const token = jwt.sign({ email, role: 'admin' }, process.env.JWT_SECRET || 'supersecretjwtkeyforicuaw', { expiresIn: '8h' });
      return res.json({ token, user: { email, role: 'admin' } });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Simple password check or bcrypt depending on how user was created
    const isMatch = password === user.password; // For simplicity in setup, we support raw or we can bcrypt
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'supersecretjwtkeyforicuaw', { expiresIn: '8h' });
    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// 2. Dashboard Stats
app.get('/api/stats', authenticateToken, async (req, res) => {
  try {
    const whereClause = {};
    if (req.user.role !== 'admin') {
      whereClause.userId = req.user.id;
    }
    const totalPatients = await Patient.count({ where: { ...whereClause, status: 'active' } });
    const discharged = await Patient.count({ where: { ...whereClause, status: 'discharged' } });
    const deceased = await Patient.count({ where: { ...whereClause, status: 'deceased' } });
    
    // Let's find critical count by checking high SOFA score (e.g. > 8) or APACHE-II score (> 15)
    const criticalPatients = await Patient.count({
      where: {
        ...whereClause,
        status: 'active',
        [sequelize.Sequelize.Op.or]: [
          { sofaScore: { [sequelize.Sequelize.Op.gt]: 8 } },
          { apacheIIScore: { [sequelize.Sequelize.Op.gt]: 15 } }
        ]
      }
    });

    res.json({
      activeCount: totalPatients,
      dischargedCount: discharged,
      deceasedCount: deceased,
      criticalCount: criticalPatients,
      bedOccupancy: Math.min(Math.round((totalPatients / 20) * 100), 100) // Assume a 20-bed ICU
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Patients APIs
app.get('/api/patients', authenticateToken, async (req, res) => {
  try {
    const whereClause = {};
    if (req.user.role !== 'admin') {
      whereClause.userId = req.user.id;
    }
    const patients = await Patient.findAll({
      where: whereClause,
      include: [
        { model: DailyRecord },
        { model: LaboratoryValues }
      ],
      order: [['admissionDate', 'DESC']]
    });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/patients', authenticateToken, async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.user && req.user.id) {
      data.userId = req.user.id;
    }
    const patient = await Patient.create(data);
    res.status(201).json(patient);
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: error.errors.map(e => e.message).join(', ') });
    }
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/patients/:id', authenticateToken, async (req, res) => {
  try {
    const whereClause = { id: req.params.id };
    if (req.user.role !== 'admin') {
      whereClause.userId = req.user.id;
    }
    const patient = await Patient.findOne({
      where: whereClause,
      include: [
        { model: DailyRecord, order: [['date', 'DESC']], limit: 10 },
        { model: LaboratoryValues, limit: 10 }
      ]
    });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/patients/:id', authenticateToken, async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    if (req.user.role !== 'admin' && patient.userId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await patient.update(req.body);
    res.json(patient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/patients/:id', authenticateToken, async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    if (req.user.role !== 'admin' && patient.userId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await patient.destroy();
    res.json({ message: 'Patient removed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Lab entry
app.post('/api/patients/:id/labs', authenticateToken, async (req, res) => {
  try {
    const lab = await LaboratoryValues.create({
      patientId: req.params.id,
      ...req.body
    });
    res.status(201).json(lab);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 5. Daily log entry
app.post('/api/patients/:id/daily-record', authenticateToken, async (req, res) => {
  try {
    const record = await DailyRecord.create({
      patientId: req.params.id,
      ...req.body
    });
    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Sync database and listen
sequelize.sync({ alter: true }).then(() => {
  console.log('Database synced successfully.');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`AdminJS console is at http://localhost:${PORT}${adminJs.options.rootPath}`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});
