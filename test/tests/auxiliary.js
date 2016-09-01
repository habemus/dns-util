const should = require('should');

const aux = require('../../lib/auxiliary');

describe('auxiliary', function () {

  describe('aux#computeArrayMatches(arr, targetArr, compareFn)', function () {

    it('should return an array with elements in both arrays', function () {

      var matches = aux.computeArrayMatches(
        ['one', 'two', 'three', 'four'],
        ['three', 'one', 'five']
      );

      matches.length.should.eql(2);

      matches.every((item) => {
        return ['one', 'three'].indexOf(item) !== -1;
      })
      .should.eql(true);

    });

  });
  describe('aux#computeArrayExtraneous(arr, targetArr, compareFn)', function () {

    it('should return an array with elements only in the source array', function () {
      var extraneous = aux.computeArrayExtraneous(
        ['one', 'two', 'three', 'four'],
        ['three', 'one', 'five', 'eight', 'ten']
      );

      extraneous.length.should.eql(2);

      extraneous.every((item) => {
        return ['two', 'four'].indexOf(item) !== -1;
      })
      .should.eql(true);

    });

  });
  describe('aux#computeArrayMissing(arr, targetArr, compareFn)', function () {

    it('should return an array with elements that are in the targetArr but missing from the source array', function () {
      
      var missing = aux.computeArrayMissing(
        ['one', 'two', 'three', 'four'],
        ['three', 'one', 'five', 'eight', 'ten']
      );

      missing.length.should.eql(3);

      missing.every((item) => {
        return ['five', 'eight', 'ten'].indexOf(item) !== -1;
      })
      .should.eql(true);

    });

  });

  describe('aux#computeArrayDiff(arr, targetArr, compareFn)', function () {

    it('should return an object that describes the differences between the source and the target arrays', function () {
      
      var diff = aux.computeArrayDiff(
        ['one', 'two', 'three', 'four'],
        ['three', 'one', 'five', 'eight', 'ten']
      );

      diff.matches.length.should.eql(2);
      diff.matches.every((item) => {
        return ['one', 'three'].indexOf(item) !== -1;
      })
      .should.eql(true);

      diff.extraneous.length.should.eql(2);
      diff.extraneous.every((item) => {
        return ['two', 'four'].indexOf(item) !== -1;
      })
      .should.eql(true);


      diff.missing.length.should.eql(3);
      diff.missing.every((item) => {
        return ['five', 'eight', 'ten'].indexOf(item) !== -1;
      })
      .should.eql(true);

      diff.isExactlyEqual.should.eql(false);
      diff.targetWithinArray.should.eql(false);
      diff.arrayWithinTarget.should.eql(false);
    });

    it('should return diff.targetWithinArray true when the target is within the array', function () {
      
      var diff = aux.computeArrayDiff(
        ['one', 'two', 'three', 'four'],
        ['three', 'one']
      );

      diff.isExactlyEqual.should.eql(false);
      diff.targetWithinArray.should.eql(true);
      diff.arrayWithinTarget.should.eql(false);
    });

    it('should return diff.arrayWithinTarget true when the array is within the target', function () {
      
      var diff = aux.computeArrayDiff(
        ['three', 'one'],
        ['one', 'two', 'three', 'four']
      );

      diff.isExactlyEqual.should.eql(false);
      diff.targetWithinArray.should.eql(false);
      diff.arrayWithinTarget.should.eql(true);
    });

    it('should return diff.isExactlyEqual true when target and source arrays are exactly the same', function () {
      
      var diff = aux.computeArrayDiff(
        ['three', 'one'],
        ['one', 'three']
      );

      diff.isExactlyEqual.should.eql(true);
      diff.targetWithinArray.should.eql(true);
      diff.arrayWithinTarget.should.eql(true);
    });

    it('should accept a compareFn', function () {
      var diff = aux.computeArrayDiff(
        ['one', 'two', 'three'],
        [1, 2, 3, 4],
        function compare(source, target) {
          return ({
            one: 1,
            two: 2,
            three: 3,
            four: 4
          })[source] === target;
        }
      );

      diff.isExactlyEqual.should.eql(false);
      diff.targetWithinArray.should.eql(false);
      diff.arrayWithinTarget.should.eql(true);

      diff.missing.should.eql([4]);
      diff.matches.should.eql(['one', 'two', 'three']);
      diff.extraneous.should.eql([]);
    });
  });

  


});
