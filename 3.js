/**************************
 * Part 1                 *
 **************************/

function getLengthOfOrbit(orbitIndex) {
  return (4 * getLengthOfSide(orbitIndex)) - 4;
}

function getLengthOfSide(orbitIndex) {
  return 2 * (orbitIndex) + 1;
}

function getFirstNumberOfOrbit(orbitIndex) {
  return Math.pow(getLengthOfSide(orbitIndex - 1), 2) + 1;
}

function getOrbitIndex(number) {
  let orbitIndex = 0;
  while (getFirstNumberOfOrbit(orbitIndex) <= number) {
    ++orbitIndex;
  }
  return orbitIndex - 1;
}

/**
 * Split an array into equally sized sub-arrays.
 * @param {Array} array - The source array.
 * @param {number} numberOfChunks - The number of sub-arrays to create.
 * @return {Array.<Array>} The result sub-array matrix.
 */
function splitArray(array, numberOfChunks) {
  return !array.length ? [] : array.reduce((matrix, value, i) => {
    if (i % (array.length / numberOfChunks) === 0 && i !== 0) {
      matrix.push([]);
    }
    matrix[matrix.length - 1].push(value);
    return matrix;
  }, [[]]);
}

/**
 * Woof. Okay, so what we're doing here is, for a given number figuring out
 * what orbit we're in, splitting that orbit's numbers into four sides,
 * figuring out where on the side that number is, and returning the distance
 * that number is from the center.
 * @param {number} number - Our input number.
 * @return {number} The distance of the number from the center of its side.
 */
function getDistanceFromCenterOfSide(number) {
  const orbitIndex = getOrbitIndex(number);
  const firstNumberOfOrbit = getFirstNumberOfOrbit(orbitIndex);
  const lengthOfOrbit = getLengthOfOrbit(orbitIndex);

  // This is going to be an array of array.
  const matrixOfNumbers = splitArray([...Array(lengthOfOrbit).keys()]
      .map((n) => n + firstNumberOfOrbit), 4);

  const indexOfNumberOnSide = matrixOfNumbers.length ? 
      matrixOfNumbers.filter(row => row.includes(number))[0].indexOf(number) :
      - 1;
  
  const indexOfCenter = orbitIndex - 1;

  return Math.abs(indexOfNumberOnSide - indexOfCenter);
}

function getRouteLength(number) {
  return getOrbitIndex(number) + getDistanceFromCenterOfSide(number);
}

console.log(getRouteLength(312051));

/**************************
 * Part 2                 *
 **************************/

function updateMatrix(sourceMatrix) {
  const isSourceMatrixFull = !([].concat(...sourceMatrix).includes(0));
  const matrix = isSourceMatrixFull ?
      addNewOrbit(sourceMatrix) : sourceMatrix.slice();
  function getMatrixValue(row, col) {
    return matrix[row][col];
  }
    
  // By default, let's update the start of a new spiral.
  let rowIndexToUpdate = matrix.length - 2; // Second-to-last row.
  let colIndexToUpdate = matrix.length - 1; // Last column.

  // Let's start looping around the spiral until we get a zero.
  while (getMatrixValue(rowIndexToUpdate, colIndexToUpdate) !== 0 &&
      !isSourceMatrixFull) {
    if (colIndexToUpdate === matrix.length - 1) {
      if (rowIndexToUpdate - 1 >= 0) {
        rowIndexToUpdate = rowIndexToUpdate - 1;
      } else {
        colIndexToUpdate = colIndexToUpdate - 1;
      }
    } else if (colIndexToUpdate > 0 && rowIndexToUpdate === 0) {
      colIndexToUpdate = colIndexToUpdate - 1;
    } else {
      if (rowIndexToUpdate + 1 < matrix.length) {
        rowIndexToUpdate = rowIndexToUpdate + 1;
      } else {
        colIndexToUpdate = colIndexToUpdate + 1;
      }
    }
  }
  
  // Okay, we should have our target spot in the matrix now. Let's add all the
  // numbers around it to get its total.
  const offsets = [-1, 0, 1];
  let total = 0;
  offsets.forEach((offsetX) => {
    offsets.forEach((offsetY) => {
      const item = matrix[rowIndexToUpdate + offsetY] ?
        matrix[rowIndexToUpdate + offsetY][colIndexToUpdate + offsetX] : 0;
      total = item ? total + item : total;
    });
  });
  matrix[rowIndexToUpdate][colIndexToUpdate] = total;
  return matrix;
}

function addNewOrbit(matrix) {
  const newMatrix = matrix.slice();
  // Add a new "null" square to the beginning and end of each existing row.
  newMatrix.forEach(row => {
    row.unshift(0);
    row.push(0);
  });
  // Add a new row to the beginning and end of the matrix.
  newMatrix.unshift(Array(matrix.length + 2).fill(0));
  newMatrix.push(Array(matrix.length + 2).fill(0));
  return newMatrix;
}

function getHighestValueInMatrix(matrix) {
  return Math.max(...[].concat(...matrix).filter((value) => !isNaN(value)));
}

function getResult(input) {
  let matrix = [[1]];
  let result = 1;
  while (result <= input) {
    matrix = updateMatrix(matrix);
    result = getHighestValueInMatrix(matrix);
  }
  return result;
}

console.log(getResult(312051));