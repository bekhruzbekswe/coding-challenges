class Parser {
      constructor(tokens) {
        this.tokens = tokens;
        this.pos = 0;
      }
    
      peek() {
        return this.tokens[this.pos];
      }
    
      parseValue() {
        const token = this.peek();
    
        if (!token) throw new Error("Unexpected end of input");
    
        switch (token.type) {
          case "LBRACE":
            return this.parseObject();
          case "LBRACKET":
            return this.parseArray();
          case "STRING":
            this.consume("STRING");
            return token.value;
          case "NUMBER":
            this.consume("NUMBER");
            return token.value;
          case "TRUE":
            this.consume("TRUE");
            return true;
          case "FALSE":
            this.consume("FALSE");
            return false;
          case "NULL":
            this.consume("NULL");
            return null;
          default:
            throw new Error(`Unexpected token: ${token.type}`);
        }
      }
    
      parseObject() {
        const obj = {};
        this.consume("LBRACE");
    
        if (this.peek()?.type === "RBRACE") {
          this.consume("RBRACE");
          return obj; 
        }
    
        while (true) {
          const keyToken = this.consume("STRING");
          this.consume("COLON");
          const value = this.parseValue();
          obj[keyToken.value] = value;
    
          if (this.peek()?.type === "COMMA") {
            this.consume("COMMA");
            continue;
          }
          break;
        }
    
        this.consume("RBRACE");
        return obj;
      }
    
      parseArray() {
        const arr = [];
        this.consume("LBRACKET");
    
        if (this.peek()?.type === "RBRACKET") {
          this.consume("RBRACKET");
          return arr; 
        }
    
        while (true) {
          arr.push(this.parseValue());
          if (this.peek()?.type === "COMMA") {
            this.consume("COMMA");
            continue;
          }
          break;
        }
    
        this.consume("RBRACKET");
        return arr;
      }

      consume(expectedType) {
        const token = this.tokens[this.pos];
        if (!token || token.type !== expectedType) {
          throw new Error(`Expected ${expectedType} but found ${token?.type || "EOF"}`);
        }
        this.pos++;
        return token;
      }
}

export default Parser;