fideligard.controller('TradeCtrl', [
  '$scope', '$stateParams', '$state', 'dateWidgetService', 'stockDataService', 'userService', 'transactionService',
  function($scope, $stateParams, $state, dateWidgetService, stockDataService, userService, transactionService){
    $scope.trade = {
      symbol: $stateParams.symbol,
      quantity: 1, 
      buy: "true"
    };

    var portfolio = {}
    $scope.user = {};
    $scope.errors = [];

    angular.copy(userService.get(), $scope.user)
    angular.copy(userService.getPortfolio(), portfolio)

    $scope.findStock = function findStock(symbol){
      $scope.selectedStock = $scope.stocks[symbol]
      $scope.updateCost();
    }

    $scope.updateCost = function updateCost(){
      if($scope.selectedStock){
        $scope.trade.cost = $scope.selectedStock.price * $scope.trade.quantity
      }
    }

    $scope.validateTrade = function() {
      var form = $scope.tradeForm;
      var valid, errors = [];
      valid = form.$valid;
      if ($scope.trade.buy === 'true' && $scope.user.balance < $scope.trade.cost) {
        valid = false;
        errors.push("Not enough cash.")
      }
      if (!$scope.trade.symbol) {
        valid = false;
        errors.push("No stock selected.")
      }
      if ($scope.trade.symbol && $scope.trade.buy === 'false' && $scope.numStocksOwned < $scope.trade.quantity) {
        valid = false;
        errors.push("Not enough stocks.")
      }
      $scope.errors = errors;
      $scope.validTrade = valid;
      return valid;
    }

    $scope.submitTrade = function() {
      if (!$scope.validateTrade()) { return }

      var trade = $scope.trade;
      trade.price = $scope.selectedStock.price;
      if(trade.buy === "false") {
        trade.price *= -1;
        trade.quantity *= -1;
        trade.cost *= -1;
      }
      transactionService.create(trade)
      $state.go('portfolio')
    }

    var _setUser = function(e, user) {
      console.log(userService.get())
      angular.copy(userService.get(), $scope.user)
    }

    $scope.updateNumStocksOwned = function() {
      var num;
      if ($scope.selectedStock && portfolio.symbols[$scope.selectedStock.symbol]) {
        num = portfolio.symbols[$scope.selectedStock.symbol].quantity
      } else {
        num = 0;
      }
      $scope.numStocksOwned = num;
    }

    var _setStockData = function() {
      stockDataService.get().then(function(stocks){
        $scope.stocks = stocks;
        $scope.selectedStock = $scope.stocks[$scope.trade.symbol]
        $scope.updateCost()
        $scope.updateNumStocksOwned();
      })
    }

    var _handleDateChange = function() {
      _setStockData();
      _setUser();
    }

    _setStockData();

    $scope.$watch('trade.quantity', $scope.validateTrade);
    $scope.$watch('trade.buy', $scope.validateTrade);
    $scope.$watch('selectedStock', $scope.validateTrade);
    $scope.$on('userChange', _setUser)
    $scope.$on('dateChange', _handleDateChange)
  }
])
