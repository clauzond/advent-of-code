// https://adventofcode.com/2023/day/3

import { fileToArray } from "../utils";

const lines = fileToArray(__filename);
const examples = fileToArray(__filename, ".example");

/* Part 1 */

function isNumber(char: string) {
  return /^\d$/.test(char);
}

function isPartSymbol(char: string | undefined) {
  if (char === undefined) return false;

  return !/\d|\./.test(char);
}

function isNearPartSymbol(lines: string[], lineIndex: number, beginColumnIndex: number, numberLength: number) {
  for (let lineDelta = -1; lineDelta <= 1; lineDelta++) {
    if (lineDelta === 0) {
      if (
        isPartSymbol(lines[lineIndex][beginColumnIndex - 1]) ||
        isPartSymbol(lines[lineIndex][beginColumnIndex + numberLength])
      ) {
        return true;
      }
    } else {
      const lineIndexCheck = lineIndex + lineDelta;

      for (let columnDelta = -1; columnDelta <= numberLength; columnDelta++) {
        const columnIndexCheck = beginColumnIndex + columnDelta;
        if (isPartSymbol(lines?.[lineIndexCheck]?.[columnIndexCheck])) {
          return true;
        }
      }
    }
  }

  return false;
}

function solve(lines: string[]) {
  const registeredNumbers: number[] = [];
  // go through each line
  // detect a number on a line, write its begin index. when number is full, check its surroundings - if a part is found, register the number, else continue

  for (const [lineIndex, line] of lines.entries()) {
    let numberBuilt = "";
    let numberBeginIndex = undefined;

    for (const [columnIndex, char] of line.split("").entries()) {
      // Check current char
      if (!isNumber(char)) {
        continue;
      }

      // If its a number, we will record its string & beginIndex
      if (numberBeginIndex === undefined) {
        numberBeginIndex = columnIndex;
      }

      numberBuilt += char;

      // If the number is full, check its surroundings for a part symbol
      const nextChar = lines[lineIndex][columnIndex + 1];
      if (nextChar === undefined || !isNumber(nextChar)) {
        if (
          numberBeginIndex !== undefined &&
          isNearPartSymbol(lines, lineIndex, numberBeginIndex, numberBuilt.length)
        ) {
          registeredNumbers.push(parseInt(numberBuilt));
        }

        // Reset to build next number
        numberBuilt = "";
        numberBeginIndex = undefined;
      }
    }
  }

  return registeredNumbers.reduce((prev, cur) => prev + cur, 0);
}

console.log("The sum of all of the part numbers in the engine schematic is", solve(lines));

/* Part 2 */

function buildNumbersMap(lines: string[]) {
  const numbersMap: (number | undefined)[][] = Array(lines.length)
    .fill(undefined)
    .map((line) => Array(lines[0].length).fill(undefined));

  // go through each line
  // detect a number on a line
  for (const [lineIndex, line] of lines.entries()) {
    let numberBuilt = "";
    let numberBeginIndex = undefined;

    for (const [columnIndex, char] of line.split("").entries()) {
      // Check current char
      if (!isNumber(char)) {
        continue;
      }

      // if its a number, we will record its string & beginIndex
      if (numberBeginIndex === undefined) {
        numberBeginIndex = columnIndex;
      }

      numberBuilt += char;

      // if the number is full, register it inside the map (to all indexes it spans),
      const nextChar = lines[lineIndex][columnIndex + 1];
      if (nextChar === undefined || !isNumber(nextChar)) {
        for (let columnDelta = 0; columnDelta < numberBuilt.length; columnDelta++) {
          numbersMap[lineIndex][numberBeginIndex + columnDelta] = parseInt(numberBuilt);
        }

        // then reset to build next number
        numberBuilt = "";
        numberBeginIndex = undefined;
      }
    }
  }

  return numbersMap;
}

function getGearRatioOfPart(numbersMap: (number | undefined)[][], lineIndex: number, columnIndex: number) {
  const numbers: number[] = [];

  for (let lineDelta = -1; lineDelta <= 1; lineDelta++) {
    const toSkip: number[] = [];
    for (let columnDelta = -1; columnDelta <= 1; columnDelta++) {
      if (lineDelta === 0 && columnDelta === 0) continue;
      if (toSkip.includes(columnDelta)) continue;

      const number = numbersMap?.[lineIndex + lineDelta]?.[columnIndex + columnDelta];

      if (number !== undefined) {
        numbers.push(number);
        if (number === numbersMap?.[lineIndex + lineDelta]?.[columnIndex]) {
          toSkip.push(0);

          if (number === numbersMap?.[lineIndex + lineDelta]?.[columnIndex + 1]) {
            toSkip.push(1);
          }
        }
      }
    }
  }

  if (numbers.length !== 2) return 0;

  return numbers[0] * numbers[1];
}

function solvePart2(lines: string[]) {
  const numbersMap = buildNumbersMap(lines);

  let sum = 0;

  for (const [lineIndex, line] of lines.entries()) {
    for (const [columnIndex, char] of line.split("").entries()) {
      if (char !== "*") continue;

      sum += getGearRatioOfPart(numbersMap, lineIndex, columnIndex);
    }
  }
  return sum;
}

console.log("The sum of the gear ratios is", solvePart2(lines));
