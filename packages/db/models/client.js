"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class client extends Model {
    static associate(models) { }
  }
  client.init(
    {
      id: {
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID
      },
      first_name: DataTypes.STRING(30),
      last_name: DataTypes.STRING(30),
      middle_name: DataTypes.STRING(30),
      phone: DataTypes.STRING(20),
      email: DataTypes.STRING(40),
      password: DataTypes.STRING(50),
      ctime: DataTypes.DATE,
      mtime: DataTypes.DATE,
      activated: DataTypes.BOOLEAN,
      block: DataTypes.BOOLEAN,

      type: DataTypes.STRING(255),
      company_name: DataTypes.STRING,
      company_director_fullname: DataTypes.STRING(255),
    },
    {
      createdAt: false,
      updatedAt: false,
      deletedAt: false,
      sequelize,
      modelName: "client"
    }
  );
  return client;
};
