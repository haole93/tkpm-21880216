'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let data = [
      {
        name: 'Uji Matcha Powder',
        imagePath: '/images/product-1.jpg',
        price: 29.0,
        description:
          'Intense grassy umami, with a hint of tannic, bittersweet undertones.',
        quantity: 5,
        categoryId: 1,
      },
      {
        name: 'Ceremonial Hojicha Powder',
        imagePath: '/images/product-2.jpg',
        price: 19.0,
        description:
          'Pure Uji Hojicha powder. Intense roast, smoky with notes of hazelnut and coffee.',
        quantity: 10,
        categoryId: 1,
      },
      {
        name: 'Barista Matcha Powder',
        imagePath: '/images/product-3.jpg',
        price: 21.0,
        description:
          'Use for a piping hot cup of Matcha Latte, baking delectable pastries, or anything else you might imagine. ',
        quantity: 15,
        categoryId: 1,
      },
      {
        name: 'Tea Whisk',
        imagePath: '/images/product-4.jpg',
        price: 10.0,
        description: 'Whisk up silky smooth Matcha under 30 seconds.',
        quantity: 15,
        categoryId: 2,
      },
      {
        name: 'Chawan',
        imagePath: '/images/product-5.jpg',
        price: 9.0,
        description: 'Double-walled to keep Matcha warm and your hands cool..',
        quantity: 15,
        categoryId: 2,
      },
      {
        name: 'Kyoto Morning Set',
        imagePath: '/images/product-6.jpg',
        price: 89.0,
        description:
          'Discover and appreciate different types of Matcha and Hojicha. Create over 10 different types of drinks.',
        quantity: 15,
        categoryId: 3,
      },
      {
        name: 'Awakening Gift Set',
        imagePath: '/images/product-7.jpg',
        price: 69.0,
        description:
          'Make Matcha the traditional way, with our best-selling organic, ceremonial-grade Uji Matcha',
        quantity: 15,
        categoryId: 3,
      },
    ];
    data.forEach(item => {
      item.createdAt = Sequelize.literal('NOW()');
      item.updatedAt = Sequelize.literal('NOW()');
    });
    await queryInterface.bulkInsert('Products', data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {});
  },
};
