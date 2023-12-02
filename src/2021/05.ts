// https://adventofcode.com/2021/day/5

import { fileToArray } from "../utils";

const lines = fileToArray(__filename);
const examples = fileToArray(__filename, ".example");

type CoordType = [number, number];

/* Part 1 */

function getCoordinatesBetween(start: string, end: string, diagonal: boolean) {
  const coords: CoordType[] = [];

  const [_x0, _y0] = start.split(",").map((n) => parseInt(n));
  const [_x1, _y1] = end.split(",").map((n) => parseInt(n));

  const [x0, x1] = [Math.min(_x0, _x1), Math.max(_x0, _x1)];
  const [y0, y1] = [Math.min(_y0, _y1), Math.max(_y0, _y1)];

  const distance = x0 === x1 ? y1 - y0 : y0 === y1 ? x1 - x0 : diagonal ? x1 - x0 : 0;

  for (let i = 0; i <= distance; i++) {
    if (x0 === x1) {
      coords.push([x0, y0 + i]);
    } else if (y0 === y1) {
      coords.push([x0 + i, y0]);
    } else if (diagonal) {
      const xSign = _x0 < _x1 ? 1 : -1;
      const ySign = _y0 < _y1 ? +1 : -1;

      coords.push([_x0 + xSign * i, _y0 + ySign * i]);
    }
  }

  return { coords, maxX: x1, maxY: y1 };
}

function printMatrixString(map: Map<string, number>, maxX: number, maxY: number) {
  const matrix: string[][] = Array(maxY + 1)
    .fill(".")
    .map(() => Array(maxX + 1).fill("."));

  for (const [coord, overlap] of map.entries()) {
    const [x, y] = coord.split(",");
    // @ts-expect-error ok
    matrix[y][x] = overlap.toString();
  }

  const matrixString = matrix.reduce((prev, cur) => {
    return prev + "\n" + cur.join("");
  }, "");

  console.log(matrixString);
}

function solve(lines: string[], diagonal: boolean) {
  const map = new Map<string, number>();
  let numberOfOverlap = 0;
  let [maxX, maxY] = [0, 0];

  for (const line of lines) {
    const [start, end] = line.replaceAll(" ", "").split("->");

    const { coords, maxX: _maxX, maxY: _maxY } = getCoordinatesBetween(start, end, diagonal);
    console.log(start, end, coords);

    maxX = Math.max(maxX, _maxX);
    maxY = Math.max(maxY, _maxY);

    for (const coord of coords) {
      const key = `${coord[0]},${coord[1]}`;
      const currentCount = map.get(key);

      if (currentCount === undefined) {
        map.set(key, 1);
      } else {
        if (currentCount === 1) {
          numberOfOverlap++;
        }
        map.set(key, currentCount + 1);
      }
    }
  }

  // printMatrixString(map, maxX, maxY);

  return numberOfOverlap;
}

console.log("The number of overlap is", solve(lines, false));

/* Part 2 */

console.log("The number of diagonal overlap is", solve(lines, true));
