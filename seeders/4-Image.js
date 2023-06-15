'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const items = [
      {
        name: 'uji matcha',
        imagePath: '/images/product-1.jpg',
        productId: 1,
      },
      {
        name: 'hojicha',
        imagePath: '/images/product-2.jpg',
        productId: 2,
      },
      {
        name: 'barista matcha',
        imagePath: '/images/product-3.jpg',
        productId: 3,
      },
      {
        name: 'whisk',
        imagePath: '/images/product-4.jpg',
        productId: 4,
      },
      {
        name: 'chawan',
        imagePath: '/images/product-5.jpg',
        productId: 5,
      },
      {
        name: 'kyoto set',
        imagePath: '/images/product-6.jpg',
        productId: 6,
      },
      {
        name: 'awakening set',
        imagePath: '/images/product-7.png',
        productId: 7,
      },
    ];
    items.forEach(item => {
      item.createdAt = Sequelize.literal('NOW()');
      item.updatedAt = Sequelize.literal('NOW()');
    });
    await queryInterface.bulkInsert('Images', items, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Images', null, {});
  },
};
