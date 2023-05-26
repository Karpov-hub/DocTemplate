"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class life_situation extends Model {
    static associate(models) { }
  }
  life_situation.init(
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
      modelName: "life_situation",
    }
  );
  return life_situation;
};
