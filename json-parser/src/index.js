import Tokenizer from "./tokenizer.js";
import Parser from "./parser.js";

export default function parseJSON(input) {
  const tokenizer = new Tokenizer(input);
  const tokens = tokenizer.tokenize();

  if (tokens.length === 0) {
    throw new Error("Invalid JSON: empty input");
  }

  const parser = new Parser(tokens);
  const result = parser.parseValue();

  if (parser.pos !== tokens.length) {
    throw new Error("Unexpected trailing tokens");
  }

  return result;
}
