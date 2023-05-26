"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      {
        tableName: "templates_categories"
      },
      {
        category_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: "categories",
            key: "id"
          },
          onUpdate: "cascade",
          onDelete: "cascade"
        },
        template_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: "jasper_report_templates",
            key: "id"
          },
          onUpdate: "cascade",
          onDelete: "cascade"
        }
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable({
      tableName: "templates_categories"
    });
  }
};
