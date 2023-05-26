"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn(
          "templates_categories",
          "group_id",
          {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
              model: "groups",
              key: "id"
            },
            onUpdate: "cascade",
            onDelete: "cascade"
          },
          {
            transaction: t
          }
        ),
        queryInterface.addColumn(
          "templates_categories",
          "life_situation_id",
          {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
              model: "life_situations",
              key: "id"
            },
            onUpdate: "cascade",
            onDelete: "cascade"
          },
          {
            transaction: t
          }
        ),
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn("templates_categories", "group_id", { transaction: t }),
        queryInterface.removeColumn("templates_categories", "life_situation_id", { transaction: t }),
      ]);
    });
  }
};
