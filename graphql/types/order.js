module.exports = `

type order {
    id: ID!
    product: product!
    customer_name: String!
    quantity: Int!
    createdAt: String!
    updatedAt: String!
}

input NewOrder {
    customer_name: String!
    products_id: Int!
    quantity: Int!
}

`