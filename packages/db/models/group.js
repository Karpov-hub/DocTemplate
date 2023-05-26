"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class group extends Model {
    static associate(models) { }
  }
  group.init(
    {
      id: {
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID
      },
      name: DataTypes.JSON,
      description: DataTypes.JSON,
    },
    {
      createdAt: false,
      updatedAt: false,
      deletedAt: false,
      sequelize,
      modelName: "group",
    }
  );
  return group;
};
