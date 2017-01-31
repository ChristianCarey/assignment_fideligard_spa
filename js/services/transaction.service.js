fideligard.factory('transactionService', ['dateWidgetService', '$rootScope', 'userService',
  function(dateWidgetService, $rootScope, userService) {

    var _transactions = {};

    var get = function() {
      return _currentAndPastTransactions();
    }
 
    var create = function(data) {
      var date = dateWidgetService.get() 
      var transaction = {
        date: date,
        symbol: data.symbol,
        price: data.price,
        quantity: data.quantity,
        cost: data.cost,
        initalBalance: userService.get().balance
      }

      if (!_transactions[date]) {
        _transactions[date] = [];
      }
      _transactions[date].push(transaction);
      userService.update(transaction, true);  
    }

    var _currentAndPastTransactions = function() {
      var results = [];
      var currentDate = new Date(dateWidgetService.get());
      for (date in _transactions) {
        dateCopy = new Date(date);
        if (dateCopy <= currentDate) {
          _transactions[date].forEach(function(transaction) {
            results.push(transaction);
          })
        }
      }
      return results;
    }

    return {
      get: get,
      create: create
    }
  }]);