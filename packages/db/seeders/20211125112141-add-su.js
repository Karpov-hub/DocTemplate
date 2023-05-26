"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let user = await queryInterface.rawSelect(
      { tableName: "users" },
      {
        where: { id: "d2050f87-c1dd-4cb8-b55d-d8fe2fd4de8a" }
      },
      ["id"]
    );
    if (!user)
      await queryInterface.bulkInsert({ tableName: "users" }, [
        {
          id: "d2050f87-c1dd-4cb8-b55d-d8fe2fd4de8a",
          login: "yalex",
          password: "qzjq2ut0ZZnywe6Q+CZ/MfRnNHRidkok1xrBhD7nf+M=",
          su: true
        }
      ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete({ tableName: "users" }, null, {});
  }
};
