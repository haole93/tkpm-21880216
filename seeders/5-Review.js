'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let data = [
      {
        review:
          'The matcha turned out to be smooth and creamy and it doesn’t taste very bitter. It has a nice deep flavour that is not too overpowering.',
        stars: 4.5,
        productId: 1,
        userId: 1,
      },
      {
        review:
          'Works like magic. I managed to poop after about 10 hours. Taste is ok.',
        stars: 4.8,
        productId: 5,
        userId: 1,
      },
      {
        review:
          'It worked well and was very gentle (though I could still feel the effects). Would use it again.',
        stars: 4.4,
        productId: 2,
        userId: 1,
      },
      {
        review:
          'Think I have all I need to make my own cup of matcha! Have tried bitter matcha before, but this tasted great!',
        stars: 5,
        productId: 3,
        userId: 1,
      },
    ];
    data.forEach(item => {
      item.createdAt = Sequelize.literal('NOW()');
      item.updatedAt = Sequelize.literal('NOW()');
    });
    await queryInterface.bulkInsert('Reviews', data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Reviews', null, {});
  },
};
