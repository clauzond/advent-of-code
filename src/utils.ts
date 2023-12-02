import { readFileSync } from "fs";

export const fileToArray = (filename: string, extension = ".input") => {
  const content = readFileSync(filename.replace(".ts", extension), "utf-8");

  return content.split(/\r?\n/);
};
