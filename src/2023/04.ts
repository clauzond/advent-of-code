// https://adventofcode.com/2023/day/4

import { fileToArray } from "../utils";

const lines = fileToArray(__filename);
const examples = fileToArray(__filename, ".example");

/* Part 1 */
function getNumbersFromCard(line: string) {
  const card = line.replaceAll("  ", " ");
  const separatedNumbers = card
    .split(":")
    .slice(1)
    .join("")
    .split("|")
    .map((numbersString) =>
      numbersString
        .trim()
        .split(" ")
        .map((n) => parseInt(n))
    );

  return {
    winningNumbers: separatedNumbers[0],
    ownedNumbers: separatedNumbers[1],
  };
}
function solve(lines: string[]) {
  return lines.reduce((sum, line) => {
    const { ownedNumbers, winningNumbers } = getNumbersFromCard(line);

    return (
      sum +
      ownedNumbers.reduce((winningCount, owned) => {
        if (!winningNumbers.includes(owned)) return winningCount;

        if (winningCount === 0) return 1;

        return winningCount * 2;
      }, 0)
    );
  }, 0);
}

console.log("The pile of cards is worth", solve(lines));

/* Part 2 */
function solvePartTwo2(lines: string[]) {
  const cardCountMap: number[] = Array(lines.length).fill(1);
  lines.forEach((line, cardIndex) => {
    const { ownedNumbers, winningNumbers } = getNumbersFromCard(line);

    const numberOfCardsWon = ownedNumbers.reduce((prevCardsWon, owned) => {
      if (!winningNumbers.includes(owned)) return prevCardsWon;

      return prevCardsWon + 1;
    }, 0);

    const numberOfCurrentCard = cardCountMap[cardIndex];

    for (let i = 1; i <= numberOfCardsWon; i++) {
      cardCountMap[cardIndex + i] += numberOfCurrentCard;
    }
  });

  return cardCountMap.reduce((prev, numberOfCurrentCard) => {
    return prev + numberOfCurrentCard;
  }, 0);
}

console.log("The number of scratchcards is", solvePartTwo2(lines));
