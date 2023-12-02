import fs from "fs";

export const fileToArray = (filename) => {
  const content = fs.readFileSync(filename, "utf-8");

  return content.split(/\r?\n/);
};
