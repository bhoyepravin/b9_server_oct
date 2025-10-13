module.exports = (sequelize, DataTypes) => {
  const QuestionnaireResponse = sequelize.define("QuestionnaireResponse", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    appointmentId: { type: DataTypes.UUID, allowNull: false },
    clientId: { type: DataTypes.UUID, allowNull: false },
    questionnaireId: { type: DataTypes.UUID, allowNull: false },
    responses: { type: DataTypes.JSONB, allowNull: false },
    submittedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  });
  return QuestionnaireResponse;
};
