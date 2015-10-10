angular.module('sudokuApp')
  .directive('keypressHandler', function () {
    'use strict';
    return {
      restrict: 'A',
      scope: true,
      link: function ($scope, $element, attributes) {
        $element.on('keydown', function (event) {
          $scope.$event = event;
          $scope.$eval(attributes.keypressHandler);
          $scope.$apply();
        });
      }
    };
  });
