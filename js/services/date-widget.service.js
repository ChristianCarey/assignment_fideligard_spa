fideligard.factory('dateWidgetService', [
  '$rootScope',
  function($rootScope){
    // var _date = {
    //   value: new Date('2014', '01', '01')
    // }
    // getDate = function getDate(){
    //   return _date
    // }
    //
    // parseDate = function parseDate(str){
    //   return Date.parse(_date.value);
    // }
    var _date = new Date('2014-05-03 00:00:00');

    getDate = function getDate(){
      return _date
    }

    setDate = function parseDate(str){
      _date = new Date(str)
      $rootScope.$broadcast('dateChange', _date);
    }

    return {
      get: getDate,
      set: setDate
    }
  }
])
