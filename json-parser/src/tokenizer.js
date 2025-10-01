class Tokenizer {
      constructor(input) {
        this.input = input.trim();
        this.pos = 0;
      }
    
      tokenize() {
        const tokens = [];
    
        while (this.pos < this.input.length) {
          const char = this.input[this.pos];
    
          switch (char) {
            case "{":
              tokens.push({ type: "LBRACE" });
              this.pos++;
              break;
            case "}":
              tokens.push({ type: "RBRACE" });
              this.pos++;
              break;
            case "[":
              tokens.push({ type: "LBRACKET" });
              this.pos++;
              break;
            case "]":
              tokens.push({ type: "RBRACKET" });
              this.pos++;
              break;
            case ":":
              tokens.push({ type: "COLON" });
              this.pos++;
              break;
            case ",":
              tokens.push({ type: "COMMA" });
              this.pos++;
              break;
            case '"': {
              tokens.push({ type: "STRING", value: this.readString() });
              break;
            }
            default:
              if (/\s/.test(char)) {
                this.pos++; 
              } else if (/[0-9\-]/.test(char)) {
                tokens.push({ type: "NUMBER", value: this.readNumber() });
              } else if (this.input.startsWith("true", this.pos)) {
                tokens.push({ type: "TRUE", value: true });
                this.pos += 4;
              } else if (this.input.startsWith("false", this.pos)) {
                tokens.push({ type: "FALSE", value: false });
                this.pos += 5;
              } else if (this.input.startsWith("null", this.pos)) {
                tokens.push({ type: "NULL", value: null });
                this.pos += 4;
              } else {
                throw new Error(`Unexpected character at ${this.pos}: ${char}`);
              }
          }
        }
    
        return tokens;
      }
    
      readString() {
        let result = "";
        this.pos++;
    
        while (this.pos < this.input.length && this.input[this.pos] !== '"') {
          result += this.input[this.pos++];
        }
    
        if (this.input[this.pos] !== '"') {
          throw new Error("Unterminated string");
        }
    
        this.pos++;
        return result;
      }
    
      readNumber() {
        let start = this.pos;
        while (this.pos < this.input.length && /[0-9eE\+\-\.]/.test(this.input[this.pos])) {
          this.pos++;
        }
        return Number(this.input.slice(start, this.pos));
      }
    }
    
    export default Tokenizer;
    