"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("jasper_report_templates", {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID
      },
      report_name_for_user: {
        type: Sequelize.STRING(40)
      },
      report_name_in_system: {
        type: Sequelize.STRING(40)
      },
      code: {
        type: Sequelize.UUID
      },
      ctime: {
        type: Sequelize.DATE
      },
      mtime: {
        type: Sequelize.DATE
      },
      images: {
        type: Sequelize.ARRAY(Sequelize.JSONB)
      },
      client_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "clients",
          key: "id"
        }
      },
      private: {
        type: Sequelize.BOOLEAN
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("jasper_report_templates");
  }
};
