"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("clients", {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID
      },
      first_name: {
        type: Sequelize.STRING(30)
      },
      last_name: {
        type: Sequelize.STRING(30)
      },
      middle_name: {
        type: Sequelize.STRING(30)
      },
      phone: {
        type: Sequelize.STRING(12)
      },
      email: {
        type: Sequelize.STRING(40)
      },
      password: {
        type: Sequelize.STRING(50)
      },
      ctime: {
        type: Sequelize.DATE
      },
      mtime: {
        type: Sequelize.DATE
      },
      activated: {
        type: Sequelize.BOOLEAN
      },
      block: {
        type: Sequelize.BOOLEAN
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable({ tableName: "clients" });
  }
};
