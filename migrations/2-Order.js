"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("Orders", "process", Sequelize.STRING),
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Orders");
  },
};