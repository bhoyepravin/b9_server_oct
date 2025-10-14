const Sequelize = require("sequelize");
const sequelize = require("../utils/db");

const Role = require("./Role")(sequelize, Sequelize.DataTypes);
const User = require("./User")(sequelize, Sequelize.DataTypes);
const Appointment = require("./Appointment")(sequelize, Sequelize.DataTypes);
const Questionnaire = require("./Questionnaire")(
  sequelize,
  Sequelize.DataTypes
);
const QuestionnaireResponse = require("./QuestionnaireResponse")(
  sequelize,
  Sequelize.DataTypes
);
const Payment = require("./Payment")(sequelize, Sequelize.DataTypes);

// Create models object
const models = {
  Role,
  User,
  Appointment,
  Questionnaire,
  QuestionnaireResponse,
  Payment,
};

// Explicitly define associations in index file to ensure they work
Role.hasMany(User, { foreignKey: "roleId", as: "RoleUsers" });
User.belongsTo(Role, { foreignKey: "roleId", as: "UserRole" });

// User Associations
User.hasMany(Appointment, { foreignKey: "userId", as: "UserAppointments" });
Appointment.belongsTo(User, { foreignKey: "userId", as: "AppointmentClient" });

User.hasMany(Appointment, {
  foreignKey: "therapistId",
  as: "TherapistSessions",
});
Appointment.belongsTo(User, {
  foreignKey: "therapistId",
  as: "AppointmentTherapist",
});

User.hasMany(Questionnaire, {
  foreignKey: "createdBy",
  as: "AuthoredQuestionnaires",
});
Questionnaire.belongsTo(User, {
  foreignKey: "createdBy",
  as: "QuestionnaireCreator",
});

User.hasMany(QuestionnaireResponse, {
  foreignKey: "userId",
  as: "UserResponses",
});
QuestionnaireResponse.belongsTo(User, {
  foreignKey: "userId",
  as: "ResponseUser",
});

User.hasMany(Payment, { foreignKey: "userId", as: "UserPayments" });
Payment.belongsTo(User, { foreignKey: "userId", as: "PaymentUser" });

// Appointment Associations
Appointment.hasMany(QuestionnaireResponse, {
  foreignKey: "appointmentId",
  as: "AppointmentResponses",
});
QuestionnaireResponse.belongsTo(Appointment, {
  foreignKey: "appointmentId",
  as: "ResponseAppointment",
});

Appointment.hasOne(Payment, {
  foreignKey: "appointmentId",
  as: "AppointmentPayment",
});
Payment.belongsTo(Appointment, {
  foreignKey: "appointmentId",
  as: "PaymentAppointment",
});

// Questionnaire Associations
Questionnaire.hasMany(QuestionnaireResponse, {
  foreignKey: "questionnaireId",
  as: "QuestionnaireResponses",
});
QuestionnaireResponse.belongsTo(Questionnaire, {
  foreignKey: "questionnaireId",
  as: "ResponseQuestionnaire",
});

module.exports = {
  sequelize,
  Role,
  User,
  Appointment,
  Questionnaire,
  QuestionnaireResponse,
  Payment,
};
