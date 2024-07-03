


/* Get dashboard for user */
exports.getDashboard = (req, res, next) => {
    Coin.findAllTradingCoins(async (err, coins) => {
      await fetchPrice(coins).then(tempCoins => {
        res.render('index', {
          title: 'Crypto Monitoring',
          coins: tempCoins
        });
      })
    })
}  