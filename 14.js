// Slightly refactored knot hash function from Day 10.
function getKnotHash(input) {
  const updateState = (state, pos, length) => {
    const newState = state.slice();
    const flipped = [];
    for (let i = 0; i < length; i++) {
      flipped.push(state[(pos + i) % state.length]);
    }
    flipped.reverse().forEach((item, i, arr) => {
      newState[(pos + i) % state.length] = arr[i];
    });
    return newState;
  };

  let state = [...Array(256).keys()];
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
    let hexChar = block.reduce((result, num) => result ^ num, 0).toString(16);
    while (hexChar.length < 2) {
      hexChar = '0' + hexChar
    }
    return hash + hexChar;
  }, '');
}

// New shiz.
function getDisk(input) {
  const disk = [];
  for (let i = 0; i < 128; i++) {
    const knotHash = getKnotHash(`${input}-${i}`);
    const row = knotHash.split('').map((n) => {
      let binaryBits = parseInt(n, 16).toString(2);
      while (binaryBits.length < 4) {
        binaryBits = '0' + binaryBits;
      }
      return binaryBits;
    }).join('').split('').map((d) => +d);
    disk.push(row);
  }
  return disk;
}

const myDisk = getDisk('nbysizxe');
console.log([].concat(...myDisk).reduce((total, bit) => bit + total, 0)); // Part 1.