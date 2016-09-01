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
      var matches = aux.computeArrayExtraneous(
        ['one', 'two', 'three', 'four'],
        ['three', 'one', 'five', 'eight', 'ten']
      );

      matches.length.should.eql(2);

      matches.every((item) => {
        return ['two', 'four'].indexOf(item) !== -1;
      })
      .should.eql(true);

    });

  });
  describe('aux#computeArrayMissing(arr, targetArr, compareFn)', function () {

    it('should return an array with elements that are in the targetArr but missing from the source array', function () {
      
      var matches = aux.computeArrayMissing(
        ['one', 'two', 'three', 'four'],
        ['three', 'one', 'five', 'eight', 'ten']
      );

      matches.length.should.eql(3);

      matches.every((item) => {
        return ['five', 'eight', 'ten'].indexOf(item) !== -1;
      })
      .should.eql(true);

    });

  });

});
