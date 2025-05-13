import * as T from "./types";

class ReturnValue {
  public value: any;
  constructor(value: any) {
    this.value = value;
  }
}

export class Interpreter {
  variableStack: Array<Record<string, any>> = [{}]; // stack of scopes
  functions: Record<string, T.FunctionDeclaration> = {};
  onOutput?: (msg: string) => void;
  onInput?: (prompt: string) => Promise<string>;

  get variables() {
    return this.variableStack[this.variableStack.length - 1];
  }

  setInput(values: Array<string>) {
    // Deprecated in async mode, but kept for compatibility
    this.inputQueue = values;
  }
  inputQueue: Array<string> = []; // optional: for legacy input

  async run(ast: { type: "Program"; body: Array<T.ASTNode> }) {
    if (!ast || !Array.isArray(ast.body)) {
      throw new Error("Invalid AST: ast.body is undefined or not an array");
    }
    try {
      for (let i = 0; i < ast.body.length; i++) {
        await this.execute(ast.body[i]);
      }
    } catch (rv) {
      if (rv instanceof ReturnValue) {
        // Ignore return at top level
      } else {
        throw rv;
      }
    }
  }

  async execute(node: T.ASTNode): Promise<any> {
    switch (node.type) {
      case "VariableDeclaration":
        this.variables[node.identifier] = await this.evaluate(node.value);
        break;
      case "PrintStatement": {
        const msg = await this.evaluate(node.expression);
        if (this.onOutput) this.onOutput(String(msg));
        else console.log(msg);
        break;
      }
      case "InputStatement": {
        let inputValue: string = "";
        if (this.onInput) {
          inputValue = await this.onInput(
            `Enter value for ${node.identifier}:`
          );
        } else if (this.inputQueue.length > 0) {
          inputValue = this.inputQueue.shift()!;
        }
        this.variables[node.identifier] = inputValue;
        break;
      }
      case "IfStatement":
        for (let b = 0; b < node.branches.length; b++) {
          const branch = node.branches[b];
          if (
            branch.condition === null ||
            (await this.evaluate(branch.condition))
          ) {
            for (let s = 0; s < branch.body.length; s++) {
              await this.execute(branch.body[s]);
            }
            break;
          }
        }
        break;
      case "WhileStatement":
        while (await this.evaluate(node.condition)) {
          for (let w = 0; w < node.body.length; w++) {
            await this.execute(node.body[w]);
          }
        }
        break;
      case "ForStatement":
        await this.execute(node.init);
        while (await this.evaluate(node.condition)) {
          for (let f = 0; f < node.body.length; f++) {
            await this.execute(node.body[f]);
          }
          await this.execute(node.increment);
        }
        break;
      case "FunctionDeclaration":
        this.functions[node.name] = node;
        break;
      case "FunctionCall":
        return await this.callFunction(
          node.name,
          await Promise.all(node.args.map((a) => this.evaluate(a)))
        );
      case "ReturnStatement":
        throw new ReturnValue(await this.evaluate(node.value));
      case "ExpressionStatement":
        await this.evaluate(node.expression);
        break;
      default:
        throw new Error(
          `Dada, "${
            (node as { type: string }).type
          }" type er AST node ta ami bujhte parchi na!`
        );
    }
  }

  async evaluate(expr: T.Expression): Promise<any> {
    switch (expr.type) {
      case "NumberLiteral":
      case "StringLiteral":
        return expr.value;
      case "Identifier":
        for (let i = this.variableStack.length - 1; i >= 0; i--) {
          if (
            Object.prototype.hasOwnProperty.call(
              this.variableStack[i],
              expr.name
            )
          ) {
            return this.variableStack[i][expr.name];
          }
        }
        throw new Error(
          `Dada, "${expr.name}" namer kono variable paoa jacche na!`
        );
      case "BinaryExpression": {
        const left = await this.evaluate(expr.left);
        const right = await this.evaluate(expr.right);
        switch (expr.operator) {
          case "+":
            return left + right;
          case "-":
            return left - right;
          case "*":
            return left * right;
          case "/":
            return left / right;
          case "<":
            return left < right;
          case ">":
            return left > right;
          case "<=":
            return left <= right;
          case ">=":
            return left >= right;
          case "==":
            return left == right;
          case "!=":
            return left != right;
          default:
            throw new Error(
              `Dada, "${expr.operator}" operator ta ami bujhte parchi na!`
            );
        }
      }
      case "FunctionCall":
        return await this.callFunction(
          expr.name,
          await Promise.all(expr.args.map((a) => this.evaluate(a)))
        );
      default:
        throw new Error("Dada, ei expression ta ami bujhte parchi na!");
    }
  }

  async callFunction(name: string, args: Array<any>): Promise<any> {
    if (!this.functions[name])
      throw new Error(`Dada, "${name}" namer kono function paoa jacche na!`);
    const func = this.functions[name];
    const localScope: Record<string, any> = {};
    for (let i = 0; i < func.params.length; i++) {
      localScope[func.params[i]] = args[i];
    }
    this.variableStack.push(localScope);
    try {
      for (let s = 0; s < func.body.length; s++) {
        await this.execute(func.body[s]);
      }
    } catch (rv) {
      this.variableStack.pop();
      if (rv instanceof ReturnValue) {
        return rv.value;
      } else {
        throw rv;
      }
    }
    this.variableStack.pop();
    return undefined;
  }
}

// Helper function for convenience
export async function runDadaLang(
  ast: { type: "Program"; body: Array<T.ASTNode> },
  input?: Array<string>
) {
  const interpreter = new Interpreter();
  if (input) interpreter.setInput(input);
  return await interpreter.run(ast);
}
