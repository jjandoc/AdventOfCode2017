const sampleInput = `set a 1
add a 2
mul a a
mod a 5
snd a
set a 0
rcv a
jgz a -1
set a 1
jgz a -2`;

const myInput = `set i 31
set a 1
mul p 17
jgz p p
mul a 2
add i -1
jgz i -2
add a -1
set i 127
set p 680
mul p 8505
mod p a
mul p 129749
add p 12345
mod p a
set b p
mod b 10000
snd b
add i -1
jgz i -9
jgz a 3
rcv b
jgz b -1
set f 0
set i 126
rcv a
rcv b
set p a
mul p -1
add p b
jgz p 4
snd a
set a b
jgz 1 3
snd b
set f 1
add i -1
jgz i -11
snd a
jgz f -16
jgz a -19`;

function getResult(input) {
  const instructions = input.split('\n').map((line) => line.split(' '));
  let lastFrequency = 0;
  let isSoundRecovered = false;
  let pos = 0;
  const state = instructions.map((command) => command[1])
      .filter((val, i, arr) => arr.indexOf(val) === i) // unique values only
      .reduce((state, key) => {
        state[key] = 0;
        return state;
      }, {});
  while (pos >= 0 && pos < instructions.length && !isSoundRecovered) {
    const [cmd, key, y] = instructions[pos];
    const arg = y ? isNaN(parseInt(y, 10)) ? state[y] : parseInt(y, 10) : null;
    pos++
    switch(cmd) {
      case 'snd':
        lastFrequency = state[key];
        break;
      case 'set':
        state[key] = arg;
        break;
      case 'add':
        state[key] += arg;
        break;
      case 'mul':
        state[key] *= arg
        break;
      case 'mod':
        state[key] %= arg
        break;
      case 'rcv':
        if (state[key]) {
          isSoundRecovered = true;
        }
        break;
      case 'jgz':
        if (state[key]) {
          pos += arg - 1;
        }
        break;
    }
  }
  return lastFrequency;
}

console.log(getResult(sampleInput));
console.log(getResult(myInput));