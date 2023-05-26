'use strict';
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class order extends Model {
    static associate(models) {
      this.belongsTo(models.client, {
        foreignKey: "client_id",
        targetKey: "id"
      });
    }
  }
  order.init({
    id: {
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID
    },
    client_id: DataTypes.UUID,
    template_name: DataTypes.STRING(50),
    requirements: DataTypes.TEXT,
    attached_files: DataTypes.ARRAY(DataTypes.UUID),
    status: DataTypes.INTEGER,
    operator_id: DataTypes.UUID,
    note: DataTypes.TEXT,
    ctime: DataTypes.DATE,
    template_id: DataTypes.UUID,
    type: DataTypes.INTEGER,
  }, {
    createdAt: "ctime",
    updatedAt: false,
    deletedAt: false,
    sequelize,
    modelName: 'order',
  });
  return order;
};