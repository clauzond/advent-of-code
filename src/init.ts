import { writeFileSync, mkdirSync } from "fs";
import { createInterface } from "node:readline";

function typescriptText(year: string, day: string) {
  return `// https://adventofcode.com/${year}/day/${day}

import { fileToArray } from "../utils";

const lines = fileToArray(__filename);
const examples = fileToArray(__filename, '.example');

/* Part 1 */

/* Part 2 */
`;
}

async function createFile(year: string, paddedDay: string, sessionId: string) {
  const day = paddedDay[0] === "0" ? paddedDay[1] : paddedDay;

  const typescriptContent = typescriptText(year, day);

  const inputContent = (
    await fetch(`https://adventofcode.com/${year}/day/${day}/input`, {
      method: "GET",
      credentials: "same-origin",
      headers: {
        cookie: `session=${sessionId}`,
      },
    }).then((res) => res.text())
  ).slice(0, -1);

  mkdirSync(`./src/${year}`, { recursive: true });
  writeFileSync(`./src/${year}/${paddedDay}.ts`, typescriptContent);
  writeFileSync(`./src/${year}/${paddedDay}.input`, inputContent);
  writeFileSync(`./src/${year}/${paddedDay}.example`, "");
  console.log(
    `Successfully created ./src/${year}/${paddedDay}.ts, ./src/${year}/${paddedDay}.input and ./src/${year}/${paddedDay}.example`
  );
}

if (process.argv.length === 5 && process.argv[2] !== "" && process.argv[3] !== "" && process.argv[4] !== "") {
  createFile(process.argv[2], process.argv[3], process.argv[4]);
} else if (process.argv.length === 3 && process.argv[2] !== "") {
  const readLine = createInterface({ input: process.stdin, output: process.stdout });

  readLine.question("What year ?\n> ", (year) => {
    readLine.question("What day ?\n> ", (day) => {
      createFile(year, day.padStart(2, "0"), process.argv[2]);
      readLine.close();
    });
  });
} else {
  console.log("Not enough parameters. Expected: sessionId OR year day sessionId");
}
