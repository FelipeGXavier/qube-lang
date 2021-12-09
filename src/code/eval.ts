import { ASTKind, IfExpression, Node, Statement, ReturnStatment, Id, CallExpression, Expression } from '../ast/ast';
import { SymbolTable } from '../env/symbol.table';
import { IntegerT } from '../env/integer';
import { BaseType } from '../env/btype';
import { BoolT } from "../env/bool";
import { ErrorT } from "../env/error";
import { H_TYPES } from './util';
import { ReturnT } from '../env/return';
import { FunctionT } from '../env/function';
import { FloaT } from '../env/float';
import { StringT } from '../env/string';
import { builtins } from '../env/api';
import { BuiltinT } from '../env/builtin';

export class Interpreter {

    private symbolTable: SymbolTable;

    constructor(symbolTable: SymbolTable) {
        this.symbolTable = symbolTable;
    }

    evalAst(node: Node) {
        this.eval(node, this.symbolTable);
    }

    eval(node: Node, symbolTable: SymbolTable) {
        switch (node.kind) {
            case ASTKind.Program:
                return this.evalProgram(node.statements, symbolTable);
            case ASTKind.ExprStatement:
                return this.eval(node.expression, symbolTable);
            case ASTKind.Integer:
                return new IntegerT(node.value);
            case ASTKind.Bool:
                return new BoolT(node.value);
            case ASTKind.PrefixExpression:
                const right = this.eval(node.right, symbolTable);
                return this.evalPrefixExpr(node.operator, right);
            case ASTKind.InfixExpression:
                const left = this.eval(node.left, symbolTable);
                if (this.errorType(left)) return left;
                const rightOp = this.eval(node.right, symbolTable);
                if (this.errorType(rightOp)) return rightOp;
                return this.evalInfixExpr(node.operator, left, rightOp);
            case ASTKind.BlockStatement:
                return this.evalStatements(node.statements, symbolTable);
            case ASTKind.IfExpression:
                return this.evalIfExpr(node, symbolTable);
            case ASTKind.Return:
                const returns = this.eval(node.value, symbolTable);
                if (this.errorType(returns)) return returns;
                return new ReturnT(returns);
            case ASTKind.Id:
                return this.evalId(node, symbolTable);
            case ASTKind.FunctionLiteral:
                const params = node.parameters;
                const body = node.body;
                return new FunctionT(params, body, symbolTable);
            case ASTKind.CallExpression:
                const fn = this.eval(node.function, symbolTable);
                if (this.errorType(fn)) {
                    return fn;
                }
                const fnArgs = this.evalFnArgs(node.arguments, symbolTable);
                if (fnArgs.length == 1 && this.errorType(fnArgs[0])) {
                    return fnArgs[0];
                }
                return this.executeFn(fn, fnArgs);
            case ASTKind.Val:
                const val = this.eval(node.value, symbolTable);
                if (this.errorType(val)) return val;
                symbolTable.set(node.name.value, val);
                return H_TYPES.NIL;
            case ASTKind.Float:
                return new FloaT(node.value);
            case ASTKind.String:
                return new StringT(node.value);
           
        }
    }

    private executeFn(fn: BaseType, args: BaseType[]): BaseType {
        if (fn instanceof FunctionT) {
            const expected = fn.parameters.length;
            const obtained = args.length;
            if (expected != obtained) {
                return new ErrorT(`Chamada de função inválida, obtido ${obtained} parâmetros, esperado ${expected} para a função: ${fn.inspect()}`);
            }
            const n_symbolTable = new SymbolTable(fn.symbolTable);
            const params = fn.parameters;
            for (let i = 0; i < args.length; i++) {
                n_symbolTable.set(params[i].value, args[i]);
            }
            const evaluated = this.eval(fn.body, n_symbolTable);
            if (evaluated instanceof ReturnT) {
                return evaluated.value;
            }
        }else if (fn instanceof BuiltinT) {
            return fn.func(...args);
        }
        return new ErrorT(`Elemento não é uma função válida: ${fn.inspect()}`);
    }


    private evalFnArgs(expressions: Expression[], symbolTable: SymbolTable): BaseType[] {
        const result: BaseType[] = [];
        for (const expression of expressions) {
            const evaluated = this.eval(expression, symbolTable);
            if (this.errorType(evaluated)) {
                return [evaluated];
            }
            result.push(evaluated);
        }
        return result;
    }

    private evalId(node: Id, symbolTable: SymbolTable) {
        const value = symbolTable.get(node.value);
        if (value) {
            return value;
        }
        const builtin = builtins[node.value];
        if (builtin) return builtin;
        return new ErrorT(`Identificador não encontrado: ${node.value}`);
    }

    private evalProgram(statements: Statement[], symbolTable: SymbolTable): BaseType {
        let result: BaseType = H_TYPES.NIL;
        for (const statement of statements) {
            result = this.eval(statement, symbolTable);
            if (result instanceof ErrorT) {
                console.dir(result.error, {depth: null});
                return result;
            }
            if (result instanceof ReturnT) {
                return result.value;
            }
        }
        return result;
    }

    private evalStatements(statements: Statement[], environment: SymbolTable): BaseType {
        let result: BaseType = null;
        for (const statement of statements) {
            result = this.eval(statement, environment);
            if (result instanceof ErrorT || result instanceof ReturnT) {
                return result;
            }
        }
        return result;
    }


    private evalIfExpr(node, symbolTable: SymbolTable): BaseType {
        const condition = this.eval(node.condition, symbolTable);
        if (this.errorType(condition)) {
            return condition;
        }
        if (condition != H_TYPES.FALSE && condition != H_TYPES.NIL) {
            return this.eval(node.consequence, symbolTable);
        }
        if (node.alternative) {
            return this.eval(node.alternative, symbolTable);
        }
        return H_TYPES.NIL;
    }

    private evalInfixExpr(operator: string, left: BaseType, right: BaseType): BaseType {
        if (left instanceof BoolT && right instanceof BoolT) {
            return this.evalBooleanInfixOperator(operator, left, right);
        }
        if (left instanceof IntegerT && right instanceof IntegerT) {
            return this.evalIntegerInfixOperator(operator, left, right);
        }
        return new ErrorT(
            `Incompatibilidade de tipos: ${left.inspect()} ${operator} ${right.inspect()}`
        );
    }

    private evalIntegerInfixOperator(operator: string, left: IntegerT, right: IntegerT): IntegerT | BoolT | ErrorT {
        switch (operator) {
            case "+":
                return new IntegerT(left.value + right.value);
            case "-":
                return new IntegerT(left.value - right.value);
            case "*":
                return new IntegerT(left.value * right.value);
            case "/":
                if (right.value === 0) {
                    // Runtime error
                    throw new Error("Divisão por zero não permitida");
                }
                return new IntegerT(Math.floor(left.value / right.value));
            case "<":
                return this.toBoolT(left.value < right.value);
            case ">":
                return this.toBoolT(left.value > right.value);
            case "==":
                return this.toBoolT(left.value == right.value);
            case "<>":
                return this.toBoolT(left.value != right.value);
        }
    }

    private evalBooleanInfixOperator(operator: string, left: BoolT, right: BoolT): BoolT | ErrorT {
        switch (operator) {
            case "==":
                return this.toBoolT(left === right);
            case "!=":
                return this.toBoolT(left !== right);
        }
        return new ErrorT(
            `Operador não definido: ${left.inspect()} ${operator} ${right.inspect()}`
        );
    }

    private evalPrefixExpr(operator: string, right: BaseType): BaseType {
        if (operator == "!") {
            return this.evalBangOperatorExpr(right);
        } else if (operator == "-") {
            return this.evalMinusPrefixOperatorExpr(right);
        } else {
            return new ErrorT(`Operador não definido: ${operator}${right.inspect()}`);
        }
    }

    // Eval -
    private evalMinusPrefixOperatorExpr(token: BaseType): BaseType {
        if (token instanceof IntegerT) {
            return new IntegerT(-token.value);
        }
        return new ErrorT(`Operador não definido: -${token.inspect()}`);
    }

    // Eval !
    private evalBangOperatorExpr(token: BaseType): BaseType {
        if (token == H_TYPES.TRUE) {
            return H_TYPES.FALSE;
        } else if (token == H_TYPES.FALSE) {
            return H_TYPES.TRUE;
        } else if (token == H_TYPES.NIL) {
            return H_TYPES.TRUE;
        } else {
            return H_TYPES.FALSE;
        }
    }

    private errorType(node) {
        return node instanceof ErrorT;
    }

    private toBoolT(expr) {
        if (expr) return H_TYPES.TRUE;
        return H_TYPES.FALSE;
    }

    dump() {
        return this.symbolTable;
    }
}

