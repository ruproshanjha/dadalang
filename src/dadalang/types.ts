export type ASTNode =
  | VariableDeclaration
  | PrintStatement
  | InputStatement
  | IfStatement
  | WhileStatement
  | ForStatement
  | FunctionDeclaration
  | FunctionCall
  | ReturnStatement
  | ExpressionStatement;

export interface VariableDeclaration {
  type: "VariableDeclaration";
  identifier: string;
  value: Expression;
}

export interface PrintStatement {
  type: "PrintStatement";
  expression: Expression;
}

export interface InputStatement {
  type: "InputStatement";
  identifier: string;
}

export interface IfStatement {
  type: "IfStatement";
  branches: { condition: Expression | null; body: ASTNode[] }[];
}

export interface WhileStatement {
  type: "WhileStatement";
  condition: Expression;
  body: ASTNode[];
}

export interface ForStatement {
  type: "ForStatement";
  init: ASTNode;
  condition: Expression;
  increment: ASTNode;
  body: ASTNode[];
}

export interface FunctionDeclaration {
  type: "FunctionDeclaration";
  name: string;
  params: string[];
  body: ASTNode[];
}

export interface FunctionCall {
  type: "FunctionCall";
  name: string;
  args: Expression[];
  assignTo?: string;
}

export interface ReturnStatement {
  type: "ReturnStatement";
  value: Expression;
}

export interface ExpressionStatement {
  type: "ExpressionStatement";
  expression: Expression;
}

export type Expression =
  | { type: "NumberLiteral"; value: number }
  | { type: "StringLiteral"; value: string }
  | { type: "Identifier"; name: string }
  | {
      type: "BinaryExpression";
      operator: string;
      left: Expression;
      right: Expression;
    }
  | { type: "FunctionCall"; name: string; args: Expression[] };
