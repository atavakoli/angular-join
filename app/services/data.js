'use strict';

angular.module('myApp')

.factory('DataSvc', function() {
  function randInt(min, max) {
    return Math.floor(Math.random() * (1 + max - min)) + min;
  }
  
  var people = ['Joe', 'Bob', 'Rick', 'Sam'];
  
  var startDay = moment().startOf('year');
  
  function getRow(field, min, max) {
    var row = {
      date: moment(startDay).add(randInt(0,2), 'days'),
      person: people[randInt(0, people.length - 1)],
    };
    row[field] = randInt(min, max);
    return row;
  }

  function makeData(n, field, min, max) {
    var data = [];
    for (var i = 0; i < n; ++i) {
      data.push(getRow(field, min, max));
    }
    return data;
  }
  
  return {
    makeData: makeData
  };
});
