"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class inner_document extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.jasper_report_template, {
        foreignKey: "template",
        targetKey: "id"
      });
    }
  }
  inner_document.init(
    {
      id: {
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID
      },
      template: DataTypes.UUID,
      type: DataTypes.STRING,
      ctime: DataTypes.DATE,
      mtime: DataTypes.DATE,
      data_example: DataTypes.JSONB
    },
    {
      createdAt: "ctime",
      updatedAt: "mtime",
      deletedAt: false,
      sequelize,
      modelName: "inner_document"
    }
  );
  return inner_document;
};
