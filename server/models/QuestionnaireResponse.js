module.exports = (sequelize, DataTypes) => {
  const QuestionnaireResponse = sequelize.define(
    "QuestionnaireResponse",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      appointmentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Appointments",
          key: "id",
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      questionnaireId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Questionnaires",
          key: "id",
        },
      },
      responses: { type: DataTypes.JSONB, allowNull: false },
      submittedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      timestamps: true,
      tableName: "QuestionnaireResponses",
    }
  );

  QuestionnaireResponse.associate = function (models) {
    QuestionnaireResponse.belongsTo(models.Appointment, {
      foreignKey: "appointmentId",
      as: "ResponseAppointment",
    });

    QuestionnaireResponse.belongsTo(models.User, {
      foreignKey: "userId",
      as: "ResponseUser",
    });

    QuestionnaireResponse.belongsTo(models.Questionnaire, {
      foreignKey: "questionnaireId",
      as: "ResponseQuestionnaire",
    });
  };

  return QuestionnaireResponse;
};
