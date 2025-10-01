import fs from "fs";
import path from "path";
import parseJSON from "./parse-json.js";

const TESTS_DIR = path.join(process.cwd(), "tests");

function runTests() {
  if (!fs.existsSync(TESTS_DIR)) {
    console.error(`❌ Tests folder not found: ${TESTS_DIR}`);
    process.exit(1);
  }

  const steps = fs.readdirSync(TESTS_DIR).filter(f =>
    fs.statSync(path.join(TESTS_DIR, f)).isDirectory()
  );

  for (const step of steps) {
    const stepDir = path.join(TESTS_DIR, step);
    const files = fs.readdirSync(stepDir).filter(f => f.endsWith(".json"));

    console.log(`\n=== Running tests in ${step} ===`);

    for (const file of files) {
      const filePath = path.join(stepDir, file);
      const input = fs.readFileSync(filePath, "utf8");

      try {
        const result = parseJSON(input);
        console.log(`✅ ${step}/${file} →`, result);
      } catch (err) {
        console.log(`❌ ${step}/${file} → Error: ${err.message}`);
      }
    }
  }
}

runTests();
