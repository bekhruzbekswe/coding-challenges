# Building `wc` with JavaScript

I finished a small challenge: re-creating the Unix `wc` tool in plain JavaScript (`main.js`).
`wc` is the command that counts lines, words, characters, and bytes in text.

---

### What it does

* `-c` → count bytes
* `-l` → count lines
* `-w` → count words
* `-m` → count characters (Unicode-aware)
* default (no option) → show lines, words, and bytes
* supports reading from **files** and from **stdin** (so you can pipe into it)

---

### Examples

```bash
# count bytes
node main.js -c test.txt
342190 test.txt

# count lines
node main.js -l test.txt
7145 test.txt

# default: lines, words, bytes
node main.js test.txt
7145 58164 342190 test.txt

# use stdin
cat test.txt | node main.js -l
7145
```

---

A simple task, but it was fun breaking down how `wc` actually works and making my own version from scratch.
