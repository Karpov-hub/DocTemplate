"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class category extends Model {
    static associate(models) {}
  }
  category.init(
    {
      id:{
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
      modelName: "category",
    }
  );
  return category;
};
