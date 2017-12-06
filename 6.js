const myInput = `2	8	8	5	4	2	3	1	5	5	1	2	15	13	5	14`;

function getIndexOfMax(numberArray) {
  return numberArray.reduce((indexOfMax, number, i, arr) => {
    return number > arr[indexOfMax] ? i : indexOfMax;
  }, 0);      
}

function getRedistributedArray(numberArray) {
  const newArray = numberArray.slice();
  let i = getIndexOfMax(numberArray);
  let amountToRedistribute = numberArray[i];
  newArray[i] = 0;
  
  while (amountToRedistribute--) {
    newArray[++i % newArray.length]++;
  }

  return newArray;
}

function isEqual(array1, array2) {
  if (array1.length !== array2.length) {
    return false;
  }
  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) {
      return false;
    }
  }
  return true;
}

function getResult(input) {
  const cycles = [input.split('\t').map(v => +v)];
  let foundMatch = false;

  while (!foundMatch) {
    const cycle = getRedistributedArray(cycles[cycles.length - 1]);
    foundMatch = cycles.filter((item) => isEqual(cycle, item)).length > 0;
    cycles.push(cycle);
  }

  return cycles.length - 1;
}

function getSizeOfLoop(input) {
  const cycles = [input.split('\t').map(v => +v)];
  let matchingIndex = -1;

  while (matchingIndex < 0) {  
    const cycle = getRedistributedArray(cycles[cycles.length - 1]);
    for (let i = 0; i < cycles.length; i++) {
      if (isEqual(cycle, cycles[i])) {
        matchingIndex = i;
        break;
      }
    }
    cycles.push(cycle);
  }

  return cycles.length - matchingIndex - 1;
}

console.log(getResult(myInput)); // Part 1
console.log(getSizeOfLoop(myInput)); // Part 2