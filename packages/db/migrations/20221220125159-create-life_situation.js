"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      {
        tableName: "life_situations"
      },
      {
        id: {
          allowNull: false,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          type: Sequelize.UUID
        },
        name: {
          type: Sequelize.JSON
        },
        description: {
          type: Sequelize.JSON
        }
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable({
      tableName: "life_situations"
    });
  }
};
