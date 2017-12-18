function getResult(input, cycles) {
  const state = [0];
  for (let i = 0; i < cycles; i++) {
    state.splice(((state.indexOf(i) + input) % state.length) + 1, 0, i + 1);
  }
  return state[state.indexOf(cycles) + 1];
}

// Since we only care about the number after 0, and 0 never moves we don't need
// to keep track of the state. Should make things run a bit faster.
function getPart2Result(input, cycles) {
  let result = null;
  let pos = 0;
  for (let i = 0; i < cycles; i++) {
    pos = (pos + input + 1) % (i + 1);
    if (pos === 0) {
      result = i + 1;
    }
  }
  return result;
}
console.log(getResult(355, 2017)); // Part 1
console.log(getPart2Result(355, 5E7)); // Part 2