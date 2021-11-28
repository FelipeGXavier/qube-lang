import { ASTKind, Node, Statement } from "../ast/ast";
import { SymbolTable } from '../env/symbol.table';
import { IntegerT } from '../env/integer';
import { BaseType } from '../env/btype';
import { BoolT } from "../env/bool";
import { ErrorT } from "../env/error";
import { H_TYPES } from './util';

export class Interpreter {

    eval(node: Node, symbolTable: SymbolTable) {
        if (node.kind == ASTKind.Program) {
            return this.evalStatements(node.statements, symbolTable);
        } else if (node.kind == ASTKind.ExprStatement) {
            return this.eval(node.expression, symbolTable);
        } else if (node.kind == ASTKind.Integer) {
            return new IntegerT(node.value);
        } else if (node.kind == ASTKind.Bool) {
            return new BoolT(node.value);
        } else if (node.kind == ASTKind.PrefixExpression) {
            const right = this.eval(node.right, symbolTable);
            return this.evalPrefixExpr(node.operator, right);
        }
    }

    evalStatements(statements: Statement[], environment: SymbolTable): BaseType {
        let result: BaseType = null;
        for (const statement of statements) {
            result = this.eval(statement, environment);
        }
        return result;
    }

    evalPrefixExpr(operator: string, right: BaseType): BaseType {
        if (operator == "!") {
            return this.evalBangOperatorExpr(right);
        }else if (operator == "-") {
            return this.evalMinusPrefixOperatorExpr(right);
        }else {
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
}

