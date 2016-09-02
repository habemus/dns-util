

function arrayHas(arr, item) {
  return arr.indexOf(item) !== -1;
}

/**
 * Retrieve items that are NOT in the source array but are
 * in the target array.
 * 
 * @param  {Array} arr
 * @param  {Array} targetArr
 * @param  {Function} [compareFn]
 * @return {Array}
 */
function computeArrayMissing(arr, targetArr, compareFn) {
  if (compareFn) {
    return targetArr.filter((targetItem) => {
      return !arr.some((item) => {
        // always invoke compareFn in the order:
        // `(item, targetItem)`
        return compareFn(item, targetItem);
      });
    });
  } else {
    return targetArr.filter((item) => {
      return !arrayHas(arr, item);
    });
  }
}

/**
 * Retrieve items that are NOT in the target array but are
 * in the source array.
 * 
 * @param  {Array} arr
 * @param  {Array} targetArr
 * @param  {Function} [compareFn]
 * @return {Array}
 */
function computeArrayExtraneous(arr, targetArr, compareFn) {
  if (compareFn) {
    return arr.filter((item) => {
      return !targetArr.some((targetItem) => {
        // always invoke compareFn in the order:
        // `(item, targetItem)`
        return compareFn(item, targetItem);
      });
    });
  } else {
    return arr.filter((item) => {
      return !arrayHas(targetArr, item);
    });
  }
}

/**
 * Retrieve items that are in both arrays
 * 
 * @param  {Array} arr
 * @param  {Array} targetArr
 * @param  {Function} [compareFn]
 * @return {Array}
 */
function computeArrayMatches(arr, targetArr, compareFn) {
  if (compareFn) {
    return arr.filter((item) => {
      return targetArr.some((targetItem) => {
        // always invoke compareFn in the order:
        // `(item, targetItem)`
        return compareFn(item, targetItem);
      });
    });
  } else {
    return arr.filter(arrayHas.bind(null, targetArr));
  }
}

/**
 * Computes the differences between the arrays.
 * 
 * @param  {Array} arr
 * @param  {Array} targetArr
 * @param  {Function} [compareFn]
 * @return {Object {missing: Array, matches: Array, extraneous: Array}}
 */
function computeArrayDiff(arr, targetArr, compareFn) {

  var diff = {
    missing: computeArrayMissing(arr, targetArr, compareFn),
    matches: computeArrayMatches(arr, targetArr, compareFn),
    extraneous: computeArrayExtraneous(arr, targetArr, compareFn),
  };

  // diff.isExactlyEqual =
  //   (diff.missing.length === 0 && diff.extraneous.length === 0);

  // diff.targetWithinArray = diff.missing.length === 0;
  // diff.arrayWithinTarget = diff.extraneous.length === 0;

  return diff;
}

exports.computeArrayMatches = computeArrayMatches;
exports.computeArrayExtraneous = computeArrayExtraneous;
exports.computeArrayMissing = computeArrayMissing;
exports.computeArrayDiff = computeArrayDiff;
