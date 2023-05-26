"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn(
          "clients",
          "type",
          { type: Sequelize.STRING(255), defaultValue: "personal" },
          {
            transaction: t
          }
        ),
        queryInterface.addColumn(
          "clients",
          "company_name",

          { type: Sequelize.STRING },
          {
            transaction: t
          }
        ),
        queryInterface.addColumn(
          "clients",
          "company_director_fullname",

          { type: Sequelize.STRING(255) },
          {
            transaction: t
          }
        )
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn("clients", "type", { transaction: t }),
        queryInterface.removeColumn("clients", "company_name", { transaction: t }),
        queryInterface.removeColumn("clients", "company_director_fullname", { transaction: t }),
      ]);
    });
  }
};
