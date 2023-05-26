"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let client1 = await queryInterface.rawSelect(
      { tableName: "clients" },
      {
        where: { id: "d2050f87-c1dd-4cb8-b55d-d8fe2fd4de8a" }
      },
      ["id"]
    );
    if (!client1)
      await queryInterface.bulkInsert({ tableName: "clients" }, [
        {
          id: "d2050f87-c1dd-4cb8-b55d-d8fe2fd4de8a",
          email: "yalex",
          password: "hgEnWb79N2Nt9cyUrWc2dqM2YWrNi2FWrhv9r3dGWSQ=",
          activated: false
        }
      ]);
    let client2 = await queryInterface.rawSelect(
      { tableName: "clients" },
      {
        where: { id: "d2050f87-c1dd-4cb8-b55d-d8fe2fd4de8b" }
      },
      ["id"]
    );
    if (!client2)
      await queryInterface.bulkInsert({ tableName: "clients" }, [
        {
          id: "d2050f87-c1dd-4cb8-b55d-d8fe2fd4de8b",
          email: "savil20999@v3dev.com",
          password: "hgEnWb79N2Nt9cyUrWc2dqM2YWrNi2FWrhv9r3dGWSQ=",
          activated: true
        }
      ]);
    let client3 = await queryInterface.rawSelect(
      { tableName: "clients" },
      {
        where: { id: "d2050f87-c1dd-4cb8-b55d-d8fe2fd4de8c" }
      },
      ["id"]
    );
    if (!client3)
      await queryInterface.bulkInsert({ tableName: "clients" }, [
        {
          id: "d2050f87-c1dd-4cb8-b55d-d8fe2fd4de8c",
          email: "yalex3",
          password: "hgEnWb79N2Nt9cyUrWc2dqM2YWrNi2FWrhv9r3dGWSQ=",
          activated: true,
          block: true
        }
      ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete({ tableName: "clients" }, null, {});
  }
};
