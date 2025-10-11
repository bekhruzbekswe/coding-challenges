# Cut

A lightweight Node.js implementation of the Unix `cut` command.  
This tool extracts specific fields (columns) from delimited text files or standard input.  
Developed as part of my weekly coding challenges to strengthen systems programming and CLI design skills.

---

## Features

- Supports standard `cut` flags:  
  `-f` (fields), `-d` (delimiter), and file or stdin input (`-`)
- Accepts multiple fields: `-f1,3,5` or `-f "1 3 5"`
- Reads from files or directly from standard input
- Outputs selected fields joined by the same delimiter
- Follows clean code principles for clarity and maintainability

---

## Usage

```bash
# Extract specific fields from a CSV file
node index.js -f1,3 -d, data.csv

# Extract from a tab-separated file (default delimiter)
node index.js -f2,4 data.tsv

# Read from stdin
head -n5 data.csv | node index.js -f "1 2" -d, -

# Use space-separated field list
node index.js -f "1 3 5" -d, data.csv
```

## Example Output

```bash
$ node index.js -f1,3 -d, data.csv
name,city
Alice,Paris
Bob,London
Eve,Berlin
