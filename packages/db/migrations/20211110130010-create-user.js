"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID
      },
      role: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "roles",
          key: "id"
        },
        onUpdate: "cascade",
        onDelete: "cascade"
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
      login: {
        type: Sequelize.STRING(30)
      },
      password: {
        type: Sequelize.STRING(50)
      },
      email: {
        type: Sequelize.STRING(40)
      },
      phone: {
        type: Sequelize.STRING(12)
      },
      ctime: {
        type: Sequelize.DATE
      },
      mtime: {
        type: Sequelize.DATE
      },
      block: {
        type: Sequelize.BOOLEAN
      },
      su: {
        type: Sequelize.BOOLEAN
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable({ tableName: "users" });
  }
};
