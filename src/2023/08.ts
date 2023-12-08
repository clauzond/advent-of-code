// https://adventofcode.com/2023/day/8

import { fileToArray } from "../utils";

const lines = fileToArray(__filename);
const examples = fileToArray(__filename, ".example");

/* Part 1 */
function solve(lines: string[]) {
  const dir = lines[0];
  dir;

  const record: Record<string, { left: string; right: string }> = lines.splice(2).reduce((acc, line) => {
    const [op, rest] = line.replaceAll(" ", "").split("=");
    const [left, right] = rest.replace("(", "").replace(")", "").split(",");

    return { ...acc, [op]: { left, right } };
  }, {});

  let i = 0;
  let cur = "AAA";
  while (cur !== "ZZZ") {
    const direction = dir[i % dir.length];
    cur = direction === "L" ? record[cur].left : record[cur].right;
    i++;
  }

  return i;
}
// 8:10
// console.log(solve(lines));

/* Part 2 */

function solve2(lines: string[]) {
  const dir = lines[0];
  dir;

  const record: Record<string, { left: string; right: string }> = lines.splice(2).reduce((acc, line) => {
    const [op, rest] = line.replaceAll(" ", "").split("=");
    const [left, right] = rest.replace("(", "").replace(")", "").split(",");

    return { ...acc, [op]: { left, right } };
  }, {});

  let i = 0;
  let cur = Object.keys(record).filter((k) => k.endsWith("A"));
  while (!cur.every((k) => k.endsWith("Z"))) {
    cur = cur.map((k) => (dir[i % dir.length] === "L" ? record[k].left : record[k].right));
    i++;
  }

  return i;
}

function solve2bis(lines: string[]) {
  const dir = lines[0];
  dir;

  const record: Record<string, { left: string; right: string }> = lines.splice(2).reduce((acc, line) => {
    const [op, rest] = line.replaceAll(" ", "").split("=");
    const [left, right] = rest.replace("(", "").replace(")", "").split(",");

    return { ...acc, [op]: { left, right } };
  }, {});

  let i = 0;
  let cur = Object.keys(record).filter((k) => k.endsWith("A"));
  const done = new Array(cur.length).fill(-1);
  while (!done.every((k) => k !== -1)) {
    cur = cur.map((k, index) => {
      if (done[index] !== -1) {
        return k;
      }

      const direction = dir[i % dir.length] === "L" ? record[k].left : record[k].right;
      if (direction.endsWith("Z")) {
        done[index] = i + 1;
      }
      return direction;
    });

    i++;
  }

  return [cur, done];
}

// answer is > 2,563,000,000
// i ran until 3,345,000,000
// answer is PPCM(lines[1]) : 13,385,272,668,829
console.log(solve2bis(lines));
