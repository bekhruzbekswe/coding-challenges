#!/usr/bin/env -S npx tsx
import fs from "fs";

function countBytes(buf) {
  return buf.byteLength;
}

function countLines(text) {
  return (text.match(/\n/g) || []).length;
}

function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function countChars(text) {
  return [...text].length; 
}

function runCounts(buf, option, filename) {
  const text = buf.toString("utf8");

  let result;
  switch (option) {
    case "-c":
      result = String(countBytes(buf));
      break;
    case "-l":
      result = String(countLines(text));
      break;
    case "-w":
      result = String(countWords(text));
      break;
    case "-m":
      result = String(countChars(text));
      break;
    default:

      result = [
        countLines(text),
        countWords(text),
        countChars(text),
        countBytes(buf),
      ].map(String).join(" ");
  }

  console.log(filename ? result + " " + filename : result);
}

function main() {
  const args = process.argv.slice(2);
  const option = args[0]?.startsWith("-") ? args[0] : undefined;
  const filepath = option ? args[1] : args[0];

  if (filepath) {
    const buf = fs.readFileSync(filepath);
    runCounts(buf, option, filepath);

  } else {

    const chunks = [];
    process.stdin.on("data", chunk => chunks.push(chunk));
    process.stdin.on("end", () => {
      const buf = Buffer.concat(chunks);
      runCounts(buf, option);
    });
  }
}

main();
