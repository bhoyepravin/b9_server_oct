module.exports = (sequelize, DataTypes) => {
  const Appointment = sequelize.define(
    "Appointment",
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
      therapistId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      location: { type: DataTypes.STRING, allowNull: false },
      scheduledAt: { type: DataTypes.DATE, allowNull: false },
      status: {
        type: DataTypes.ENUM("scheduled", "completed", "cancelled", "no-show"),
        defaultValue: "scheduled",
      },
      notes: { type: DataTypes.TEXT },
      calendlyUrl: { type: DataTypes.STRING },
    },
    {
      timestamps: true,
      tableName: "Appointments",
    }
  );

  Appointment.associate = function (models) {
    Appointment.belongsTo(models.User, {
      foreignKey: "userId",
      as: "AppointmentClient",
    });

    Appointment.belongsTo(models.User, {
      foreignKey: "therapistId",
      as: "AppointmentTherapist",
    });

    Appointment.hasMany(models.QuestionnaireResponse, {
      foreignKey: "appointmentId",
      as: "AppointmentResponses",
    });

    Appointment.hasOne(models.Payment, {
      foreignKey: "appointmentId",
      as: "AppointmentPayment",
    });
  };

  return Appointment;
};
