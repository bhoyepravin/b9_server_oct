module.exports = (sequelize, DataTypes) => {
  const Questionnaire = sequelize.define("Questionnaire", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING },
    questions: { type: DataTypes.JSONB, allowNull: false },
    createdBy: { type: DataTypes.UUID, allowNull: false },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  });

  // Add this association method
  Questionnaire.associate = (models) => {
    Questionnaire.belongsTo(models.User, {
      foreignKey: "createdBy",
      as: "Creator",
    });
    Questionnaire.hasMany(models.QuestionnaireResponse, {
      foreignKey: "questionnaireId",
    });
  };

  return Questionnaire;
};
