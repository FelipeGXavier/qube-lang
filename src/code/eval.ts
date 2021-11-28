import { ASTKind, Node, Statement } from "../ast/ast";
import { SymbolTable } from '../env/symbol.table';
import { IntegerT } from '../env/integer';
import { BaseType } from '../env/btype';
import { BoolT } from "../env/bool";
import { ErrorT } from "../env/error";
import { H_TYPES } from './util';

export class Interpreter {

    eval(node: Node, symbolTable: SymbolTable) {
        switch (node.kind) {
            case ASTKind.PrefixExpression:
                return;
            case ASTKind.Program:
                return this.evalStatements(node.statements, symbolTable);
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
        }
    }

    evalStatements(statements: Statement[], environment: SymbolTable): BaseType {
        let result: BaseType = null;
        for (const statement of statements) {
            result = this.eval(statement, environment);
        }
        return result;
    }

    evalInfixExpr(operator: string, left: BaseType, right: BaseType): BaseType {
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

    evalIntegerInfixOperator(operator: string, left: IntegerT, right: IntegerT): IntegerT | BoolT | ErrorT {
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

    evalBooleanInfixOperator(operator: string, left: BoolT, right: BoolT): BoolT | ErrorT {
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

    evalPrefixExpr(operator: string, right: BaseType): BaseType {
        if (operator == "!") {
            return this.evalBangOperatorExpr(right);
        } else if (operator == "-") {
            return this.evalMinusPrefixOperatorExpr(right);
        } else {
            return new ErrorT(`Operador não definido: ${operator}${right.inspect()}`);
        }
    }

    // Eval -
    evalMinusPrefixOperatorExpr(token: BaseType): BaseType {
        if (token instanceof IntegerT) {
            return new IntegerT(-token.value);
        }
        return new ErrorT(`Operador não definido: -${token.inspect()}`);
    }

    // Eval !
    evalBangOperatorExpr(token: BaseType): BaseType {
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

    errorType(node) {
        return node instanceof ErrorT;
    }

    toBoolT(expr) {
        if (expr != H_TYPES.TRUE) return H_TYPES.TRUE;
        if (expr != H_TYPES.FALSE) return H_TYPES.FALSE;
    }
}

