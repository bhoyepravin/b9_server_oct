module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define(
    "Payment",
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
      appointmentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Appointments",
          key: "id",
        },
      },
      stripePaymentId: { type: DataTypes.STRING, allowNull: false },
      amount: { type: DataTypes.FLOAT, allowNull: false },
      status: {
        type: DataTypes.ENUM("pending", "completed", "failed", "refunded"),
        defaultValue: "pending",
      },
      currency: { type: DataTypes.STRING, defaultValue: "USD" },
    },
    {
      timestamps: true,
      tableName: "Payments",
    }
  );

  Payment.associate = function (models) {
    Payment.belongsTo(models.User, {
      foreignKey: "userId",
      as: "PaymentUser",
    });

    Payment.belongsTo(models.Appointment, {
      foreignKey: "appointmentId",
      as: "PaymentAppointment",
    });
  };

  return Payment;
};
