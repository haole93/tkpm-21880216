"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let data = [
      {
        name: "Admin",
        email: "hello@example.com",
        password: "Demo@123",
        phone: "1234567",
        isAdmin: true,
      },
      {
        name: "Phong",
        email: "phong@example.com",
        password: "Demo@123",
        phone: "1234567",
        isAdmin: false,
      }
    ];
    data.forEach(item => {
      item.createdAt = Sequelize.literal("NOW()");
      item.updatedAt = Sequelize.literal("NOW()");
    });
    await queryInterface.bulkInsert("Users", data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
