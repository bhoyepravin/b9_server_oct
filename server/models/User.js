module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: { type: DataTypes.STRING, unique: true, allowNull: false },
      email: { type: DataTypes.STRING, unique: true, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Roles",
          key: "id",
        },
      },
      firstName: { type: DataTypes.STRING, allowNull: false },
      lastName: { type: DataTypes.STRING, allowNull: false },
      phone: { type: DataTypes.STRING },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Your Message (Optional)",
      },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    {
      timestamps: true,
      tableName: "Users",
    }
  );

  User.associate = function (models) {
    User.belongsTo(models.Role, {
      foreignKey: "roleId",
      as: "UserRole",
    });

    User.hasMany(models.Appointment, {
      foreignKey: "userId",
      as: "UserAppointments",
    });

    User.hasMany(models.Appointment, {
      foreignKey: "therapistId",
      as: "TherapistSessions",
    });

    User.hasMany(models.Questionnaire, {
      foreignKey: "createdBy",
      as: "AuthoredQuestionnaires",
    });

    User.hasMany(models.QuestionnaireResponse, {
      foreignKey: "userId",
      as: "UserResponses",
    });

    User.hasMany(models.Payment, {
      foreignKey: "userId",
      as: "UserPayments",
    });
  };

  return User;
};
