module.exports = `

type product {
    id: ID!
    name: String!
    description: String
    stock: Int!
    createdAt: String!
    updatedAt: String!
    orders: [order]
}

input NewProduct {
    name: String!
    description: String
    stock: Int!
}

input EditableProduct {
    description: String
    stock_to_add: Int!
}

`