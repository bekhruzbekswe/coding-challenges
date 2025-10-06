# Huffman Compressor

A simple **Huffman coding based compressor/decompressor** built in Node.js.
This project was developed as part of my weekly coding challenges to improve as a software engineer.

## Features

* Compress text files into `.huff` format using Huffman coding
* Decompress `.huff` files back to original text
* Shows compression ratio and size savings
* Minimal and self-contained (no external dependencies)

## Usage

```bash
# Compress
node main.js input.txt
# → produces input.txt.huff

# Compress with custom output name
node main.js input.txt compressed

# Decompress
node main.js input.txt.huff
# → produces input.txt

# Decompress with custom output name
node main.js input.txt.huff restored.txt
```

## Example Output

```
✓ Compressed: input.txt → input.txt.huff
  Original: 1200 bytes
  Compressed: 680 bytes
  Savings: 43.33%

✓ Decompressed: input.txt.huff → input.txt
  Output size: 1200 bytes
```

## Notes

* Implemented without third-party libraries.
* Focused on clarity and correctness over performance.
* Written as a step in my ongoing coding challenge series.
