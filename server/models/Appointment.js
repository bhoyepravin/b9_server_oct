module.exports = (sequelize, DataTypes) => {
  const Appointment = sequelize.define("Appointment", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    clientId: { type: DataTypes.UUID, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    scheduledAt: { type: DataTypes.DATE, allowNull: false },
    calendlyUrl: { type: DataTypes.STRING },
  });
  return Appointment;
};
