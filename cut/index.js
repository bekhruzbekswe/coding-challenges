#!/usr/bin/env node
import { readFileSync } from "fs";
import { resolve } from "path";


function parseArgs(argv) {
  const args = argv.slice(2);
  let fields = null;
  let delimiter = "\t";
  let fileName = null;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg.startsWith("-f")) {
      fields = arg.slice(2).trim() || args[++i];
    } else if (arg.startsWith("-d")) {
      delimiter = arg.slice(2) || args[++i];
    } else {
      fileName = arg;
    }
  }

  if (!fields) {
    throw new Error("Missing -f option. Example: -f1,2 or -f \"1 2\"");
  }

  return { fields, delimiter, fileName };
}

function parseFieldIndices(fields) {
  const indices = fields
    .split(/[, ]+/)
    .filter(Boolean)
    .map((n) => parseInt(n, 10) - 1)
    .filter((n) => !isNaN(n));

  if (indices.length === 0) {
    throw new Error("Invalid field specification. Example: -f1,2 or -f \"1 2\"");
  }

  return indices;
}

function readFileData(filePath, delimiter) {
  try {
    const absolutePath = resolve(filePath);
    const text = readFileSync(absolutePath, "utf8");
    return splitLines(text, delimiter);
  } catch (error) {
    throw new Error(`Failed to read file: ${error.message}`);
  }
}


async function readStdinData(delimiter) {
  return new Promise((resolve) => {
    let input = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => (input += chunk));
    process.stdin.on("end", () => resolve(splitLines(input, delimiter)));
  });
}

function splitLines(text, delimiter) {
  return text
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => line.split(delimiter));
}

function printSelectedFields(rows, indices, delimiter) {
  for (const row of rows) {
    const selected = indices.map((i) => row[i] ?? "").join(delimiter);
    console.log(selected);
  }
}


async function main() {
  try {
    const { fields, delimiter, fileName } = parseArgs(process.argv);
    const fieldIndices = parseFieldIndices(fields);

    const rows =
      !fileName || fileName === "-"
        ? await readStdinData(delimiter)
        : readFileData(fileName, delimiter);

    printSelectedFields(rows, fieldIndices, delimiter);
  } catch (error) {
    console.error("Error:", error.message);
    console.error(
      "Usage: node index.js -f<FieldNumbers> [-d<delimiter>] [file]\n" +
      "Examples:\n" +
      "  node index.js -f1,2 -d, file.csv\n" +
      "  cat file.csv | node index.js -f \"1 3\" -d, -"
    );
    process.exit(1);
  }
}

main();
