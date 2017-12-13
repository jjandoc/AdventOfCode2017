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

getResult(initialState, myInput);