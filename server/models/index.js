const Sequelize = require("sequelize");
const sequelize = require("../utils/db");

const Role = require("./Role")(sequelize, Sequelize.DataTypes);
const User = require("./User")(sequelize, Sequelize.DataTypes);
const Client = require("./Client")(sequelize, Sequelize.DataTypes);
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

// User Associations
User.belongsTo(Role, { foreignKey: "roleId" });
User.hasMany(Questionnaire, {
  foreignKey: "createdBy",
  as: "CreatedQuestionnaires",
});

// Client Associations
Client.hasMany(Appointment, { foreignKey: "clientId" });
Appointment.belongsTo(Client, { foreignKey: "clientId" });

Client.hasMany(QuestionnaireResponse, { foreignKey: "clientId" });
QuestionnaireResponse.belongsTo(Client, { foreignKey: "clientId" });

Client.hasMany(Payment, { foreignKey: "clientId" });
Payment.belongsTo(Client, { foreignKey: "clientId" });

// Appointment Associations
Appointment.hasMany(QuestionnaireResponse, { foreignKey: "appointmentId" });
QuestionnaireResponse.belongsTo(Appointment, { foreignKey: "appointmentId" });

Appointment.hasOne(Payment, { foreignKey: "appointmentId" });
Payment.belongsTo(Appointment, { foreignKey: "appointmentId" });

// Questionnaire Associations
Questionnaire.belongsTo(User, {
  foreignKey: "createdBy",
  as: "Creator",
});
Questionnaire.hasMany(QuestionnaireResponse, { foreignKey: "questionnaireId" });
QuestionnaireResponse.belongsTo(Questionnaire, {
  foreignKey: "questionnaireId",
});

module.exports = {
  sequelize,
  Role,
  User,
  Client,
  Appointment,
  Questionnaire,
  QuestionnaireResponse,
  Payment,
};
