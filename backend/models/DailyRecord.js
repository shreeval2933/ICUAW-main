import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const DailyRecord = sequelize.define('DailyRecord', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  patientId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  // Tab 1: Vital Signs
  sofaScore: {
    type: DataTypes.INTEGER,
    validate: { min: 0, max: 24 }
  },
  hrMin: { type: DataTypes.INTEGER },
  hrMax: { type: DataTypes.INTEGER },
  sbpMin: { type: DataTypes.INTEGER },
  sbpMax: { type: DataTypes.INTEGER },
  dbpMin: { type: DataTypes.INTEGER },
  dbpMax: { type: DataTypes.INTEGER },
  rrMin: { type: DataTypes.INTEGER },
  rrMax: { type: DataTypes.INTEGER },
  spo2Min: { type: DataTypes.INTEGER },
  spo2Max: { type: DataTypes.INTEGER },
  tempMin: { type: DataTypes.FLOAT },
  tempMax: { type: DataTypes.FLOAT },
  rassMin: { type: DataTypes.INTEGER },
  rassMax: { type: DataTypes.INTEGER },
  urineMin: { type: DataTypes.FLOAT },
  urineMax: { type: DataTypes.FLOAT },
  gcs: { type: DataTypes.INTEGER, validate: { min: 3, max: 15 } },

  // Tab 2: Treatment Variables
  mechVentDuration: { type: DataTypes.FLOAT },
  sedationDuration: { type: DataTypes.FLOAT },
  neuromuscularDuration: { type: DataTypes.FLOAT },
  corticosteroidDuration: { type: DataTypes.FLOAT },
  vasopressorDuration: { type: DataTypes.FLOAT },

  // Tab 3: ICU Practices
  mobilizationTime: { type: DataTypes.FLOAT },
  immobilizationDuration: { type: DataTypes.FLOAT },

  // Tab 4: Nutrition
  nutritionRoute: {
    type: DataTypes.ENUM('oral', 'ryles tube', 'TPN'),
    defaultValue: 'oral'
  },
  proteinIntake: { type: DataTypes.FLOAT }
});

export default DailyRecord;
