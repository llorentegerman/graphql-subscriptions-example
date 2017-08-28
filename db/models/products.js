module.exports = function(sequelize, DataTypes) {
    const model = sequelize.define('products', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        stock: {
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
      tableName: 'products',
      timestamps: true
      
    });
    
    model.associate = function(models) {

        model.hasMany(models.orders, {foreignKey: 'products_id', sourceKey: 'id'});

    }

    return model;
};
  