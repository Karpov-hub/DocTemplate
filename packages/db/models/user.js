"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.role, {
        foreignKey: "role",
        as: 'Role',
        targetKey: "id"
      });
    }
  }
  user.init(
    {
      id: {
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID
      },
      role: DataTypes.UUID,
      first_name: DataTypes.STRING(30),
      last_name: DataTypes.STRING(30),
      middle_name: DataTypes.STRING(30),

      email: DataTypes.STRING(40),
      phone: DataTypes.STRING(12),
      login: DataTypes.STRING(30),
      password: DataTypes.STRING(50),
      ctime: DataTypes.DATE,
      mtime: DataTypes.DATE,
      block: DataTypes.BOOLEAN,
      su: DataTypes.BOOLEAN,
    },
    {
      createdAt: "ctime",
      updatedAt: "mtime",
      deletedAt: false,
      sequelize,
      modelName: "user"
    }
  );
  return user;
};
