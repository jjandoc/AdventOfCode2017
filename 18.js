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

function getResult(instructions) {
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

// Start part 2.
class Program {
  constructor(state) {
    this.state = state;
    this.pos = 0;
    this.sends = 0;
    this.queue = [];
    this.isWaiting = false;
    this.isFinished = false;
  }
}

function getPart2(instructions) {
  const initialState = instructions.map((command) => command[1])
      .filter((val, i, arr) => arr.indexOf(val) === i) // unique values only
      .reduce((state, key) => {
        if (isNaN(parseInt(key, 10))) {
          state[key] = 0;
        }
        return state;
      }, {});
  const programs = [];
  programs.push(new Program(initialState));
  programs.push(new Program(Object.assign({}, initialState, {p: 1})));
  let pos = [0, 0];
  let active = 0;
  do {
    programs.forEach((program, i) => {
      if (program.queue.length) {
        program.isWaiting = false;
      }
      while (!program.isWaiting && !program.isFinished) {
        const [cmd, key, y] = instructions[program.pos];
        const arg = y ? isNaN(parseInt(y, 10)) ? program.state[y] :
            parseInt(y, 10) : null;
        switch(cmd) {
          case 'snd':
            programs[(i + 1) % 2].queue.push(program.state[key]);
            program.pos++;
            program.sends++;
            break;
          case 'set':
            program.state[key] = arg;
            program.pos++;
            break;
          case 'add':
            program.state[key] += arg;
            program.pos++;
            break;
          case 'mul':
            program.state[key] *= arg;
            program.pos++;
            break;
          case 'mod':
            program.state[key] %= arg;
            program.pos++
            break;
          case 'rcv':
            if (program.queue.length) {
              program.state[key] = program.queue.shift();
              program.pos++
            } else {
              program.isWaiting = true;
            }
            break;
          case 'jgz':
            const jumpCheck = parseInt(key, 10);
            if (isNaN(jumpCheck) && program.state[key] > 0) {
              program.pos += arg;
            } else if (jumpCheck > 0) {
              program.pos += arg;
            } else {
              program.pos++;
            }
            break;
        }
        if (program.pos >= instructions.length || program.pos < 0) {
          program.isFinished = true;
        }
      }
    });
  } while ((!programs[0].isFinished && programs[0].queue.length) ||
      (programs[1].isFinished && programs[1].queue.length));
  return programs[1].sends;
}

function parseInput(input) {
  return input.split('\n').map((line) => line.split(' '));
}

const myInstuctions = parseInput(myInput);
console.log(getResult(myInstuctions));
console.log(getPart2(myInstuctions));