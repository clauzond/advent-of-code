// https://adventofcode.com/2023/day/5

import { fileToArray } from "../utils";

const lines = fileToArray(__filename);
const examples = fileToArray(__filename, ".example");

/* Part 1 */
const titles = {
  seedToSoil: "seed-to-soil map:",
  soilToFertilizer: "soil-to-fertilizer map:",
  fertilizerToWater: "fertilizer-to-water map:",
  waterToLight: "water-to-light map:",
  lightToTemperature: "light-to-temperature map:",
  temperatureToHumidity: "temperature-to-humidity map:",
  humidityToLocation: "humidity-to-location map:",
} as const;

type MapType = {
  destinationRangeStart: number;
  sourceRangeStart: number;
  length: number;
}[];

function getMap(lines: string[], title: string) {
  let index = lines.indexOf(title) + 1;
  const map: MapType = [];
  while (!["", undefined].includes(lines[index])) {
    const numbers = lines[index].split(" ").map((n) => parseInt(n));
    map.push({
      destinationRangeStart: numbers[0],
      sourceRangeStart: numbers[1],
      length: numbers[2],
    });
    index++;
  }

  return map;
}

function convert(map: MapType, source: number): number {
  let destination = source;
  for (const line of map) {
    if (line.sourceRangeStart <= source && source <= line.sourceRangeStart + line.length) {
      const distanceToSource = source - line.sourceRangeStart;
      destination = line.destinationRangeStart + distanceToSource;
      break;
    }
  }

  return destination;
}

function* getSeeds(lines: string[], isRange: boolean) {
  const numbers = lines[0]
    .split(" ")
    .slice(1)
    .map((n) => parseInt(n));

  if (isRange) {
    for (let i = 0; i < numbers.length; i += 2) {
      const rangeStart = numbers[i];
      const length = numbers[i + 1];
      for (let j = 0; j < length; j++) {
        yield rangeStart + j;
      }
    }
  } else {
    yield* numbers;
  }
}

function solve(lines: string[], isRange: boolean) {
  const seeds = getSeeds(lines, isRange);

  const locations = [];

  for (const seed of seeds) {
    let number = seed;

    for (const title of Object.values(titles)) {
      const map = getMap(lines, title);

      number = convert(map, number);
    }
    locations.push(number);
  }

  return Math.min(...locations);
}

console.log("Lowest location is", solve(examples, true));

/* Part 2 */

// console.log("Lowest location is", solve(lines, true));
// to avoid the high complexity, we should manipulate ONLY ranges

type Range = {
  start: number;
  length: number;
};

function getSeedRanges(lines: string[]) {
  const numbers = lines[0]
    .split(" ")
    .slice(1)
    .map((n) => parseInt(n));

  const seedRanges: Range[] = [];

  for (let i = 0; i < numbers.length; i += 2) {
    seedRanges.push({ start: numbers[i], length: numbers[i + 1] });
  }

  return seedRanges;
}

function convertRange(seedRange: Range, map: MapType) {
  const currentRange = { ...seedRange };
  const destinationRanges: Range[] = [];

  // Sort map by sourceRangeStart
  const sortedMap = [...map].sort((a, b) => a.sourceRangeStart - b.sourceRangeStart);

  for (const range of sortedMap) {
    // There is at least one range overlap, beginning by currentRange
    //                     123456789
    // currentRange        .....XXXXXXX..
    // sourceRangeStart    ...XXXX.......
    // matching            .....XX.......
    if (range.sourceRangeStart <= currentRange.start && currentRange.start <= range.sourceRangeStart + range.length) {
      const matchingStart = range.destinationRangeStart + (currentRange.start - range.sourceRangeStart);
      const matchingLength = Math.min(currentRange.length, range.sourceRangeStart + range.length - currentRange.start);
      currentRange.start += matchingLength;
      currentRange.length -= matchingLength;
      destinationRanges.push({ start: matchingStart, length: matchingLength });
    }
    // There is at least one range overlap, beginning by sourceRangeStart
    // currentRange        .....XXX......
    // sourceRangeStart    ......XXXX....
    // matching            ......XX.......
    else if (
      currentRange.start <= range.sourceRangeStart &&
      range.sourceRangeStart <= currentRange.start + currentRange.length
    ) {
      const matchingStart = range.destinationRangeStart + (range.sourceRangeStart - currentRange.start);
      const matchingLength = Math.min(
        currentRange.length,
        currentRange.start + currentRange.length - range.sourceRangeStart
      );
      // currentRange start does not change
      currentRange.length -= matchingLength;
      destinationRanges.push({ start: matchingStart, length: matchingLength });
    }

    if (currentRange.length <= 0) break;

    // Else, there is no overlap, do nothing
    // currentRange  ..XXX.........
    // sourceRangeStart   .......XXX....
  }

  // If some length is left and it has not matched with anything
  if (currentRange.length > 0) {
    destinationRanges.push(currentRange);
  }

  return destinationRanges;
}

function solveWithRanges(lines: string[]) {
  const mapRecord = Object.entries(titles).reduce((prev, [currKey, currValue]) => {
    return { ...prev, [currKey]: getMap(lines, currValue) };
  }, {}) as Record<string, MapType>;

  let rangesOfCurrentType: Range[] = getSeedRanges(lines);
  let rangesOfNextType: Range[] = [];

  // We will convert all seeds to soil, then all soil to fertilizer, ...
  for (const title of Object.keys(titles)) {
    const map = mapRecord[title];

    rangesOfNextType = [];

    for (const range of rangesOfCurrentType) {
      const destinationRanges = convertRange(range, map);
      rangesOfNextType.push(...destinationRanges);
    }

    rangesOfCurrentType = rangesOfNextType.slice();
  }

  return rangesOfCurrentType.reduce((prev, cur) => Math.min(prev, cur.start), rangesOfCurrentType[0].start);
}
console.log("Lowest location is", solveWithRanges(lines));

// length of seeds array 1,753,244,662
