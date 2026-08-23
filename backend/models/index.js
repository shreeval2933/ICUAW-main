import User from './User.js';
import Patient from './Patient.js';
import LaboratoryValues from './LaboratoryValues.js';
import DailyRecord from './DailyRecord.js';

// Relationships:
Patient.hasMany(DailyRecord, { foreignKey: 'patientId', onDelete: 'CASCADE' });
DailyRecord.belongsTo(Patient, { as: 'patient', foreignKey: 'patientId' });

Patient.hasMany(LaboratoryValues, { foreignKey: 'patientId', onDelete: 'CASCADE' });
LaboratoryValues.belongsTo(Patient, { foreignKey: 'patientId' });

User.hasMany(Patient, { foreignKey: 'userId' });
Patient.belongsTo(User, { foreignKey: 'userId' });

export {
  User,
  Patient,
  LaboratoryValues,
  DailyRecord,
};
