// https://adventofcode.com/2021/day/6

import { fileToArray } from "../utils";

const lines = fileToArray(__filename);
const examples = fileToArray(__filename, ".example");

/* Part 1 */

function solveWithArray(lines: string[], days: number) {
  const fishArray: number[] = lines[0].split(",").map((n) => parseInt(n));

  for (let i = 0; i < days; i++) {
    let newFish = [];
    for (const [index, fish] of fishArray.entries()) {
      if (fish === 0) {
        newFish.push(8);
        fishArray[index] = 6;
      } else {
        fishArray[index] = fish - 1;
      }
    }
    fishArray.push(...newFish);
  }

  return fishArray.length;
}

function solve(lines: string[], days: number) {
  const fishArray: number[] = lines[0].split(",").map((n) => parseInt(n));

  let fishMap = Array(9).fill(0);
  fishArray.forEach((value) => fishMap[value]++);

  for (let i = 0; i < days; i++) {
    let newFishMap = [...fishMap];
    for (const [dayLeft, numberOfFish] of fishMap.entries()) {
      if (dayLeft === 0) {
        newFishMap[8] += numberOfFish;
        newFishMap[0] -= numberOfFish;
        newFishMap[6] += numberOfFish;
      } else {
        newFishMap[dayLeft] -= numberOfFish;
        newFishMap[dayLeft - 1] += numberOfFish;
      }
    }

    fishMap = newFishMap;
  }

  return fishMap.reduce((prev, cur) => prev + cur, 0);
}

console.log("The number of lanternfish after 80 days is", solveWithArray(lines, 80));

/* Part 2 */

console.log("The number of lanternfish after 256 days is", solve(lines, 256));
