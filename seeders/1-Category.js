'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let data = [
      { name: 'Tea Powder', imagePath: '/images/matcha4.jpg' },
      { name: 'Teawares', imagePath: '/images/kit1.jpg' },
      { name: 'Gift Sets', imagePath: '/images/giftset.jpg' },
    ];
    data.forEach(item => {
      item.createdAt = Sequelize.literal('NOW()');
      item.updatedAt = Sequelize.literal('NOW()');
    });
    await queryInterface.bulkInsert('Categories', data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {});
  },
};
