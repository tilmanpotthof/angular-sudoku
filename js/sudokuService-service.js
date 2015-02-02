angular.module('sudokuApp').factory('sudokuService', function (createUUID, $log, sudokuStorage) {
  "use strict";
  function SudokuField(value, x, y) {
    angular.extend(this, {x: x, y: y, _value: value, fixedValue: 1 <= value && value <= 9})
  }

  //@ http://jsfromhell.com/array/shuffle [v1.0]
  function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
  }

  function logicOr(a,b) {
    if (a instanceof Array) {
      a = a.reduce(logicOr);
    }
    if (b instanceof Array) {
      b = b.reduce(logicOr);
    }
    return a || b;
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  SudokuField.prototype = {
    displayValue: function () {
      return this._value || '';
    },
    value: function (value) {
      if (angular.isNumber(value)) {
        this._value = value;
      }
      return this._value;
    },
    isFixedValue: function () {
      return this.fixedValue === true;
    }
  };

  function LogicSudokuModel() {
    this.values = [];
    for (var i = 0; i < 9 * 9; i++) {
      this.values.push([null, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    }
  }

  LogicSudokuModel.prototype = {
    get: function (x, y) {
      return this.values[y * 9 + x];
    },
    setFinalValue: function (x, y, value) {
      this.values[y * 9 + x] = [value];
    },
    solved: function (x, y) {
      return this.get(x, y).length === 1;
    },
    possibilities: function (x, y) {
      return this.get(x, y).filter(function (possible) {
        return possible;
      });
    },
    solution: function (x, y) {
      var self = this;
      var possibilities = this.possibilities(x, y);
      if (possibilities.length === 1) {
        return possibilities[0];
      }
      var currentPossibility;
      var foundMatch = possibilities.some(function (possibility) {
        currentPossibility = possibility;
        var iX, iY, horizontal, vertical, field3x3;
        horizontal = vertical = field3x3 = true;
        for (var i = 0; i < 9; i++) {
          vertical = vertical && self.get(x, i)[possibility] && i !== y;
          horizontal = horizontal && self.get(i, y)[possibility] && i !== x;
          iX = (Math.floor(x / 3) * 3) + i % 3;
          iY = (Math.floor(y / 3) * 3) + Math.floor(i / 3);
          field3x3 = field3x3 && self.get(iX, iY)[possibility] && !(x === iX && y === iY);
        }
        return horizontal || vertical || field3x3;
      });
      if (foundMatch) {
        return currentPossibility;
      }
    },
    solveStep: function (field) {
      if (!field.value()) {
        var solution = this.solution(field.x, field.y);
        if (solution) {
          field.value(solution);
          this.setField(field);
          return true;
        }
      }
      return false;
    },
    exclude: function (x, y, value) {
      if (!this.solved(x, y) && value) {
        this.get(x, y)[value] = false;
      }
    },
    setField: function (sudokuField) {
      var i, x, y;
      this.setFinalValue(sudokuField.x, sudokuField.y, sudokuField.value());

      for (i = 0; i < 9; i++) {
        this.exclude(sudokuField.x, i, sudokuField.value());
        this.exclude(i, sudokuField.y, sudokuField.value());

        x = (Math.floor(sudokuField.x / 3) * 3) + i % 3;
        y = (Math.floor(sudokuField.y / 3) * 3) + Math.floor(i / 3);
        this.exclude(x, y, sudokuField.value());
      }
    }
  };

  function Sudoku(rows) {
    this.rawRows = rows;
    this.rows = rows.map(function (row, y) {
      return row.map(function (value, x) {
        return new SudokuField(value, x, y);
      });
    });
  }

  Sudoku.prototype = {
    get: function (x, y) {
      return this.rows[y][x];
    },
    visit: function (callback) {
      this.rows.some(function (row) {
        return row.some(callback);
      });
    },
    visitMap: function (callback) {
      return this.rows.map(function (row) {
        return row.map(callback);
      });
    },
    clear: function () {
      this.visit(function (field) {
        if (!field.isFixedValue()) {
          field.value(0);
        }
      });
    },
    matches: function (field) {
      var i, x, y;
      if (field.value()) {
        for (i = 0; i < 9; i++) {
          if (this.get(field.x, i).value() === field.value() && i !== field.y) {
            return false;
          }
          if (this.get(i, field.y).value() === field.value() && i !== field.x) {
            return false;
          }

          x = (Math.floor(field.x / 3) * 3) + i % 3;
          y = (Math.floor(field.y / 3) * 3) + Math.floor(i / 3);
          if (this.get(x, y).value() === field.value() && !(field.x === x && field.y === y)) {
            return false;
          }
        }
      }
      return true;
    },
    solveLogic: function () {
      var logicModel = new LogicSudokuModel();
      var solveStep = logicModel.solveStep.bind(logicModel);

      this.visit(function (field) {
        if (field.value()) {
          logicModel.setField(field);
        }
      });

      var i = 0;
      while(this.visitMap(solveStep).reduce(logicOr) && i < 100) {
        i++;
      }
      this.visit(function (field) {
        var possibilities = logicModel.possibilities(field.x, field.y)
        if (possibilities.length > 1) {
          console.log(field.x, field.y, possibilities);
        }
      });
    },
    solveBacktracking: function (i, enableShuffle) {
      var iNum, x, y, field;
      var nums = [1,2,3,4,5,6,7,8,9];
      if (enableShuffle) {
        shuffle(nums);
      }
      i = i || 0;

      if (i === 81) {
        return true;
      }

      x = i % 9;
      y = Math.floor(i / 9);
      field = this.get(x, y);

      if (field.isFixedValue()) {
        return this.solveBacktracking(i + 1, enableShuffle);
      } else {
        for (iNum = 0; iNum < 9; iNum++) {
          field.value(nums[iNum]);
          if (this.matches(field) && this.solveBacktracking(i + 1, enableShuffle)) {
            return true;
          }
        }
        field.value(0);
        return false;
      }
    },
    solutionLimit: 10000,
    fieldCountGoal: 40,
    attemptLimit: 1000,
    randomSudoku: function () {
      this.attempts = 0;
      var x, y, value, field;
      var possibleSolutions;
      var solutionLimitChecker = this._createSolutionLimitChecker(2);

      // difficulty metrics
      this.fieldsLeft = 81;

      this.solveBacktracking(0, true);

      this.visit(function (field) {
        field.fixedValue = true;
      });

      while (this.attempts++ < this.attemptLimit && this.fieldsLeft > this.fieldCountGoal) {
        possibleSolutions = undefined;
        solutionLimitChecker.reset();
        x = getRandomInt(0,9);
        y = getRandomInt(0,9);
        field = this.get(x,y);

        if (field.fixedValue) {
          value = field.value();
          field.fixedValue = false;
          field.value(0);
          try {
            possibleSolutions = this.solveBacktrackingCount(0, solutionLimitChecker);
          } catch (e) {
          }

          if (possibleSolutions !== 1) {
            // reset value;
            field.fixedValue = true;
            field.value(value);
          } else {
            this.fieldsLeft -= 1;
          }
          this.clear();
        }
      }
    },
    _createSolutionLimitChecker: function (solutionLimit) {
      return {
        limit: solutionLimit || this.solutionLimit,
        value: 0,
        reset: function () {
          this.value = 0;
        },
        increment: function () {
          this.value++;
          if (this.value > this.limit) {
            throw {
              type: "reachedSolutionLimit",
              limit: this.limit,
              error: "Abbruch nach " + this.limit + " möglichen Lösungen."
            };
          }
        }
      };
    },
    solveBacktrackingCount: function (i, solutionLimitChecker, enableShuffle) {
      var iNum, x, y, field, sum;
      var nums = [1,2,3,4,5,6,7,8,9];
      if (enableShuffle) {
        shuffle(nums);
      }
      solutionLimitChecker = solutionLimitChecker || this._createSolutionLimitChecker();
      i = i || 0;

      if (i === 81) {
        solutionLimitChecker.increment();
        return 1;
      }

      x = i % 9;
      y = Math.floor(i / 9);
      field = this.get(x, y);

      if (field.isFixedValue()) {
        return this.solveBacktrackingCount(i + 1, solutionLimitChecker);
      } else {
        sum = 0;
        for (iNum = 0; iNum < 9; iNum++) {
          field.value(nums[iNum]);
          if (this.matches(field)) {
            sum += this.solveBacktrackingCount(i + 1, solutionLimitChecker);
          }
        }
        field.value(0);
        return sum;
      }
    }
  };

  var sudokuService = {
    _sudokus: [],
    getRandomSudoku: function () {
      return new Sudoku(sudokuStorage.sudokus()[0].rows);
    },
    createSudoku: function (sudokuRows) {
      return new Sudoku(sudokuRows);
    }
  };

  sudokuService.SudokuField = SudokuField;
  sudokuService.Sudoku = Sudoku;
  return sudokuService;
});
