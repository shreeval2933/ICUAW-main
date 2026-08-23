import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const LaboratoryValues = sequelize.define('LaboratoryValues', {
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
    allowNull: true,
  },
  // Lab Fields:
  glucoseMin: { type: DataTypes.FLOAT },
  glucoseMax: { type: DataTypes.FLOAT },
  phosphate: { type: DataTypes.FLOAT },
  potassium: { type: DataTypes.FLOAT },
  albumin: { type: DataTypes.FLOAT },
  crp: { type: DataTypes.FLOAT },
  procalcitonin: { type: DataTypes.FLOAT },
  creatinine: { type: DataTypes.FLOAT },
  ast: { type: DataTypes.FLOAT },
  alt: { type: DataTypes.FLOAT },
  bilirubin: { type: DataTypes.FLOAT },
  lactate: { type: DataTypes.FLOAT },
  hb: { type: DataTypes.FLOAT }, // Hemoglobin
  tlc: { type: DataTypes.FLOAT },
  plt: { type: DataTypes.FLOAT }, // Platelets
  tsh: { type: DataTypes.FLOAT }, // Thyroid
  t3: { type: DataTypes.FLOAT },
  t4: { type: DataTypes.FLOAT },
});

export default LaboratoryValues;
