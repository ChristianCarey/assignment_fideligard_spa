fideligard.controller('TransactionsCtrl', ['$scope', 'transactionService', 'dateWidgetService', 'userService',  
  function($scope, transactionService, dateWidgetService, userService) {

    var _handleDateChange = function(e, date) {
      $scope.transactions = transactionService.get();
    }

    $scope.$on('dateChange', _handleDateChange)

    $scope.transactions = transactionService.get() 
  }]);