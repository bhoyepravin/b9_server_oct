module.exports = (sequelize, DataTypes) => {
  const UserAssessment = sequelize.define(
    "UserAssessment",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      // Step 1: Current Situation Assessment
      problem: { type: DataTypes.STRING },
      problemOther: { type: DataTypes.STRING },
      duration: { type: DataTypes.STRING },
      durationOther: { type: DataTypes.STRING },
      triggersAssessment: { type: DataTypes.STRING },
      triggersAssessmentOther: { type: DataTypes.STRING },
      medications: { type: DataTypes.STRING },
      medicationsOther: { type: DataTypes.STRING },

      // Step 2: Emotional Patterns & Triggers
      distressIntensifiers: { type: DataTypes.STRING },
      distressIntensifiersOther: { type: DataTypes.STRING },
      physicalSensations: { type: DataTypes.STRING },
      physicalSensationsOther: { type: DataTypes.STRING },
      negativeThoughts: { type: DataTypes.STRING },
      negativeThoughtsOther: { type: DataTypes.STRING },

      // Step 3: Define Your Desired Outcome
      resolution: { type: DataTypes.STRING },
      resolutionOther: { type: DataTypes.STRING },
      timeline: { type: DataTypes.STRING },
      timelineOther: { type: DataTypes.STRING },
      confidence: { type: DataTypes.STRING },

      // Step 4: Deeper Insights
      happyMemories: { type: DataTypes.STRING },
      relaxationAids: { type: DataTypes.STRING },
      relaxationAidsOther: { type: DataTypes.STRING },
      supportSystem: { type: DataTypes.STRING },
      supportSystemOther: { type: DataTypes.STRING },
      rechargeActivities: { type: DataTypes.STRING },
      rechargeActivitiesOther: { type: DataTypes.STRING },

      // Step 5: Transformation Package
      package: { type: DataTypes.STRING },

      // Step 6: Location
      location: { type: DataTypes.STRING },

      // Step 8: Payment Information
      cardName: { type: DataTypes.STRING },
      cardNumber: { type: DataTypes.STRING },
      cardExpiry: { type: DataTypes.STRING },
      cardCvc: { type: DataTypes.STRING },

      // Additional fields
      submittedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      timestamps: true,
      tableName: "UserAssessments",
    }
  );

  UserAssessment.associate = function (models) {
    UserAssessment.belongsTo(models.User, {
      foreignKey: "userId",
      as: "AssessmentUser",
    });
  };

  return UserAssessment;
};
