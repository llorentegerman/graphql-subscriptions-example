import { PubSub, withFilter } from 'graphql-subscriptions';

import models from '../../db/models';

const pubsub = new PubSub();
const pageSize = 10;

const resolvers = {
    Query: {
        products: () => {
            // const offset = args.page && args.page > 1 ? (args.page - 1) * pageSize : 0;
            return models.products.findAll({ include: [models.orders] })
        },
        getOrderById: (rootValue, args) => {
            return models.orders.findById(args.order_id, { include: [models.products] })
        }
    },
    Mutation: {
        productAdd: (_, args) => {
            return models.products.create(args.product);
        },
        productEdit: (_, args) => {
            return models.sequelize.transaction()
                .then((transaction) => {
                    return models.products.findById(args.product_id, { transaction, lock: transaction.LOCK }) // Lock the row
                        .then((product) => {
                            if (product) {
                                product.description = args.product.description;
                                product.stock = product.stock + args.product.stock_to_add;
                                return product.save({ transaction })
                                    .then(() => {
                                        transaction.commit();
                                        return product.reload() // it's needed because if we didn't send a description, that returned field, will be null
                                            .then(() => {
                                                pubsub.publish('productChanged', { productChanged: product, product_id: product.id });
                                                return product;
                                            })
                                    });
                            }
                            throw new Error('product not found');
                        })
                        .catch(function (err) {
                            transaction.rollback();
                            throw err;
                        })
                })
        },
        productDelete: (_, args) => {
            return models.products.findById(args.product_id)
                .then((product) => {
                    if (product) {
                        return models.orders.sequelize.transaction((transaction) => {
                            return models.orders.destroy({
                                where: {
                                    products_id: product.id
                                }
                            }, { transaction })
                                .then(() => product.destroy({ transaction }))
                                .then(() => product);
                        });
                    }
                    throw new Error('product not found');
                })
        },

        orderAdd: (_, args) => {
            return models.sequelize.transaction()
                .then((transaction) => {
                    return models.products.findById(args.order.products_id, { transaction, lock: transaction.LOCK }) // Lock the row
                        .then((product) => {
                            if (product && product.stock >= args.order.quantity) {
                                return models.orders.create(args.order, { transaction })
                                    .then((order) => {
                                        product.stock = product.stock - order.quantity;
                                        return product.save({ transaction })
                                            .then(() => {
                                                transaction.commit();
                                                pubsub.publish('productChanged', { productChanged: product, product_id: product.id });
                                                order.product = product;
                                                return order;
                                            })
                                    })
                            }
                            const errorMessage = product ? 'Not enough stock available' : 'product not found';
                            throw new Error(errorMessage);
                        })
                        .catch(function (err) {
                            transaction.rollback();
                            throw err;
                        });
                })
        },
        orderDelete: (_, args) => {
            return models.sequelize.transaction()
                .then((transaction) => {
                    return models.orders.findById(args.order_id, { transaction, lock: transaction.LOCK })
                        .then((order) => {
                            if (!order) {
                                throw new Error('order not found');
                            }
                            return models.products.findById(order.products_id, { transaction, lock: transaction.LOCK }) // Lock the row
                                .then((product) => {
                                    if (!product) {
                                        throw new Error('product not found');
                                    }
                                    return order.destroy({ transaction })
                                        .then(() => {
                                            product.stock = product.stock + order.quantity;
                                            return product.save({ transaction })
                                                .then(() => {
                                                    transaction.commit();
                                                    pubsub.publish('productChanged', { productChanged: product, product_id: product.id });
                                                    order.product = product;
                                                    return order;
                                                })
                                        })
                                })
                        })
                        .catch(function (err) {
                            transaction.rollback();
                            throw err;
                        });

                })
        },
    },
    Subscription: {
        productChanged: {
            subscribe: withFilter(() => pubsub.asyncIterator('productChanged'), (payload, variables) => {
                return payload.product_id === variables.product_id;
            }),
        }
    }
}

module.exports = resolvers;