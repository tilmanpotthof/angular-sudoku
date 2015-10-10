/* eslint complexity: [1, 5] */
angular.module('sudokuApp')
  .factory('sudokuView', function (sudokuService) {
    'use strict';
    var keys = {
      ARROW_DOWN: 40,
      ARROW_UP: 38,
      ARROW_LEFT: 37,
      ARROW_RIGHT: 39
    };

    var sudokuView = {
      sudoku: function (sudoku) {
        if (sudoku instanceof sudokuService.Sudoku) {
          this._sudoku = sudoku;
        }
        return this._sudoku;
      },
      handleClick: function (field) {
        if (field instanceof sudokuService.SudokuField) {
          this.selectedField = (this.selectedField !== field) ? field : undefined;
        }
      },
      handleKeypress: function ($event) {
        if (this.selectedField) {
          if (37 <= $event.keyCode && $event.keyCode <= 40) {
            var xDiff = 0;
            var yDiff = 0;
            if ($event.keyCode === keys.ARROW_DOWN) {
              yDiff = 1;
            } else if ($event.keyCode === keys.ARROW_UP) {
              yDiff = -1;
            } else if ($event.keyCode === keys.ARROW_LEFT) {
              xDiff = -1;
            } else if ($event.keyCode === keys.ARROW_RIGHT) {
              xDiff = 1;
            }
            var x = (this.selectedField.x + xDiff + 9) % 9;
            var y = (this.selectedField.y + yDiff + 9) % 9;
            this.selectedField = this.sudoku().get(x, y);
          } else if (!this.selectedField.fixedValue || this.editFixedValues) {
            var value = String.fromCharCode($event.keyCode);
            value = isNaN(value) ? value : parseInt(value, 10);
            this.selectedField.value(value);
            if (this.editFixedValues) {
              this.selectedField.fixedValue = value > 0;
            }
          }
        }

      },
      fieldClasses: function (field) {
        return {
          'fixed-field': field.isFixedValue(),
          'selected': field === this.selectedField,
          'wrong': !this.sudoku().matches(field) && (!field.isFixedValue() || this.editFixedValues)
        };
      }
    };
    return sudokuView;
  });

