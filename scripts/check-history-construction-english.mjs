import fs from "node:fs";

const source = fs.readFileSync("src/lib/history-construction-data.ts", "utf8");
let theme = "unknown";
let missing = 0;
const rows = [];

for (const [index, line] of source.split(/\r?\n/).entries()) {
  const themeMatch = line.match(/id: "([^"]+)"/);
  if (themeMatch) theme = themeMatch[1];
  for (const match of line.matchAll(/l\("[^"]*", "[^"]*"\)/g)) {
    missing += 1;
    rows.push(`${theme}\tline ${index + 1}\t${match[0]}`);
  }
}

console.log(`Missing English fields: ${missing}`);
for (const row of rows) console.log(row);
process.exitCode = missing ? 1 : 0;
