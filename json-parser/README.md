# JSON Parser

I rebuilt `JSON.parse()` from scratch to understand how text becomes structured data.

## The Challenge

Parse JSON without using `JSON.parse()` or any shortcuts. Build a tokenizer and parser that can handle objects, arrays, strings, numbers, booleans, and null.

## My Approach

I split this into three parts:

**Tokenizer (Lexer)**  
Reads raw text character by character and converts it into tokens like `STRING`, `NUMBER`, `LBRACE`, `COLON`, etc.

**Parser**  
Consumes those tokens and recursively builds JavaScript values—objects, arrays, primitives, and null.

**CLI Tool**  
A command-line validator that checks if JSON files are valid and reports errors.

## Usage

**Validate from the command line:**
```bash
parse tests/valid.json
# ✅ tests/valid.json is valid JSON

parse tests/invalid.json
# ❌ tests/invalid.json → Unexpected token at line 3
```

**Use in code:**
```javascript
import parseJSON from "./parser.js";

const data = parseJSON('{"name": "Alice", "scores": [95, 87, 92]}');
console.log(data);
// { name: "Alice", scores: [95, 87, 92] }
```

## Testing
```bash
npm test
# Runs all test cases organized by steps.
```

## What I Learned

Parsing is a two-phase process for good reason—tokenizing handles syntax, parsing handles structure. This challenge showed me how much complexity lives behind that simple one-liner we use every day. Understanding the layered design made me appreciate why parsers are built this way.