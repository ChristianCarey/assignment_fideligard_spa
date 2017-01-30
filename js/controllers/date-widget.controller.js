
fideligard.controller("DateWidgetCtrl", [
  '$scope', "dateWidgetService",
  function($scope, dateWidgetService){
    $scope.selectedDate = dateWidgetService.get();

    $scope.dateOptions = {
      minDate: new Date('2014-05-03 00:00:00'),
      maxDate: new Date('2014-12-31 00:00:00'),
      initDate: $scope.selectedDate
    }

    $scope.updateDate = function updateDate(date){
      dateWidgetService.set(date);
    }

    $scope.toggle = function toggle(){
      $scope.opened = !$scope.opened;
    }
  }
])
