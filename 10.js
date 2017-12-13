const myInput = `187,254,0,81,169,219,1,190,19,102,255,56,46,32,2,216`;
const initialState = [...Array(256).keys()];

function updateState(state, pos, length) {
  const newState = state.slice();
  const flipped = [];
  for (let i = 0; i < length; i++) {
    flipped.push(state[(pos + i) % state.length]);
  }
  flipped.reverse().forEach((item, i, arr) => {
    newState[(pos + i) % state.length] = arr[i];
  });
  return newState;
}

function getResult(list, input) {
  let state = list.slice();
  let pos = 0;
  input.split(',').map((d) => +d).forEach((item, i) => {
    state = updateState(state, pos, item);
    pos = (pos + item + i) % state.length;
  });
  return state[0] * state[1];
}

function getKnotHash(list, input) {
  let state = list.slice();
  let pos = 0;
  let skipSize = 0;
  const lengths = input.split('').map((d) => d.charCodeAt())
      .concat([17, 31, 73, 47, 23]);
  for (let i = 0; i < 64; i++) {
    lengths.forEach((item, i) => {
      state = updateState(state, pos, item);
      pos = (pos + item + skipSize) % state.length;
      skipSize++;
    });
  }
  return state.reduce((hash, item, i) => {
    if (i % (16) === 0 && i !== 0) {
      hash.push([]);
    }
    hash[hash.length - 1].push(item);
    return hash;
  }, [[]]).reduce((hash, block) => {
    return hash + block.reduce((result, num) => result ^ num, 0).toString(16)
  }, '');
}

getResult(initialState, myInput); // Part 1.
getKnotHash(initialState, myInput); // Part 2.