// https://adventofcode.com/2023/day/9

import { fileToArray } from "../utils";

const lines = fileToArray(__filename);
const examples = fileToArray(__filename, ".example");

/* Part 1 */
function solve(lines: string[], predict = (history: number[], last: number) => history[history.length - 1] + last) {
  let sum = 0;
  for (const line of lines) {
    const histories = [];

    let history = line.split(" ").map((n) => parseInt(n));
    histories.push(history);

    while (!history.every((n) => n === 0)) {
      history = history.slice(0, -1).map((_, i) => {
        return history[i + 1] - history[i];
      });

      histories.push(history);
    }

    let lastPrediction = 0;
    for (let j = histories.length - 2; j >= 0; j--) {
      const predictionHistory = histories[j];
      lastPrediction = predict(predictionHistory, lastPrediction);
    }

    sum += lastPrediction;
  }

  return sum;
}

console.log(solve(lines));

/* Part 2 */
console.log(solve(lines, (history: number[], last: number) => history[0] - last));
