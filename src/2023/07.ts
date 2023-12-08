// https://adventofcode.com/2023/day/7

import { fileToArray } from "../utils";

const lines = fileToArray(__filename);
const examples = fileToArray(__filename, ".example");

const CARDS = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];

type Count = { [x: string]: number };

function getCardsCount(hand: string): Count {
  return CARDS.reduce((prev, card) => ({ ...prev, [card]: hand.split(card).length - 1 }), {});
}

function getMax(count: Count): [number, number] {
  return Object.values(count)
    .sort((x, y) => y - x)
    .slice(0, 2) as [number, number];
}

// hand1 < hand2
function compare(hand1: string, hand2: string): number {
  const count1 = getCardsCount(hand1);
  const [max1, max1bis] = getMax(count1);
  const count2 = getCardsCount(hand2);
  const [max2, max2bis] = getMax(count2);

  // Check first occurrence
  if (max1 < max2) {
    return -1;
  } else if (max1 > max2) {
    return 1;
  }

  // Check second occurrence
  if (max1bis < max2bis) {
    return -1;
  } else if (max1bis > max2bis) {
    return 1;
  }

  for (let i = 0; i < hand1.length; i++) {
    const index1 = CARDS.indexOf(hand1[i]);
    const index2 = CARDS.indexOf(hand2[i]);
    if (index1 === index2) continue;

    return index1 < index2 ? -1 : 1;
  }

  return 0;
}

/* Part 1 */
function solve(lines: string[]) {
  const hands = lines.map((line) => {
    const ar = line.split(" ");
    return { hand: ar[0], bid: parseInt(ar[1]) };
  });

  hands.sort((hand1, hand2) => compare(hand1.hand, hand2.hand));
  hands;

  return hands.reduce((prev, hand, index) => prev + hand.bid * (index + 1), 0);
}

console.log("The sum of bids multiplied by ranks is", solve(lines));

/* Part 2 */
const CARDS_JOKER = ["J", "2", "3", "4", "5", "6", "7", "8", "9", "T", "Q", "K", "A"];

function getCardsCountJoker(hand: string): Count {
  return CARDS.reduce((prev, card) => {
    if (card === "J") return prev;

    return { ...prev, [card]: hand.split(card).length - 1 };
  }, {});
}

function getMaxJoker(hand: string, count: Count): [number, number] {
  const nJoker = hand.split("J").length - 1;
  const [max1, max2] = Object.values(count)
    .sort((x, y) => y - x)
    .slice(0, 2) as [number, number];

  return [max1 + nJoker, max2];
}

// hand1 < hand2
function compareJoker(hand1: string, hand2: string): number {
  const count1 = getCardsCountJoker(hand1);
  const [max1, max1bis] = getMaxJoker(hand1, count1);
  const count2 = getCardsCountJoker(hand2);
  const [max2, max2bis] = getMaxJoker(hand2, count2);

  // Check first occurrence
  if (max1 < max2) {
    return -1;
  } else if (max1 > max2) {
    return 1;
  }

  // Check second occurrence
  if (max1bis < max2bis) {
    return -1;
  } else if (max1bis > max2bis) {
    return 1;
  }

  for (let i = 0; i < hand1.length; i++) {
    const index1 = CARDS_JOKER.indexOf(hand1[i]);
    const index2 = CARDS_JOKER.indexOf(hand2[i]);
    if (index1 === index2) continue;

    return index1 < index2 ? -1 : 1;
  }

  return 0;
}

/* Part 1 */
function solveJoker(lines: string[]) {
  const hands = lines.map((line) => {
    const ar = line.split(" ");
    return { hand: ar[0], bid: parseInt(ar[1]) };
  });

  hands.sort((hand1, hand2) => compareJoker(hand1.hand, hand2.hand));
  hands;

  return hands.reduce((prev, hand, index) => prev + hand.bid * (index + 1), 0);
}

console.log("The sum of bids multiplied by ranks is", solveJoker(lines));
