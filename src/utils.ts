import { readFileSync } from "fs";

export const fileToArray = (filename: string) => {
  const content = readFileSync(filename.replace(".ts", ".input"), "utf-8");

  return content.split(/\r?\n/);
};
