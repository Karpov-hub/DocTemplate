"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("clients", "phone", {
      type: Sequelize.STRING(20)
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("clients", "phone", {
      type: Sequelize.STRING(12),
      allowNull: true
    });
  }
};
