import fs from "fs";

class HuffmanNode {
  constructor(char, freq, left = null, right = null) {
    this.char = char;
    this.freq = freq;
    this.left = left;
    this.right = right;
  }

  isLeaf() {
    return !this.left && !this.right;
  }
}

function buildFrequencyMap(text) {
  const freq = new Map();
  for (const ch of text) {
    freq.set(ch, (freq.get(ch) || 0) + 1);
  }
  return freq;
}

function buildHuffmanTree(freqMap) {
  if (freqMap.size === 0) {
    throw new Error("Cannot build Huffman tree from empty text");
  }

  const nodes = Array.from(freqMap, ([char, freq]) => new HuffmanNode(char, freq));
  
  if (nodes.length === 1) {
    return new HuffmanNode(null, nodes[0].freq, nodes[0], null);
  }

  nodes.sort((a, b) => a.freq - b.freq);

  while (nodes.length > 1) {
    const left = nodes.shift(); 
    const right = nodes.shift(); 
    
    const merged = new HuffmanNode(null, left.freq + right.freq, left, right);

    let insertPos = 0;
    while (insertPos < nodes.length && nodes[insertPos].freq < merged.freq) {
      insertPos++;
    }
    nodes.splice(insertPos, 0, merged);
  }

  return nodes[0];
}

function generateHuffmanCodes(tree) {
  const codes = new Map();

  function traverse(node, code) {
    if (node.isLeaf()) {
      codes.set(node.char, code || "0");
      return;
    }
    if (node.left) traverse(node.left, code + "0");
    if (node.right) traverse(node.right, code + "1");
  }

  traverse(tree, "");
  return codes;
}

function encodeText(text, codes) {
  const bits = [];
  for (const ch of text) {
    bits.push(codes.get(ch));
  }
  return bits.join("");
}

function convertBitsToBuffer(bits) {
  const padding = (8 - (bits.length % 8)) % 8;
  const paddedBits = bits + "0".repeat(padding);

  const bytes = new Uint8Array(paddedBits.length / 8);
  for (let i = 0; i < paddedBits.length; i += 8) {
    bytes[i / 8] = parseInt(paddedBits.slice(i, i + 8), 2);
  }

  return { buffer: Buffer.from(bytes), padding };
}

function compress(text) {
  if (!text) {
    throw new Error("Cannot compress empty text");
  }

  const freqMap = buildFrequencyMap(text);
  const tree = buildHuffmanTree(freqMap);
  const codes = generateHuffmanCodes(tree);
  const bits = encodeText(text, codes);
  const { buffer, padding } = convertBitsToBuffer(bits);
  const codesObj = Object.fromEntries(codes);

  return { buffer, codes: codesObj, padding };
}

function writeCompressedFile(fileName, compressed) {
  const output = {
    codes: compressed.codes,
    padding: compressed.padding,
    data: compressed.buffer.toString("base64"),
  };

  const outputPath = `${fileName}.huff`;
  fs.writeFileSync(outputPath, JSON.stringify(output));
  
  return outputPath;
}

function decodeBits(bits, codes, padding) {

  bits = bits.slice(0, bits.length - padding);

  const reverseCodes = Object.fromEntries(
    Object.entries(codes).map(([ch, code]) => [code, ch])
  );

  let decoded = "";
  let current = "";

  for (const bit of bits) {
    current += bit;
    if (reverseCodes[current]) {
      decoded += reverseCodes[current];
      current = "";
    }
  }

  return decoded;
}

function decompress(fileName, outputName) {
  const content = fs.readFileSync(fileName, "utf8");
  const { codes, padding, data } = JSON.parse(content);

  const buffer = Buffer.from(data, "base64");
  let bits = "";
  for (const byte of buffer) {
    bits += byte.toString(2).padStart(8, "0");
  }

  const text = decodeBits(bits, codes, padding);

  fs.writeFileSync(outputName, text);
  return { text, size: text.length };
}

function main() {
  const fileName = process.argv[2];

  if (!fileName) {
    console.error("Usage: node main.js <file>");
    process.exit(1);
  }

  if (fileName.endsWith(".huff")) {
    const outputName = process.argv[3] ?? fileName.replace(/\.huff$/, "");
    try {
      const result = decompress(fileName, outputName);
      console.log(`✓ Decompressed: ${fileName} → ${outputName}`);
      console.log(`  Output size: ${result.size} bytes`);
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
    return;
  }

  if (!fileName.endsWith(".txt")) {
      console.error("Only txt file type is supported");
      process.exit(1);
  }

  try {
    const outputName = process.argv[3] ?? fileName;
    const fileContent = fs.readFileSync(fileName, "utf8");
    const compressed = compress(fileContent);
    const outputPath = writeCompressedFile(outputName, compressed);
    
    const originalSize = Buffer.byteLength(fileContent, "utf8");
    const compressedSize = compressed.buffer.length;
    const ratio = ((1 - compressedSize / originalSize) * 100).toFixed(2);
    
    console.log(`✓ Compressed: ${fileName} → ${outputPath}`);
    console.log(`  Original: ${originalSize} bytes`);
    console.log(`  Compressed: ${compressedSize} bytes`);
    console.log(`  Savings: ${ratio}%`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}


if (process.argv[1].endsWith("main.js")) {
  main();
}

export { 
  compress, 
  buildFrequencyMap, 
  buildHuffmanTree, 
  generateHuffmanCodes, 
  encodeText, 
  convertBitsToBuffer, 
  decompress 
};
