import { ASTKind, Node, Statement } from "../ast/ast";
import { SymbolTable } from '../env/symbol.table';
import { IntegerT } from '../env/integer';
import { BaseType } from '../env/btype';

export class Interpreter {

    eval(node: Node, symbolTable: SymbolTable) {
        if (node.kind == ASTKind.Program) {
            return this.evalStatements(node.statements, symbolTable);
        } else if (node.kind == ASTKind.ExprStatement) {
            return this.eval(node.expression, symbolTable);
        } else if (node.kind == ASTKind.Integer) {
            return new IntegerT(node.value);
        }
    }

    evalStatements(statements: Statement[], environment: SymbolTable): BaseType {
        let result: BaseType = null;
        for (const statement of statements) {
            result = this.eval(statement, environment);
        }
        return result;
    }
}

