angular.module('sudokuApp')
  .factory('sudokuStorage', function (createUUID) {
    'use strict';
    var STORAGE_KEY = 'com.programmingisart.sudoku';
    var CELL_DELIMITER = '';
    var ROW_DELIMITER = '|';

    function serialize(sudokuRows) { // eslint-disable-line no-unused-vars
      return sudokuRows.map(function (row) {
        return row.join(CELL_DELIMITER);
      }).join(ROW_DELIMITER);
    }

    function deserialize(sudokuRows) {
      return sudokuRows.split(ROW_DELIMITER).map(function (row) {
        return row.split(CELL_DELIMITER).map(function (value) {
          return parseInt(value, 10);
        });
      });
    }

    var emptySudoku =
      deserialize('000000000|000000000|000000000|000000000|000000000|000000000|000000000|000000000|000000000');

    var privateStorage = {
      sudokus: {},
      loadFromStorage: function () {
        var loadedSudokus = angular.fromJson(localStorage.getItem(STORAGE_KEY));
        if (loadedSudokus != null) {
          this.sudokus = loadedSudokus;
        }
      },
      saveToStorage: function () {
        localStorage.setItem(STORAGE_KEY, angular.toJson(this.sudokus));
      }
    };

    function Sudoku(name, rows, options) {
      angular.extend(this, {uuid: createUUID(), name: name, rows: rows, editable: true});
      angular.extend(this, options);
    }

    var sudokuStorage = {
      create: function (name, rows, options) {
        rows = rows || angular.copy(emptySudoku);
        var sudoku = new Sudoku(name, rows, options);
        privateStorage.sudokus[sudoku.uuid] = sudoku;
        return sudoku;
      },
      get: function (uuid) {
        return privateStorage.sudokus[uuid];
      },
      saveSudoku: function () {
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
      sudokuStorage.create('Leeres Sudoku', undefined, {editable: false});
      sudokuStorage.create('Sudoku 1',
        deserialize('900000006|006703200|020608050|017000690|000000000|052000830|080504060|005907300|100000008'));
      sudokuStorage.create('Sudoku 2',
        deserialize('045087069|089130002|020040030|000802013|070000204|000001006|203000000|018006500|900500040'));
      sudokuStorage.create('Sudoku 3',
        deserialize('000000500|300710600|201800000|000050040|080009000|090302070|002060004|004070001|007093006'));
      sudokuStorage.create('Sudoku 4',
        deserialize('063000000|000208001|000009052|800600000|590800000|000000075|000070040|030000910|057030000'));
      sudokuStorage.saveSudoku();
    }
    return sudokuStorage;
  });

