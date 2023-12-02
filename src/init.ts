import { writeFileSync, mkdirSync } from "fs";

function typescriptText(year: string, day: string) {
  return `// https://adventofcode.com/${year}/day/${day}

import { fileToArray } from "../utils";

const lines = fileToArray(__filename);

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
  console.log(`Successfully created ./src/${year}/${paddedDay}.ts and ./src/${year}/${paddedDay}.input`);
}

if (process.argv.length === 5 && process.argv[2] !== "" && process.argv[3] !== "" && process.argv[4] !== "") {
  await createFile(process.argv[2], process.argv[3], process.argv[4]);
} else {
  console.log("Not enough parameters. Expected: year day sessionId");
}
