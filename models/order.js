'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.belongsTo(models.User, { foreignKey: 'userId' });
      Order.belongsToMany(models.Product, {
        through: 'OrderDetail',
        foreignKey: 'orderId',
        otherKey: 'productId',
      });
      Order.hasMany(models.OrderDetail, { foreignKey: 'orderId' });
    }
  }
  Order.init(
    {
      quantity: DataTypes.INTEGER,
      total: DataTypes.DECIMAL,
      subtotal: DataTypes.DECIMAL,
      shippingAddress: DataTypes.STRING,
      paymentMethod: DataTypes.STRING,
      status: DataTypes.STRING,
      process: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Order',
    }
  );
  return Order;
};
