// https://adventofcode.com/2023/day/6

import { fileToArray } from "../utils";

const lines = fileToArray(__filename);
const examples = fileToArray(__filename, ".example");

/* Part 1 */
function solve(lines: string[]) {
  const lastingTimes = lines[0]
    .split(":")[1]
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((n) => parseInt(n));

  const distanceRecords = lines[1]
    .split(":")[1]
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((n) => parseInt(n));

  let multipliedWays = 1;

  for (let i = 0; i < distanceRecords.length; i++) {
    const lastingTime = lastingTimes[i];
    const recordToBeat = distanceRecords[i];
    let waysBeatingRecord = 0;

    for (let speed = 1; speed < lastingTime; speed++) {
      const remainingTime = lastingTime - speed;

      const distance = speed * remainingTime;

      if (distance > recordToBeat) {
        waysBeatingRecord++;
      }
    }

    multipliedWays *= waysBeatingRecord;
  }

  return multipliedWays;
}

console.log("Part 1:", solve(lines));

/* Part 2 */
function solvePartTwo(lines: string[]) {
  const lastingTime = parseInt(lines[0].split(":")[1].trim().replace(/\s+/g, " ").split(" ").join(""));
  console.log("lasttime", lastingTime);

  const recordToBeat = parseInt(lines[1].split(":")[1].trim().replace(/\s+/g, " ").split(" ").join(""));
  console.log("record", recordToBeat);

  let waysBeatingRecord = 0;

  for (let speed = 1; speed < lastingTime; speed++) {
    const remainingTime = lastingTime - speed;

    const distance = speed * remainingTime;

    if (distance > recordToBeat) {
      waysBeatingRecord++;
    }
  }

  return waysBeatingRecord;
}

console.log("Part 2:", solvePartTwo(lines));

// 58,819,676
// 434,104,122,191,218
