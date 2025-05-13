import type { Token } from "./lexer";
import * as T from "./types";

export class Parser {
  tokens: Token[];
  pos = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  peek(offset = 0) {
    return this.tokens[this.pos + offset];
  }

  consume(type?: string) {
    const token = this.tokens[this.pos++];
    if (type && token.type !== type) {
      throw new Error(
        `Dada, ami "${type}" expect korechilam, kintu "${token.type}" pelam!`
      );
    }
    return token;
  }

  parse(): { type: "Program"; body: T.ASTNode[] } {
    this.consume("NOMOSHKAR_DADA");
    const body: T.ASTNode[] = [];
    while (this.peek().type !== "JACHCHHI_DADA") {
      body.push(this.parseStatement());
    }
    this.consume("JACHCHHI_DADA");
    return { type: "Program", body };
  }

  parseStatement(): T.ASTNode {
    const token = this.peek();
    switch (token.type) {
      case "DADA_EI_JE":
        return this.parseVarDecl();
      case "BOLO_DADA":
        return this.parsePrint();
      case "PORASHONA_DADA":
        return this.parseInput();
      case "JODI_DADA":
        return this.parseIf();
      case "NAHOLE_JODI_DADA": // handled in parseIf
      case "NAHOLE_DADA": // handled in parseIf
        throw new Error("Dada, unexpected else/else if paowa geche!");
      case "JOTOKHON_DADA":
        return this.parseWhile();
      case "JOTO_BAR_DADA":
        return this.parseFor();
      case "DADA_KAJ":
        return this.parseFunctionDecl();
      case "PHIRIYE_DAO":
        return this.parseReturn();
      case "IDENTIFIER": {
        // Could be function call or assignment
        if (this.peek(1).type === "EQUAL") return this.parseAssignment();
        if (this.peek(1).type === "LPAREN") return this.parseFunctionCall();
        throw new Error("Dada, ei identifier ta ami bujhte parchi na!");
      }
      default:
        throw new Error(
          "Dada, ei statement ta ami bujhte parchi na: " + token.type
        );
    }
  }

  parseVarDecl(): T.VariableDeclaration {
    this.consume("DADA_EI_JE");
    const identifier = this.consume("IDENTIFIER").value as string;
    this.consume("EQUAL");
    const value = this.parseExpression();
    this.consume("SEMICOLON");
    return { type: "VariableDeclaration", identifier, value };
  }

  parseAssignment(): T.VariableDeclaration {
    const identifier = this.consume("IDENTIFIER").value as string;
    this.consume("EQUAL");
    const value = this.parseExpression();
    this.consume("SEMICOLON");
    return { type: "VariableDeclaration", identifier, value };
  }

  parsePrint(): T.PrintStatement {
    this.consume("BOLO_DADA");
    const expr = this.parseExpression();
    this.consume("SEMICOLON");
    return { type: "PrintStatement", expression: expr };
  }

  parseInput(): T.InputStatement {
    this.consume("PORASHONA_DADA");
    const identifier = this.consume("IDENTIFIER").value as string;
    this.consume("SEMICOLON");
    return { type: "InputStatement", identifier };
  }

  parseIf(): T.IfStatement {
    const branches: { condition: T.Expression | null; body: T.ASTNode[] }[] =
      [];
    let first = true;
    while (this.peek().type === (first ? "JODI_DADA" : "NAHOLE_JODI_DADA")) {
      this.consume();
      this.consume("LPAREN");
      const condition = this.parseExpression();
      this.consume("RPAREN");
      this.consume("LBRACE");
      const body: T.ASTNode[] = [];
      while (this.peek().type !== "RBRACE") {
        body.push(this.parseStatement());
      }
      this.consume("RBRACE");
      branches.push({ condition, body });
      first = false;
    }
    // else
    if (this.peek().type === "NAHOLE_DADA") {
      this.consume();
      this.consume("LBRACE");
      const body: T.ASTNode[] = [];
      while (this.peek().type !== "RBRACE") {
        body.push(this.parseStatement());
      }
      this.consume("RBRACE");
      branches.push({ condition: null, body });
    }
    return { type: "IfStatement", branches };
  }

  parseWhile(): T.WhileStatement {
    this.consume("JOTOKHON_DADA");
    this.consume("LPAREN");
    const condition = this.parseExpression();
    this.consume("RPAREN");
    this.consume("LBRACE");
    const body: T.ASTNode[] = [];
    while (this.peek().type !== "RBRACE") {
      body.push(this.parseStatement());
    }
    this.consume("RBRACE");
    return { type: "WhileStatement", condition, body };
  }

  parseFor(): T.ForStatement {
    this.consume("JOTO_BAR_DADA");
    this.consume("LPAREN");
    const init = this.parseVarDecl();
    const condition = this.parseExpression();
    this.consume("SEMICOLON");
    const increment = this.parseAssignment();
    this.consume("RPAREN");
    this.consume("LBRACE");
    const body: T.ASTNode[] = [];
    while (this.peek().type !== "RBRACE") {
      body.push(this.parseStatement());
    }
    this.consume("RBRACE");
    return { type: "ForStatement", init, condition, increment, body };
  }

  parseFunctionDecl(): T.FunctionDeclaration {
    this.consume("DADA_KAJ");
    const name = this.consume("IDENTIFIER").value as string;
    this.consume("LPAREN");
    const params: string[] = [];
    if (this.peek().type !== "RPAREN") {
      params.push(this.consume("IDENTIFIER").value as string);
      while (this.peek().type === "COMMA") {
        this.consume("COMMA");
        params.push(this.consume("IDENTIFIER").value as string);
      }
    }
    this.consume("RPAREN");
    this.consume("LBRACE");
    const body: T.ASTNode[] = [];
    while (this.peek().type !== "RBRACE") {
      body.push(this.parseStatement());
    }
    this.consume("RBRACE");
    return { type: "FunctionDeclaration", name, params, body };
  }

  parseFunctionCall(): T.FunctionCall {
    const name = this.consume("IDENTIFIER").value as string;
    this.consume("LPAREN");
    const args: T.Expression[] = [];
    if (this.peek().type !== "RPAREN") {
      args.push(this.parseExpression());
      while (this.peek().type === "COMMA") {
        this.consume("COMMA");
        args.push(this.parseExpression());
      }
    }
    this.consume("RPAREN");
    this.consume("SEMICOLON");
    return { type: "FunctionCall", name, args };
  }

  parseReturn(): T.ReturnStatement {
    this.consume("PHIRIYE_DAO");
    const value = this.parseExpression();
    this.consume("SEMICOLON");
    return { type: "ReturnStatement", value };
  }

  // Expressions: supports +, -, *, /, <, >, <=, >=, ==, !=
  parseExpression(): T.Expression {
    return this.parseEquality();
  }
  parseEquality(): T.Expression {
    let expr = this.parseComparison();
    while (this.peek().type === "EQUALITY" || this.peek().type === "NEQ") {
      const operator = this.consume().value as string;
      const right = this.parseComparison();
      expr = { type: "BinaryExpression", operator, left: expr, right };
    }
    return expr;
  }
  parseComparison(): T.Expression {
    let expr = this.parseTerm();
    while (["LT", "GT", "LTE", "GTE"].includes(this.peek().type)) {
      const operator = this.consume().value as string;
      const right = this.parseTerm();
      expr = { type: "BinaryExpression", operator, left: expr, right };
    }
    return expr;
  }
  parseTerm(): T.Expression {
    let expr = this.parseFactor();
    while (this.peek().type === "PLUS" || this.peek().type === "MINUS") {
      const operator = this.consume().value as string;
      const right = this.parseFactor();
      expr = { type: "BinaryExpression", operator, left: expr, right };
    }
    return expr;
  }
  parseFactor(): T.Expression {
    let expr = this.parseUnary();
    while (this.peek().type === "ASTERISK" || this.peek().type === "SLASH") {
      const operator = this.consume().value as string;
      const right = this.parseUnary();
      expr = { type: "BinaryExpression", operator, left: expr, right };
    }
    return expr;
  }
  parseUnary(): T.Expression {
    if (this.peek().type === "MINUS") {
      this.consume("MINUS");
      const expr = this.parsePrimary();
      return {
        type: "BinaryExpression",
        operator: "-",
        left: { type: "NumberLiteral", value: 0 },
        right: expr,
      };
    }
    return this.parsePrimary();
  }
  parsePrimary(): T.Expression {
    const token = this.peek();
    if (token.type === "NUMBER") {
      this.consume("NUMBER");
      return { type: "NumberLiteral", value: token.value as number };
    }
    if (token.type === "STRING") {
      this.consume("STRING");
      return { type: "StringLiteral", value: token.value as string };
    }
    if (token.type === "IDENTIFIER") {
      // Could be function call
      if (this.peek(1).type === "LPAREN") {
        const name = this.consume("IDENTIFIER").value as string;
        this.consume("LPAREN");
        const args: T.Expression[] = [];
        if (this.peek().type !== "RPAREN") {
          args.push(this.parseExpression());
          while (this.peek().type === "COMMA") {
            this.consume("COMMA");
            args.push(this.parseExpression());
          }
        }
        this.consume("RPAREN");
        return { type: "FunctionCall", name, args };
      }
      this.consume("IDENTIFIER");
      return { type: "Identifier", name: token.value as string };
    }
    if (token.type === "LPAREN") {
      this.consume("LPAREN");
      const expr = this.parseExpression();
      this.consume("RPAREN");
      return expr;
    }
    throw new Error("Dada, ei expression ta ami bujhte parchi na!");
  }
}
