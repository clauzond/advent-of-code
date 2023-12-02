// https://adventofcode.com/2023/day/1

import { fileToArray } from "../utils";

const lines = fileToArray(__filename);

/* Part 1 */

const getNumberFromLine = (line: string) => {
  const numberString = line.replace(/\D/g, "");

  return parseInt(`${numberString[0]}${numberString[numberString.length - 1]}`);
};

const calibrationSum = lines.reduce((prev, cur) => {
  return prev + getNumberFromLine(cur);
}, 0);

console.log("The sum of all calibration values is", calibrationSum);

/* Part 2 */

const spelledOutNumbers = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

const getFirstNumberFromFiveChars = (string: string) => {
  const firstNumber: string | undefined = string.replace(/\D/g, "")[0];
  let firstSpelledOutNumber: number | undefined = undefined;
  for (let [index, s] of spelledOutNumbers.entries()) {
    if (string.includes(s)) {
      firstSpelledOutNumber = index + 1;
      break;
    }
  }

  if (firstNumber !== undefined && firstSpelledOutNumber !== undefined) {
    const index0 = string.indexOf(firstNumber);
    const index1 = string.indexOf(spelledOutNumbers[firstSpelledOutNumber - 1]);
    if (index0 < index1) {
      return parseInt(firstNumber);
    } else {
      return firstSpelledOutNumber;
    }
  } else if (firstNumber !== undefined) {
    return parseInt(firstNumber);
  } else if (firstSpelledOutNumber !== undefined) {
    return firstSpelledOutNumber;
  } else {
    return undefined;
  }
};

const getActualNumberFromLine = (line: string) => {
  let firstNumber = 0;
  let lastNumber = 0;

  for (let i = 0; i < line.length; i++) {
    // look at the 5 first chars starting from i
    let fiveChars = line.substring(i, i + 5);

    const n = getFirstNumberFromFiveChars(fiveChars);

    if (n === undefined) continue;

    if (firstNumber === 0) {
      firstNumber = n;
      lastNumber = n;
    } else {
      lastNumber = n;
    }
  }

  return parseInt(`${firstNumber}${lastNumber}`);
};

const actualCalibrationSum = lines.reduce((prev, cur) => {
  return prev + getActualNumberFromLine(cur);
}, 0);

console.log("The actual sum of calibration values is", actualCalibrationSum);
