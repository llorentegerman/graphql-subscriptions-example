module.exports = function(sequelize, DataTypes) {
    const model = sequelize.define('orders', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        products_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        customer_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    }, {
      tableName: 'orders',
      timestamps: true
      
    });

    model.associate = function(models) {

        model.belongsTo(models.products, {foreignKey: 'products_id', targetKey: 'id'});

    }

    return model;
};
  