angular.module('sudokuApp').factory('sudokuStorage', function (createUUID) {
  "use strict";

  var STORAGE_KEY = "com.programmingisart.sudoku";

  var emptySudoku = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];

  var privateStorage = {
    sudokus: {},
    loadFromStorage: function () {
      var loadedSudokus = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (loadedSudokus != null) {
        this.sudokus = loadedSudokus;
      }
    },
    saveToStorage: function () {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.sudokus));
    }
  };

  function Sudoku(name, rows, options) {
    this.uuid = createUUID();
    this.name = name;
    this.rows = rows;
    this.editable = true;
    angular.extend(this, options);
  }

  var sudokuStorage = {
    create: function (name, rows, options) {
      rows = rows || angular.copy(emptySudoku);
      var sudoku = new Sudoku(name, rows, options);
      this.saveSudoku(sudoku);
      return sudoku;
    },
    saveSudoku: function (sudoku) {
      privateStorage.sudokus[sudoku.uuid] = sudoku;
      privateStorage.saveToStorage();
    },
    removeSudoku: function (sudoku) {
      delete privateStorage.sudokus[sudoku.uuid];
      privateStorage.saveToStorage();
    },
    sudokus: function () {
      return Object.keys(privateStorage.sudokus).map(function (key) {
        return privateStorage.sudokus[key];
      });
    }
  };

  privateStorage.loadFromStorage();

  if (sudokuStorage.sudokus().length === 0) {
    sudokuStorage.create("Leeres Sudoku", undefined, {editable: false});
    sudokuStorage.create("Sudoku 1", [
      [9, 0, 0, 0, 0, 0, 0, 0, 6],
      [0, 0, 6, 7, 0, 3, 2, 0, 0],
      [0, 2, 0, 6, 0, 8, 0, 5, 0],
      [0, 1, 7, 0, 0, 0, 6, 9, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 5, 2, 0, 0, 0, 8, 3, 0],
      [0, 8, 0, 5, 0, 4, 0, 6, 0],
      [0, 0, 5, 9, 0, 7, 3, 0, 0],
      [1, 0, 0, 0, 0, 0, 0, 0, 8]
    ]);
    sudokuStorage.create("Sudoku 2", [
      [0, 4, 5, 0, 8, 7, 0, 6, 9],
      [0, 8, 9, 1, 3, 0, 0, 0, 2],
      [0, 2, 0, 0, 4, 0, 0, 3, 0],
      [0, 0, 0, 8, 0, 2, 0, 1, 3],
      [0, 7, 0, 0, 0, 0, 2, 0, 4],
      [0, 0, 0, 0, 0, 1, 0, 0, 6],
      [2, 0, 3, 0, 0, 0, 0, 0, 0],
      [0, 1, 8, 0, 0, 6, 5, 0, 0],
      [9, 0, 0, 5, 0, 0, 0, 4, 0]
    ]);
    sudokuStorage.create("Sudoku 3", [
      [0, 0, 0, 0, 0, 0, 5, 0, 0],
      [3, 0, 0, 7, 1, 0, 6, 0, 0],
      [2, 0, 1, 8, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 5, 0, 0, 4, 0],
      [0, 8, 0, 0, 0, 9, 0, 0, 0],
      [0, 9, 0, 3, 0, 2, 0, 7, 0],
      [0, 0, 2, 0, 6, 0, 0, 0, 4],
      [0, 0, 4, 0, 7, 0, 0, 0, 1],
      [0, 0, 7, 0, 9, 3, 0, 0, 6]
    ]);
    sudokuStorage.create("Sudoku 4", [
      [0, 6, 3, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 2, 0, 8, 0, 0, 1],
      [0, 0, 0, 0, 0, 9, 0, 5, 2],
      [8, 0, 0, 6, 0, 0, 0, 0, 0],
      [5, 9, 0, 8, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 7, 5],
      [0, 0, 0, 0, 7, 0, 0, 4, 0],
      [0, 3, 0, 0, 0, 0, 9, 1, 0],
      [0, 5, 7, 0, 3, 0, 0, 0, 0]
    ]);
  }


  return sudokuStorage;
});

