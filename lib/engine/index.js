const { BigNumber } = require('bignumber.js')

function normalizeBook (book) {
  const newBook = []

  for (const order of book) {
    if (!order.fill) order.fill = '0'

    order.remainder = BigNumber(order.quantity).minus(order.fill).toString()
    newBook.push(order)
  }

  return newBook
}

module.exports = {
  processSellOrder (req, res) {
    const buyOrders = req.body.book.sort(function(x, y) {
      if (BigNumber(x.price).isGreaterThan(y.price)) {
        return -1
      }

      if (BigNumber(x.price).isLessThan(y.price)) {
        return 1
      }

      return new Date(x.time) - new Date(y.time)
    })
    const sellOrder = req.body.order
    let sellOrderPrice = BigNumber(sellOrder.price)
    let sellOrderQty = BigNumber(sellOrder.quantity)
    const marketOrder = sellOrderPrice.isEqualTo(0)
    const trades = []

    for (const i in buyOrders) {
      if (marketOrder || sellOrderPrice.isLessThanOrEqualTo(buyOrders[i].price)) {
        if (sellOrderQty.isGreaterThanOrEqualTo(buyOrders[i].quantity)) {
          sellOrderQty = sellOrderQty.minus(buyOrders[i].quantity)
          trades.push({
            takerId: sellOrder.id,
            makerId: buyOrders[i].id,
            quantity: buyOrders[i].quantity
          })
          buyOrders[i].fill = buyOrders[i].quantity
        } else {
          buyOrders[i].fill = BigNumber(buyOrders[i].quantity).minus(sellOrderQty).toString()
          trades.push({
            takerId: sellOrder.id,
            makerId: buyOrders[i].id,
            quantity: sellOrderQty.toString()
          })
          sellOrderQty = BigNumber(0)
        }
      } else continue

      if (sellOrderQty.isEqualTo(0)) break
    }

    res.json({
      order: {
        id: sellOrder.id,
        price: sellOrder.price,
        quantity: sellOrderQty.toString()
      },
      book: normalizeBook((buyOrders)),
      trades
    })
  },

  processBuyOrder (req, res) {
    const sellOrders = req.body.book.sort(function(x, y) {
      if (BigNumber(y.price).isGreaterThan(x.price)) {
        return -1
      }

      if (BigNumber(y.price).isLessThan(x.price)) {
        return 1
      }

      return new Date(x.time) - new Date(y.time)
    })
    const buyOrder = req.body.order
    let buyOrderPrice = BigNumber(buyOrder.price)
    let buyOrderQty = BigNumber(buyOrder.quantity)
    const marketOrder = buyOrderPrice.isEqualTo(0)
    const trades = []

    for (const i in sellOrders) {
      if (marketOrder || buyOrderPrice.isGreaterThanOrEqualTo(sellOrders[i].price)) {
        if (buyOrderQty.isGreaterThanOrEqualTo(sellOrders[i].quantity)) {
          buyOrderQty = buyOrderQty.minus(sellOrders[i].quantity)
          trades.push({
            takerId: buyOrder.id,
            makerId: sellOrders[i].id,
            quantity: sellOrders[i].quantity
          })
          sellOrders[i].fill = sellOrders[i].quantity
        } else {
          sellOrders[i].fill = buyOrderQty;
          trades.push({
            takerId: buyOrder.id,
            makerId: sellOrders[i].id,
            quantity: buyOrderQty.toString()
          })
          buyOrderQty = BigNumber(0)
        }
      } else continue

      if (buyOrderQty.isEqualTo(0)) break
    }

    res.json({
      order: {
        id: buyOrder.id,
        price: buyOrder.price,
        quantity: buyOrderQty.toString()
      },
      book: normalizeBook((sellOrders)),
      trades
    })
  }
} 
