'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable(
      'orders',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        products_id: {
          type: Sequelize.INTEGER,
          references: {
            model: 'products',
            key: 'id'
          },
          defaultValue: false,
          allowNull: false
        },
        customer_name: {
          type: Sequelize.STRING,
          defaultValue: false,
          allowNull: false
        },
        quantity: {
          type: Sequelize.INTEGER,
          defaultValue: 1,
          allowNull: false
        },
        createdAt: {
          type: Sequelize.DATE
        },
        updatedAt: {
          type: Sequelize.DATE
        },
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('orders');
  }
};
