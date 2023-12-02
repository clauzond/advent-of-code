// https://adventofcode.com/2023/day/2

import { fileToArray } from "../utils";

const lines = fileToArray(__filename);

/* Part 1 */

const getMaxNumberFrom = (withoutSpace: string, color: string) => {
  return withoutSpace.split(color).reduce((prev, cur) => {
    const currentRedMatch = cur.match(/\d+$/);
    if (currentRedMatch === null) {
      return prev;
    }

    return Math.max(prev, parseInt(currentRedMatch[0]));
  }, 0);
};

type RGB = { red: number; green: number; blue: number };
const getInfoFromLine = (line: string, maxPossible?: RGB) => {
  const id = parseInt(line.split(" ")[1]);

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
