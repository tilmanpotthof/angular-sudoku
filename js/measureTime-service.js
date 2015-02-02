angular.module('sudokuApp').factory('measureTime', function () {
  "use strict";
  return   function measureTime(fn) {
    var startTime = (new Date()).valueOf();
    fn();
    return (new Date()).valueOf() - startTime;
  };
});
