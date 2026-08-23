import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import * as AdminJSSequelize from '@adminjs/sequelize';
import {
  User,
  Patient,
  LaboratoryValues,
  DailyRecord
} from './models/index.js';
import dotenv from 'dotenv';

dotenv.config();

// Register the Sequelize adapter
AdminJS.registerAdapter(AdminJSSequelize);

const adminJsOptions = {
  resources: [
    User,
    Patient,
    LaboratoryValues,
    DailyRecord
  ],
  rootPath: '/admin',
  branding: {
    companyName: 'AIIMS ICU Panel',
    logo: false,
    theme: {
      colors: {
        primary100: '#00838f',
        primary80: '#0097a7',
        primary60: '#00acc1',
        primary40: '#26c6da',
        primary20: '#80deea',
      }
    }
  }
};

const adminJs = new AdminJS(adminJsOptions);

// Set up authentication for AdminJS
const authProvider = {
  authenticate: async (email, password) => {
    const defaultEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const defaultPassword = process.env.ADMIN_PASSWORD || 'adminpassword';
    
    if (email === defaultEmail && password === defaultPassword) {
      return { email };
    }
    
    // Optionally look up in User model
    const user = await User.findOne({ where: { email } });
    if (user && user.role === 'admin') {
      if (password === user.password) {
        return { email: user.email, role: user.role };
      }
    }
    return null;
  },
  cookieName: 'adminjs-cookie',
  cookiePassword: process.env.SESSION_SECRET || 'super-secret-cookie-password-32-chars-long',
};

const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
  adminJs,
  authProvider,
  null,
  {
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET || 'supersecretcookiekeyforadminjs',
  }
);

export { adminJs, adminRouter };
