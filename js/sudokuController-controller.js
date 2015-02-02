angular.module('sudokuApp').controller('sudokuController', function ($scope, sudokuService, sudokuView, sudokuStorage, measureTime, $location) {
  "use strict";
  $scope.inEditMode = function () {
    return $scope.sudokuView.editFixedValues;
  };
  $scope.createSudoku = function () {
    $scope.sudokuView.editFixedValues = true;
    $scope.currentSudoku = sudokuStorage.create("");
  };
  $scope.removeSudoku = function () {
    if ($scope.currentSudoku.editable && confirm("Möchten Sie das Sudoku '" + $scope.currentSudoku.name + "' wirklich löschen?")) {
      sudokuStorage.removeSudoku($scope.currentSudoku);
      $scope.currentSudoku = sudokuStorage.sudokus()[0];
    }
  };
  $scope.edit = function () {
    $scope.sudokuView.editFixedValues = true;
  };
  $scope.save = function () {
    $scope.sudokuView.editFixedValues = false;
    $scope.currentSudoku.rows = $scope.sudokuModel.visitMap(function (field) {
      return field.value();
    });
    sudokuStorage.saveSudoku($scope.currentSudoku);
  };
  $scope.cancel = function () {
    $scope.sudokuView.editFixedValues = false;
  };
  $scope.updateSudoku = function () {
    var sudokuModel = sudokuService.createSudoku($scope.currentSudoku.rows);
    $scope.sudokuModel = sudokuView.sudoku(sudokuModel);
  };
  $scope.solveLogic = function () {
    $scope.time = measureTime($scope.sudokuModel.solveLogic.bind($scope.sudokuModel));
  };
  $scope.solveBacktracking = function () {
    $scope.time = measureTime($scope.sudokuModel.solveBacktracking.bind($scope.sudokuModel));
  };
  $scope.solveBacktrackingCount = function () {
    $scope.time = measureTime(function () {
      $scope.solutionCount = $scope.sudokuModel.solveBacktrackingCount();
    });
  };
  $scope.$watch("currentSudoku", function () {
    $location.url($scope.currentSudoku.uuid);
  });
  var UUID_REGEX = /^\/[0-f]{8}-[0-f]{4}-[0-f]{4}-[0-f]{4}-[0-f]{12}$/;
  if ($location.url().match(UUID_REGEX)) {
    var uuid = $location.url().slice(1);
    $scope.currentSudoku = sudokuStorage.get(uuid);
  } else {
    $scope.currentSudoku = sudokuStorage.sudokus()[0];
  }
  $scope.sudokuView = sudokuView;
  $scope.sudokuStorage = sudokuStorage;
  $scope.updateSudoku();
});
