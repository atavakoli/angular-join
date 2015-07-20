'use strict';

angular.module('myApp')

.factory('DataSvc', function() {
  function randInt(min, max) {
    return Math.floor(Math.random() * (1 + max - min)) + min;
  }
  
  var people = ['Joe', 'Bob', 'Rick', 'Sam'];
  
  var startDay = moment().startOf('year');
  
  function getSimpleRow(i, field, min, max) {
    var row = {i: i};
    row[field] = randInt(min, max);
    return row;
  }

  function getComplexRow(i, field, min, max) {
    var row = {
      date: moment(startDay).add(Math.floor(i / people.length), 'days'),
      person: people[i % people.length]
    };
    row.ts = row.date.unix();
    row[field] = randInt(min, max);
    return row;
  }
 
  function makeData(start, n, field, min, max, getRowFcn) {
    var data = [];
    for (var i = start; i < start + n; ++i) {
      data.push(getRowFcn(i, field, min, max));
    }
    return data;
  }
 
  function makeSimpleData(start, n, field, min, max) {
    return makeData(start, n, field, min, max, getSimpleRow);
  }

  function makeComplexData(start, n, field, min, max) {
    return makeData(start, n, field, min, max, getComplexRow);
  }

  return {
    makeSimpleData: makeSimpleData,
    makeComplexData: makeComplexData
  };
});
