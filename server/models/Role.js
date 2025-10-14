module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    "Role",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      description: { type: DataTypes.STRING },
      permissions: { type: DataTypes.JSONB },
    },
    {
      timestamps: true,
      tableName: "Roles",
    }
  );

  Role.associate = function (models) {
    Role.hasMany(models.User, {
      foreignKey: "roleId",
      as: "RoleUsers",
    });
  };

  return Role;
};
