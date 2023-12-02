// https://adventofcode.com/2021/day/7

import { fileToArray } from "../utils";

const lines = fileToArray(__filename);
const examples = fileToArray(__filename, ".example");

/* Part 1 */

function solve(lines: string[], constant: boolean) {
  const positions = lines[0].split(",").map((n) => parseInt(n));

  let minFuel = undefined;
  for (let consideredIndex = 0; consideredIndex < positions.length; consideredIndex++) {
    // this solution works because the best position always exists among the existing positions
    // would need to check the whole range otherwise (counter-example: solve(examples, true))
    const fuel = positions.reduce((prev, cur, index) => {
      if (consideredIndex === index) return prev;

      const positionsToMove = Math.abs(cur - positions[consideredIndex]);

      if (constant) {
        return prev + positionsToMove;
      }

      return prev + (positionsToMove * (positionsToMove + 1)) / 2;
    }, 0);

    if (minFuel === undefined) {
      minFuel = fuel;
    } else {
      minFuel = Math.min(minFuel, fuel);
    }
  }
  return minFuel;
}

console.log("To align to the position using the least fuel, they must use", solve(lines, true));

/* Part 2 */

console.log("To align to the position using the least fuel, they must use", solve(lines, false));
