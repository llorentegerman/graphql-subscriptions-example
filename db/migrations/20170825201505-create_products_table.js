'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable(
      'products',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: Sequelize.STRING,
          defaultValue: false,
          allowNull: false
        },
        description: {
          type: Sequelize.STRING,
          defaultValue: false,
          allowNull: true
        },
        stock: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
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
    return queryInterface.dropTable('products');
  }
};
