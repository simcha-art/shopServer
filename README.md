# shopServer


## Routes

|METHOD      |ROUTE                     |explain   |
|------------|--------------------------|---|
|GET         |/                         |opening message|
|GET         |/health                   |check the server is on|
|GET         |/products                 |a list of products with filter|
|GET         |/cart                     |get query param of customer id and show his cart|
|GET         |/account/balance          |get query param of customer id and show his current balance
|GET         |/orders                   |get query param of customer id and show his order history
|POST        |/cart/items               |get query param of customer id and add a product to his cart
|DELETE      |/cart/items/:productId    |remove product from cart by product id in path and with customer id in query
|POST        |/orders/checkout          |get query param of customer id, handle checkout and creates a new order
___




















## How to run

```
npm start
```