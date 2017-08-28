import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import resolvers from './resolvers';
import * as types from './types';

const rootQuery = `
    type Query {
        products: [product]
        getOrderById(order_id: Int): order
    }

    type Mutation {
        productAdd(product: NewProduct): product
        productEdit(product_id: Int!, product: EditableProduct): product
        productDelete(product_id: Int!): product
        
        orderAdd(order: NewOrder): order
        
        orderDelete(order_id: Int!): order
    }

    type Subscription {
        productChanged(product_id: Int!): product
    }
`;

const schema = makeExecutableSchema({
    typeDefs: [rootQuery,
        types.order, types.product],
    resolvers
});

module.exports = schema;