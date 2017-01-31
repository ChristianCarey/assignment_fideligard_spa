fideligard.factory('userService', ['$rootScope', 'dateWidgetService', 'stockDataService',
  function($rootScope, dateWidgetService, stockDataService) {

    var stocks;
    stockDataService.get().then(function(data) {
      stocks = data;
    })

    var _user = {
      balance: 20000,
      totalBalance: 20000,
    } 

    var _portfolio = {
        symbols: {},
        total: {
          costBasis: 0,
          currentValue: 0,
          profit: 0,
          quantity: 0,
          one: 0,
          seven: 0,
          thirty: 0
        }
      };

    var get = function() {
      return _user;
    }

    var getPortfolio = function() {
      return _portfolio;
    }

    var update = function(transaction, setTotals) {
      _user.balance -= transaction.cost;
      _updateUserData(transaction, setTotals);
      $rootScope.$broadcast('userChange', _user)
    }

    var calculateUserData = function(transactions) {
      var sorted = _.sortBy(transactions, function(t) { return t.date; })
      _resetPortfolio();
      _user.totalBalance = 20000
      sorted.forEach(_updateUserData);
      _setPortfolioTotals();
    };

    var _updateUserData = function(transaction, setTotals) {
      if (setTotals !== true) { setTotals = false; }
      var atSymbol = _portfolio.symbols[transaction.symbol];
      if (!atSymbol) {
        _portfolio.symbols[transaction.symbol] = {
          costBasis: 0,
          currentValue: 0,
          profit: 0,
          quantity: 0
        };
        atSymbol = _portfolio.symbols[transaction.symbol];
      }
      _incrementPortfolio(_portfolio.total, transaction);
      _incrementPortfolio(atSymbol, transaction);
      atSymbol.currentPrice = stocks[transaction.symbol].price
      atSymbol.currentValue = atSymbol.currentPrice * atSymbol.quantity;
      atSymbol.one = stocks[transaction.symbol].one;
      atSymbol.seven = stocks[transaction.symbol].seven;
      atSymbol.thirty = stocks[transaction.symbol].thirty;
      atSymbol.profit = atSymbol.currentValue - atSymbol.costBasis;

      if (setTotals) {
        _portfolio.total.currentValue = 0;
        _portfolio.total.one = 0;
        _portfolio.total.seven = 0;
        _portfolio.total.thirty = 0;
        _setPortfolioTotals();
      }

      _user.totalBalance -= transaction.cost;
    }

    var _incrementPortfolio = function(portfolio, transaction) {
      portfolio.costBasis += transaction.cost;
      portfolio.quantity += transaction.quantity;
    }

    var _resetPortfolio = function() {
      _portfolio.symbols = {};
      _portfolio.total.costBasis = 0;
      _portfolio.total.currentValue = 0;
      _portfolio.total.quantity = 0;
      _portfolio.total.one = 0;
      _portfolio.total.seven = 0;
      _portfolio.total.thirty = 0;
    };

    var _setPortfolioTotals = function() {
      for (symbol in _portfolio.symbols) {
        var quantity = _portfolio.symbols[symbol].quantity;
        _portfolio.total.currentValue += stocks[symbol].price * quantity;
        _portfolio.total.one += stocks[symbol].one * quantity;
        _portfolio.total.seven += stocks[symbol].seven * quantity;
        _portfolio.total.thirty += stocks[symbol].thirty * quantity;
      }
      _portfolio.total.profit = _portfolio.total.currentValue - _portfolio.total.costBasis;
    }

    return {
      get: get,
      update: update,
      getPortfolio: getPortfolio,
      calculateUserData: calculateUserData
    }
  }]);