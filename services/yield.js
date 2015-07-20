'use strict';

angular.module('myApp')

.factory('Yield', ['$timeout', '$q', function($timeout, $q) {
  function forEach(arr, fcn, batchSize, delay, thisArg) {
    if (!(typeof fcn === 'function')) {
      return;
    }

    delay = delay || 0;

    var promise;
    if (batchSize === undefined || batchSize == 1) {
      arr.forEach(function(e) {
        if (!promise) {
          promise = $timeout(function() { fcn.call(thisArg, e); }, delay);
        } else {
          promise = promise.then(function() {
            return $timeout(function() { fcn.call(thisArg, e); }, delay);
          });
        }
      });
    } else {
      arr.reduce(function(memo, e) {
        if (memo.length && memo[memo.length - 1].length < 2) {
          memo[memo.length-1].push(e);
        } else {
          memo.push([e]);
        }
        return memo;
      }, [])
      .forEach(function(batch) {
        if (!promise) {
          promise = $timeout(function() {
            batch.forEach(function(e) { fcn.call(thisArg, e); });
          }, delay);
        } else {
          promise = promise.then(function() {
            return $timeout(function() {
              batch.forEach(function(e) { fcn.call(thisArg, e); });
            }, delay);
          });
        }
      });
    }

    return promise;
  }

  return {
    forEach: forEach
  };
}]);
