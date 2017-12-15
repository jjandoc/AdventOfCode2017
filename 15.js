// Generator A starts with 516
// Generator B starts with 190

class Generator {
  constructor(multiplyingFactor, initialValue, pickiness = 1) {
    this.factor = multiplyingFactor;
    this.value = initialValue;
    this.pickiness = pickiness
  }

  generate() {
    this.value = (this.value * this.factor) % 2147483647;
    return this.value;
  }
}

/**
 * Takes an array of values, converts them to binary, then gets the lowest 16
 * bits of that binary string. Returns true if the 16-bit strings are
 * all equal.
 * @param {Array.<number>} values - Array of values to compare.
 * @return {boolean}
 */
function judgeValues(values) {
  const binaryVals = values.map((num) => {
    let binaryVal = num.toString(2);
    if (binaryVal.length > 16) {
      binaryVal = binaryVal.split('').slice(-16).join('');
    } else {
      while (binaryVal.length < 16) {
        binaryVal = '0' + binaryVal;
      }
    }
    return binaryVal;
  });
  return binaryVals.length ?
      !!binaryVals.reduce((a, b) => a === b ? a : NaN) : false;
}

/**
 * Old version. Takes an array of generators, and goes through `n` cycles of 
 * number generation, judging those generated numbers each round. Returns the 
 * final score.
 * @param {Array.<Generator>} generators - Generators to compare.
 * @param {number} cycles - Number of comparison cycles.
 * @return {number} - The judge's final score.
 */
// function compareGenerators(generators, cycles) {
//   let judgeScore = 0;
//   for (let i = 0; i < cycles; i++) {
//     const values = generators.map((generator) => generator.generate());
//     if (judgeValues(values)) {
//       judgeScore++;
//     }
//   }
//   return judgeScore;
// }

/**
 * Refactored version. Probably runs slower, honestly. Like before, this returns
 * a judge's final score. However this takes into account a generator's 
 * "pickiness" - that is whether it only will submit a value for judgement if 
 * it is a multiple of the pickiness value. So for each generator, we create a
 * value queue. We fill each queue with valid values until we have enough in
 * each to perform the desired number of judgement cycles
 * @param {Array.<Generator>} generators - Generators to compare.
 * @param {number} cycles - Number of comparison cycles.
 * @return {number} - The judge's final score.
 */
function compareGenerators(generators, cycles) {
  let judgeScore = 0;
  const queues = generators.map((generator) => {
    const queue = [];
    while (queue.length < cycles) {
      const value = generator.generate();
      if (value % generator.pickiness === 0) {
        queue.push(value)
      }
    }
    return queue;
  });
  for (let i = 0; i < cycles; i++) {
    const values = queues.map((queue) => queue[i]);
    if (judgeValues(values)) {
      judgeScore++;
    }
  }
  return judgeScore;
}

// Part 1.
const genA1 = new Generator(16807, 516);
const genB1 = new Generator(48271, 190);
console.log(compareGenerators([genA1, genB1], 40000000));

// Part 2.
const genA2 = new Generator(16807, 516, 4);
const genB2 = new Generator(48271, 190, 8);
console.log(compareGenerators([genA2, genB2], 5000000));