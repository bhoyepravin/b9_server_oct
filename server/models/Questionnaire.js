module.exports = (sequelize, DataTypes) => {
  const Questionnaire = sequelize.define(
    "Questionnaire",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.STRING },
      questions: { type: DataTypes.JSONB, allowNull: false },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    {
      timestamps: true,
      tableName: "Questionnaires",
    }
  );

  Questionnaire.associate = function (models) {
    Questionnaire.belongsTo(models.User, {
      foreignKey: "createdBy",
      as: "QuestionnaireCreator",
    });

    Questionnaire.hasMany(models.QuestionnaireResponse, {
      foreignKey: "questionnaireId",
      as: "QuestionnaireResponses",
    });
  };

  return Questionnaire;
};
