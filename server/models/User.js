module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    roleId: { type: DataTypes.INTEGER, allowNull: false },
  });

  User.associate = (models) => {
    User.belongsTo(models.Role, { foreignKey: "roleId" });
    // Add this association
    User.hasMany(models.Questionnaire, {
      foreignKey: "createdBy",
      as: "CreatedQuestionnaires",
    });
  };

  return User;
};
