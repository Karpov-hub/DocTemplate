"use strict";
module.exports = (sequelize, DataTypes) => {
  const jasper_report_template = sequelize.define(
    "jasper_report_template",
    {
      id: {
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID,
      },
      report_name_for_user: DataTypes.STRING(40),
      report_name_in_system: DataTypes.STRING(40),
      code: {
        type: DataTypes.UUID,
        allowNull: true,
        foreignKey: true,
        references: {
          model: "provider",
          key: "code",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
      ctime: DataTypes.DATE,
      mtime: DataTypes.DATE,
      client_id: DataTypes.UUID,
      private: DataTypes.BOOLEAN,
      images: DataTypes.ARRAY(DataTypes.JSONB),
    },
    {
      createdAt: "ctime",
      updatedAt: "mtime",
      deletedAt: false,
    }
  );
  jasper_report_template.associate = (models) => {
    jasper_report_template.belongsTo(models.client, {
      foreignKey: "client_id",
      targetKey: "id",
    });
  };
  return jasper_report_template;
};
