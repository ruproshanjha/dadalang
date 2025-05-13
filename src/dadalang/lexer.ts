export type Token = {
  type: string;
  value: string | number;
};

const KEYWORDS = [
  "nomoshkar dada",
  "jachchhi dada",
  "dada ei je",
  "bolo dada",
  "porashona dada",
  "jodi dada",
  "nahole jodi dada",
  "nahole dada",
  "jotokhon dada",
  "joto bar dada",
  "dada kaj",
  "phiriye dao",
];

export class Lexer {
  private pos = 0;
  private input: string;

  constructor(input: string) {
    this.input = input;
  }

  tokenize(): Token[] {
    const tokens: Token[] = [];
    while (this.pos < this.input.length) {
      let char = this.input[this.pos];

      // Skip whitespace
      if (/\s/.test(char)) {
        this.pos++;
        continue;
      }

      // Skip single-line comments (// ...)
      if (this.input.startsWith("//", this.pos)) {
        while (this.input[this.pos] !== "\n" && this.pos < this.input.length) {
          this.pos++;
        }
        continue;
      }

      // Keywords (longest match first)
      let matched = false;
      for (const kw of KEYWORDS.sort((a, b) => b.length - a.length)) {
        if (this.input.startsWith(kw, this.pos)) {
          tokens.push({ type: kw.toUpperCase().replace(/ /g, "_"), value: kw });
          this.pos += kw.length;
          matched = true;
          break;
        }
      }
      if (matched) continue;

      // Symbols and operators
      if ("=;,+-*/(){}<>!".includes(char)) {
        let type = "";
        if (char === "=") {
          if (this.input[this.pos + 1] === "=") {
            tokens.push({ type: "EQUALITY", value: "==" });
            this.pos += 2;
            continue;
          }
          type = "EQUAL";
        } else if (char === ";") type = "SEMICOLON";
        else if (char === ",") type = "COMMA";
        else if (char === "+") type = "PLUS";
        else if (char === "-") type = "MINUS";
        else if (char === "*") type = "ASTERISK";
        else if (char === "/") type = "SLASH";
        else if (char === "(") type = "LPAREN";
        else if (char === ")") type = "RPAREN";
        else if (char === "{") type = "LBRACE";
        else if (char === "}") type = "RBRACE";
        else if (char === "<") {
          if (this.input[this.pos + 1] === "=") {
            tokens.push({ type: "LTE", value: "<=" });
            this.pos += 2;
            continue;
          }
          type = "LT";
        } else if (char === ">") {
          if (this.input[this.pos + 1] === "=") {
            tokens.push({ type: "GTE", value: ">=" });
            this.pos += 2;
            continue;
          }
          type = "GT";
        } else if (char === "!") {
          if (this.input[this.pos + 1] === "=") {
            tokens.push({ type: "NEQ", value: "!=" });
            this.pos += 2;
            continue;
          }
        }
        if (type) {
          tokens.push({ type, value: char });
          this.pos++;
          continue;
        }
      }

      // String literals
      if (char === '"') {
        this.pos++;
        let str = "";
        while (this.input[this.pos] !== '"' && this.pos < this.input.length) {
          str += this.input[this.pos++];
        }
        if (this.input[this.pos] !== '"') {
          throw new Error(
            "Dada, string sesh hoy nai! Closing quote khuje pachhi na."
          );
        }
        this.pos++; // skip closing "
        tokens.push({ type: "STRING", value: str });
        continue;
      }

      // Numbers
      if (/\d/.test(char)) {
        let num = "";
        while (/\d/.test(this.input[this.pos])) {
          num += this.input[this.pos++];
        }
        tokens.push({ type: "NUMBER", value: parseInt(num) });
        continue;
      }

      // Identifiers
      if (/[a-zA-Z_]/.test(char)) {
        let ident = "";
        while (/[a-zA-Z0-9_]/.test(this.input[this.pos])) {
          ident += this.input[this.pos++];
        }
        tokens.push({ type: "IDENTIFIER", value: ident });
        continue;
      }

      // If nothing matched, it's an unknown character
      throw new Error(
        `Dada, "${char}" chinho ta ami chinina! Line ektu check korun.`
      );
    }
    return tokens;
  }
}

// Standalone tokenize function for convenience
export function tokenize(input: string): Token[] {
  return new Lexer(input).tokenize();
}
