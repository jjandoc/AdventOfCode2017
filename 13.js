const myInput = `0: 3
1: 2
2: 4
4: 6
6: 5
8: 6
10: 6
12: 4
14: 8
16: 8
18: 9
20: 8
22: 6
24: 14
26: 12
28: 10
30: 12
32: 8
34: 10
36: 8
38: 8
40: 12
42: 12
44: 12
46: 12
48: 14
52: 14
54: 12
56: 12
58: 12
60: 12
62: 14
64: 14
66: 14
68: 14
70: 14
72: 14
80: 18
82: 14
84: 20
86: 14
90: 17
96: 20
98: 24`;

function getCourse(input) {
  return input.split('\n').reduce((course, firewall) => {
    const [depth, range] = firewall.split(': ').map((d) => +d);
    course[depth] = range;
    return course;
  }, []);
}

function getScannerPos(range, time) {
  const maxIndex = range - 1;
  return maxIndex - Math.abs((Math.abs(time) % (maxIndex * 2)) - maxIndex);
}

function getMissteps(course, timeDelay = 0) {
  return course.reduce((missteps, firewallRange, i) => {
    if (firewallRange && getScannerPos(firewallRange, i + timeDelay) === 0) {
      missteps.push([i, firewallRange])
    }
    return missteps;
  }, []);
}

function getTiming(course) {
  let delay = 0;
  while (getMissteps(course, delay).length > 0) {
    delay++
  }
  return delay;
}

const myCourse = getCourse(myInput);
console.log(getMissteps(myCourse).reduce((severity, misstep) =>
    severity + (misstep[0] * misstep[1]), 0)); // Part 1.
console.log(getTiming(myCourse)); // Part 2.