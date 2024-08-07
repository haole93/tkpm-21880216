'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.hasMany(models.Image, { foreignKey: 'productId' });
      Product.belongsTo(models.Category, { foreignKey: 'categoryId' });
      Product.belongsToMany(models.Order, {
        through: 'OrderDetail',
        foreignKey: 'productId',
        otherKey: 'orderId',
      });
      Product.hasMany(models.Review, { foreignKey: 'productId' });
    }
  }
  Product.init(
    {
      name: DataTypes.STRING,
      imagePath: DataTypes.STRING,
      price: DataTypes.DECIMAL,
      description: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Product',
    }
  );
  return Product;
};
