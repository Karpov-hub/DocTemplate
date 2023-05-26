"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      {
        tableName: "orders"
      },
      {
        id: {
          allowNull: false,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          type: Sequelize.UUID
        },
        client_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: "clients",
            key: "id"
          },
          onUpdate: "cascade",
          onDelete: "cascade"
        },
        template_name: {
          type: Sequelize.STRING(50)
        },
        requirements: {
          type: Sequelize.TEXT
        },
        attached_files: {
          type: Sequelize.ARRAY(Sequelize.UUID)
        },
        status: {
          type: Sequelize.INTEGER
        },
        operator_id: {
          type: Sequelize.UUID
        },
        note: {
          type: Sequelize.TEXT
        },
        ctime: {
          type: Sequelize.DATE
        },
        template_id: {
          type: Sequelize.UUID
        },
        type: {
          type: Sequelize.INTEGER
        }
      }
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable({
      tableName: "orders"
    });
  }
};
