fideligard.factory('stockDataService', [
  '$http', '$q', '_', 'dateWidgetService',
  function($http, $q, _, dateWidgetService){
    var _raw = {},
     _data = {};

    var setData = function setData(quote){
      for(var i = 0; i < quote.length; i++){
        if(!_raw[quote[i][0]]) _raw[quote[i][0]] = {};
        _raw[quote[i][0]][quote[i][1]] = {
          open: quote[i][2],
          high: quote[i][3],
          low: quote[i][4],
          close: quote[i][5],
          volume: quote[i][6]
        }
      }
    }

    var getStockData = function getStockData(){
      if(_.isEmpty(_raw)){
        return $http.get('/data/stocks.json').then(function(resp){
          setData(resp.data);
          return _raw
        })
      }
      return $q(function(resolve){ resolve(_raw) });
    }

    var updateData = function updateData(date){
      angular.copy({}, _data);
      for(symbol in _raw){
        var today = _minusDays(date, symbol, 0);
        var oneDayAgo = _minusDays(date, symbol, 1);
        var sevenDaysAgo = _minusDays(date, symbol, 7);
        var thirtyDaysAgo = _minusDays(date, symbol, 30);        
        if(today){
          if(!_data[symbol]) _data[symbol] = { symbol: symbol };
          _data[symbol].price = today.close;
          _data[symbol].one = oneDayAgo ? today.close - oneDayAgo.close  : "N/A";
          _data[symbol].seven = sevenDaysAgo ? today.close - sevenDaysAgo.close : "N/A";
          _data[symbol].thirty = thirtyDaysAgo ? today.close - thirtyDaysAgo.close : "N/A";
        }
      }
      return _data;
    }

    var getData = function getData(){
      return getStockData().then(function(){
        return updateData(dateWidgetService.get())
      })
    }

    var _minusDays = function _minusDays(date, symbol, numDays) {
      var dateCopy = new Date(date);
      var newDate = new Date(dateCopy.setDate(dateCopy.getDate() - numDays));
      var count = 4;
      newDate = newDate.toISOString().slice(0,10)
      while (!_raw[symbol][newDate] && count > 0) {
        newDate = new Date(dateCopy.setDate(dateCopy.getDate() - 1));
        newDate = newDate.toISOString().slice(0,10)
        count--;
      }
      return _raw[symbol][newDate];
    }

    return {
      get: getData,
      update: updateData
    };
  }
])
