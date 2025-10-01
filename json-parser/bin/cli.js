#!/usr/bin/env node
import fs from "fs";
import parseJSON from "../src/index.js";

const file = process.argv[2];
if (!file) {
  console.error("Usage: parse <file.json>");
  process.exit(1);
}

try {
  const content = fs.readFileSync(file, "utf-8");
  parseJSON(content);
  console.log(`✅ ${file} is valid JSON`);
  process.exit(0);
} catch (err) {
  console.error(`❌ ${file} → ${err.message}`);
  process.exit(1);
}
