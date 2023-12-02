// https://adventofcode.com/2023/day/2

import { fileToArray } from "./utils.mjs";

const lines = fileToArray("/home/damienc/git/advent_of_code/day_2.mjs");

/* Part 1 */

/**
 * @param {string} withoutSpace
 * @param {string} color
 */
const getMaxNumberFrom = (withoutSpace, color) => {
  return withoutSpace.split(color).reduce((prev, cur) => {
    const currentRedMatch = cur.match(/\d+$/);
    if (currentRedMatch === null) {
      return prev;
    }

    return Math.max(prev, currentRedMatch[0]);
  }, 0);
};

/**
 * @param {string} line
 * @param {undefined | {red: number, green: number, blue: number}} maxPossible
 */
const getInfoFromLine = (line, maxPossible) => {
  const id = parseInt(line.split(" ")[1]);

  /** @type string */
  const withoutSpace = line.replaceAll(" ", "");

  const max = {
    red: getMaxNumberFrom(withoutSpace, "red"),
    green: getMaxNumberFrom(withoutSpace, "green"),
    blue: getMaxNumberFrom(withoutSpace, "blue"),
  };

  if (
    maxPossible !== undefined &&
    (max.red > maxPossible.red || max.green > maxPossible.green || max.blue > maxPossible.blue)
  ) {
    return { id: 0, ...max };
  }

  return {
    id,
    ...max,
  };
};

const idSum = lines.reduce((prev, cur) => {
  const curId = getInfoFromLine(cur, { red: 12, green: 13, blue: 14 }).id;
  return prev + curId;
}, 0);

console.log("The sum of all valid game IDs is", idSum);

/* Part 2 */

const power = lines.reduce((prev, cur) => {
  const info = getInfoFromLine(cur);

  return prev + info.red * info.green * info.blue;
}, 0);

console.log("The sum of the power of all games is", power);
