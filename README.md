# Order Engine

> An order matching/processing engine with a JSON-based RESTful API, written in Node.js

### Running the engine

 1. Copy the contents of `.env.example` into a new file: `.env.development` or `.env.production` and configure accordingly.
 2. Start server:

        # single instance
        node index.js
        
        # cluster mode
        pm2 start

### API

#### Routes
The following POST routes are available:
 - `/sell` -> Submit a sell order
 - `/buy` -> Submit a buy order

#### JSON structure

##### Payload structure

  ```
    {
      "order": { <- Incoming/taker order
        "id": "ANY: a unique identifier for incoming order",
        "price": "NUMBER: price to execute order (zero indicates market order)",
        "quantity": "NUMBER: order amount"
      },
      "book": [ <- Resting/maker orders
        {
          "id": "ANY: a unique identifier for incoming order",
          "price": "NUMBER: price to execute order (must be greater than zero)",
          "quantity": "NUMBER: order amount"
          "time": "DATETIME: ISO datetime string"
        },
        ...
      ]
    }
  ```

##### Response structure
  ```
  {
    "order": { <- Incoming/taker order
      "id": "ANY: a unique identifier for incoming order",
      "price": "NUMBER: price to execute order (zero indicates market order)",
      "quantity": "NUMBER: order amount"
    },
    "book": [
      {
        "id": "ANY: a unique identifier for incoming order",
        "price": "NUMBER: price to execute order (must be greater than zero)",
        "quantity": "NUMBER: order amount"
        "time": "DATETIME: ISO datetime string"
        "fill": "NUMBER: how much of the order quantity has been fulfilled",
        "remainder": "NUMBER: how much of the order quantity is unfulfilled"
      },
      ...
    ],
    "trades": [
      {
        "takerId": "ANY: incoming order identifier",
        "makerId": "ANY: resting order identifier",
        "quantity": "NUMBER: amount traded between taker and maker"
      },
      ...
    ]
  }
  ```

##### Sample payload

  ```json
    {
      "order": {
        "id": "5",
        "price": "0",
        "quantity": "46"
      },
      "book": [
        {
          "id": "1",
          "price": "0.3",
          "quantity": "21",
          "time": "2019-06-19T10:15:40.749Z"
        },
        {
          "id": "2",
          "price": "0.245",
          "quantity": "40",
          "time": "2019-06-18T10:15:40.749Z"
        },
        {
          "id": "3",
          "price": "0.401",
          "quantity": "66",
          "time": "2019-06-17T10:15:40.749Z"
        },
        {
          "id": "4",
          "price": "0.3",
          "quantity": "8",
          "time": "2019-06-16T10:15:40.749Z"
        }
      ]
    }
  ```

##### Sample response for `/buy`
  ```json
  {
    "order": {
      "id": "5",
      "price": "0",
      "quantity": "0"
    },
    "book": [
      {
        "id": "2",
        "price": "0.245",
        "quantity": "40",
        "time": "2019-06-18T10:15:40.749Z",
        "fill": "40",
        "remainder": "0"
      },
      {
        "id": "4",
        "price": "0.3",
        "quantity": "8",
        "time": "2019-06-16T10:15:40.749Z",
        "fill": "2",
        "remainder": "6"
      },
      {
        "id": "1",
        "price": "0.3",
        "quantity": "21",
        "time": "2019-06-19T10:15:40.749Z",
        "fill": "0",
        "remainder": "21"
      },
      {
        "id": "3",
        "price": "0.401",
        "quantity": "66",
        "time": "2019-06-17T10:15:40.749Z",
        "fill": "0",
        "remainder": "66"
      }
    ],
    "trades": [
      {
        "takerId": "5",
        "makerId": "2",
        "quantity": "40"
      },
      {
        "takerId": "5",
        "makerId": "4",
        "quantity": "6"
      }
    ]
  }
  ```

##### Sample response for `/sell`

  ```json
  {
    "order": {
      "id": "5",
      "price": "0",
      "quantity": "0"
    },
    "book": [
      {
        "id": "3",
        "price": "0.401",
        "quantity": "66",
        "time": "2019-06-17T10:15:40.749Z",
        "fill": "20",
        "remainder": "46"
      },
      {
        "id": "4",
        "price": "0.3",
        "quantity": "8",
        "time": "2019-06-16T10:15:40.749Z",
        "fill": "0",
        "remainder": "8"
      },
      {
        "id": "1",
        "price": "0.3",
        "quantity": "21",
        "time": "2019-06-19T10:15:40.749Z",
        "fill": "0",
        "remainder": "21"
      },
      {
        "id": "2",
        "price": "0.245",
        "quantity": "40",
        "time": "2019-06-18T10:15:40.749Z",
        "fill": "0",
        "remainder": "40"
      }
    ],
    "trades": [
      {
        "takerId": "5",
        "makerId": "3",
        "quantity": "46"
      }
    ]
  }
  ```