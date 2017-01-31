fideligard.controller('UserDataCtrl', ['$scope', 'transactionService', 'dateWidgetService', 'userService',
  function($scope, transactionService, dateWidgetService, userService) {

    var _handleDateChange = function() {
      var transactions = transactionService.get();
      userService.calculateUserData(transactions)
    }

    $scope.$on('dateChange', _handleDateChange)
  }]) ;