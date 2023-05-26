"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class role extends Model {
    static associate(models) {
    }
  }
  role.init(
    {
      id: {
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID
      },
      name: DataTypes.STRING(50),
      modules: DataTypes.ARRAY(DataTypes.JSONB),
      ctime: DataTypes.DATE,
      mtime: DataTypes.DATE,
    },
    {
      createdAt: "ctime",
      updatedAt: "mtime",
      deletedAt: false,
      sequelize,
      modelName: "role"
    }
  );
  return role;
};
