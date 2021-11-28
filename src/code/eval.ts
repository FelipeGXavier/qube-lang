import { ASTKind, Node } from "../ast/ast";
import { SymbolTable } from '../env/symbol.table';
import { IntegerT } from '../env/integer';

export class Interpreter {

    eval(node: Node, symbolTable: SymbolTable) {
        if (node.kind == ASTKind.Integer) {
            return new IntegerT(node.value);      
        }
    }
}