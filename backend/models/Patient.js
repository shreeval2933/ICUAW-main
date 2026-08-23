import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Patient = sequelize.define('Patient', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  uhid: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  sex: {
    type: DataTypes.ENUM('male', 'female', 'others'),
    allowNull: false,
  },
  bmi: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  diagnosis: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  comorbidities: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  addiction: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  apacheIIScore: {
    type: DataTypes.INTEGER,
    validate: {
      min: 0,
      max: 71,
    },
  },
  sofaScore: {
    type: DataTypes.INTEGER,
    validate: {
      min: 0,
      max: 24,
    },
  },
  admissionDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  bedNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('active', 'discharged', 'deceased'),
    defaultValue: 'active',
  },
  icuaw: {
    type: DataTypes.ENUM('positive', 'negative', 'pending'),
    defaultValue: 'pending',
    allowNull: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
});

export default Patient;
