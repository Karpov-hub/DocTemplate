"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class templates_category extends Model {
    static associate(models) {
      this.belongsTo(models.category, {
        foreignKey: "category_id",
        targetKey: "id",
      });
      this.belongsTo(models.group, {
        foreignKey: "group_id",
        targetKey: "id",
      });
      this.belongsTo(models.life_situation, {
        foreignKey: "life_situation_id",
        targetKey: "id",
      });
      this.belongsTo(models.jasper_report_template, {
        foreignKey: "template_id",
        targetKey: "id",
      });
    }
  }
  templates_category.init(
    {
      category_id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      group_id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      life_situation_id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      template_id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
    },
    {
      createdAt: false,
      updatedAt: false,
      deletedAt: false,
      sequelize,
      modelName: "templates_category",
    }
  );
  templates_category.removeAttribute("id");
  return templates_category;
};
