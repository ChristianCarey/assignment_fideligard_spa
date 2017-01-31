fideligard.controller('PortfolioCtrl', ['$scope', 'dateWidgetService', 'userService', 'transactionService',
  function($scope, dateWidgetService, userService, transactionService) {

    
    var _setDate = function() {
      $scope.currentDate = dateWidgetService.get();
    }
    
    var _setPortfolio = function() {
      $scope.portfolio = userService.getPortfolio();
    }

    var _handleDateChange = function() {
      _setDate();
      _setPortfolio();
    }

    $scope.$on('dateChange', _handleDateChange);

    _setPortfolio() 
    _setDate();
  }]);