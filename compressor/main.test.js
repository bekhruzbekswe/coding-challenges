import test from "node:test";
import assert from "node:assert/strict";
import { buildFrequencyMap } from "./main.js";

test("buildFrequencyMap correctly", () => {
  const input = "aabBcC!!";
  const freq = buildFrequencyMap(input);

  assert.equal(freq.get("a"), 2);
  assert.equal(freq.get("b"), 1); 
  assert.equal(freq.get("B"), 1); 
  assert.equal(freq.get("c"), 1);
  assert.equal(freq.get("C"), 1);
  assert.equal(freq.get("!"), 2);
});
