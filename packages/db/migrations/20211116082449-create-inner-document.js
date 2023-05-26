"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("inner_documents", {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID
      },
      template: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "jasper_report_templates",
          key: "id"
        },
        onUpdate: "cascade",
        onDelete: "cascade"
      },
      type: {
        type: Sequelize.STRING(5)
      },
      ctime: {
        type: Sequelize.DATE
      },
      mtime: {
        type: Sequelize.DATE
      },
      data_example: {
        type: Sequelize.JSONB
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable({
      tableName: "inner_documents"
    });
  }
};
