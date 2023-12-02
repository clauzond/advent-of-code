// https://adventofcode.com/2021/day/4

import { fileToArray } from "../utils";

const lines = fileToArray(__filename);

/* Part 1 */

const drawnNumbers = lines[0];

type BingoBoard = { number: number; marked: boolean }[][];
type NumberToBingoBoard = { [x: string]: { matrixIndex: number; lineIndex: number; columnIndex: number }[] };

function buildBingoBoard() {
  const bingoBoards: BingoBoard[] = [];
  const numberToBingoBoard: NumberToBingoBoard = {};

  // This builds the bingo board
  for (let i = 2; i < lines.length; i += 6) {
    const matrixIndex = bingoBoards.length;

    // The slice of 5 are the 5 lines of the matrix
    const bingoMatrix = lines.slice(i, i + 5).map((line, lineIndex) => {
      // Split to iterate over the columns of the line
      const bingoLine = line
        .trim()
        .replaceAll("  ", " ")
        .split(" ")
        .map((number, columnIndex): BingoBoard[0][0] => {
          // We do a reverse map (number -> board) to easily find where to mark
          if (numberToBingoBoard[number] === undefined) {
            numberToBingoBoard[number] = [{ matrixIndex, lineIndex, columnIndex }];
          } else {
            numberToBingoBoard[number].push({ matrixIndex, lineIndex, columnIndex });
          }

          return { number: parseInt(number), marked: false };
        });

      return bingoLine;
    });

    bingoBoards.push(bingoMatrix);
  }
  return { bingoBoards, numberToBingoBoard };
}

function getScore(bingoBoard: BingoBoard, lastBingoNumber: number) {
  const unmarkedSum = bingoBoard.reduce((prev, curLine) => {
    return (
      prev +
      curLine.reduce((prev, curNumber) => {
        if (curNumber.marked) {
          return prev;
        }
        return prev + curNumber.number;
      }, 0)
    );
  }, 0);
  return unmarkedSum * lastBingoNumber;
}

function getFirstBingoScore() {
  const { bingoBoards, numberToBingoBoard } = buildBingoBoard();
  let winningBoardIndex = undefined;
  let winningNumber = undefined;

  for (const drawnNumber of drawnNumbers.split(",")) {
    const matricesToMark = numberToBingoBoard[drawnNumber];

    for (const n of matricesToMark) {
      bingoBoards[n.matrixIndex][n.lineIndex][n.columnIndex].marked = true;

      // We check if board wins
      let numberOfMarkedInLine = 0;
      let numberOfMarkedInColumn = 0;
      for (let i = 0; i < 5; i++) {
        if (bingoBoards[n.matrixIndex][i][n.columnIndex].marked) {
          numberOfMarkedInColumn++;
        }
        if (bingoBoards[n.matrixIndex][n.lineIndex][i].marked) {
          numberOfMarkedInLine++;
        }
      }

      if (numberOfMarkedInLine === 5 || numberOfMarkedInColumn === 5) {
        winningBoardIndex = n.matrixIndex;
        winningNumber = drawnNumber;
        break;
      }
    }

    if (winningBoardIndex !== undefined) {
      break;
    }
  }

  return winningBoardIndex !== undefined && winningNumber !== undefined
    ? getScore(bingoBoards[winningBoardIndex], parseInt(winningNumber))
    : -1;
}
console.log("Your final score is", getFirstBingoScore());

/* Part 2 */

function getLastBingoScore() {
  const { bingoBoards, numberToBingoBoard } = buildBingoBoard();
  let winners: number[] = [];
  let numberOfWinningBingo = 0;
  let lastWinningBoardIndex = undefined;
  let lastWinningNumber = undefined;

  for (const drawnNumber of drawnNumbers.split(",")) {
    const matricesToMark = numberToBingoBoard[drawnNumber];

    for (const n of matricesToMark) {
      if (winners.includes(n.matrixIndex)) {
        continue;
      }

      bingoBoards[n.matrixIndex][n.lineIndex][n.columnIndex].marked = true;

      // We check if board wins
      let numberOfMarkedInLine = 0;
      let numberOfMarkedInColumn = 0;
      for (let i = 0; i < 5; i++) {
        if (bingoBoards[n.matrixIndex][i][n.columnIndex].marked) {
          numberOfMarkedInColumn++;
        }
        if (bingoBoards[n.matrixIndex][n.lineIndex][i].marked) {
          numberOfMarkedInLine++;
        }
      }

      if (numberOfMarkedInLine === 5 || numberOfMarkedInColumn === 5) {
        lastWinningBoardIndex = n.matrixIndex;
        lastWinningNumber = drawnNumber;
        winners.push(n.matrixIndex);

        if (winners.length === 100) break;
      }
    }

    if (winners.length === 100) break;

    if (numberOfWinningBingo === bingoBoards.length) {
      break;
    }
  }

  return lastWinningBoardIndex !== undefined && lastWinningNumber !== undefined
    ? getScore(bingoBoards[lastWinningBoardIndex], parseInt(lastWinningNumber))
    : -1;
}
console.log("Your last final score is", getLastBingoScore());
