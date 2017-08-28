## GraphQL Subscriptions Example

Install dependencies:
`npm install` or `yarn install`

Run migrations (sqlite database)
`npm run migrations` or `yarn run migrations`

Start server
`npm run start` or `yarn run start`

Open graphiql in two differents tabs:
`http://localhost:5678/graphiql`

In the first one run the next mutation:
```
mutation addProduct {
  productAdd(product: {
    name: "coffee"
    description: "the best coffee"
    stock: 12
  }) {
    id
    name
    description
    stock
  }
}
```

In the second one,  run the subscription:
```
subscription product {
  productChanged(product_id: 1) {
    name
    description
    stock
  }
}
```

Back to the first tab, run the next mutation to create an order and decrease stock, you should see the remaining stock (**9**) in the second tab
```
mutation createOrder {
  orderAdd(order: {
    customer_name: "German"
    products_id: 1
    quantity: 3
  }) {
    id
  }
}
```