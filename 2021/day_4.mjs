// https://adventofcode.com/2021/day/4

import { fileToArray } from "../utils.mjs";

const lines = fileToArray("/home/damienc/git/advent_of_code/2021/day_4.input");

/* Part 1 */

const drawnNumbers = lines[0];

function buildBingoBoard() {
  /**
   * @type {{number: string, marked: boolean}[][][]}
   */
  const bingoBoards = [];

  /**
   * @type {{[x: string]: {matrixIndex: number, lineIndex: number, columnIndex: number}[]}}
   */
  const numberToBingoBoard = {};

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
        .map((number, columnIndex) => {
          // We do a reverse map (number -> board) to easily find where to mark
          if (numberToBingoBoard[number] === undefined) {
            numberToBingoBoard[number] = [{ matrixIndex, lineIndex, columnIndex }];
          } else {
            numberToBingoBoard[number].push({ matrixIndex, lineIndex, columnIndex });
          }

          return { number, marked: false };
        });

      return bingoLine;
    });

    bingoBoards.push(bingoMatrix);
  }
  return { bingoBoards, numberToBingoBoard };
}

function getScore(bingoBoard, lastBingoNumber) {
  const unmarkedSum = bingoBoard.reduce((prev, curLine) => {
    return (
      prev +
      curLine.reduce((prev, curNumber) => {
        if (curNumber.marked) {
          return prev;
        }
        return prev + parseInt(curNumber.number);
      }, 0)
    );
  }, 0);
  return unmarkedSum * parseInt(lastBingoNumber);
}

function getFinalScore() {
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

  return getScore(bingoBoards[winningBoardIndex], winningNumber);
}
console.log("Your final score is", getFinalScore());

/* Part 2 */
