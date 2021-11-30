import { BlockStatement, Id } from '../ast/ast';
import { BaseType } from './btype';
import { SymbolTable } from './symbol.table';

export class FunctionT implements BaseType {

    parameters: Id[];
    body: BlockStatement;
    symbolTable: SymbolTable;

    constructor(parameters: Id[], body: BlockStatement, symbolTable: SymbolTable) {
        this.parameters = parameters;
        this.body = body;
        this.symbolTable = symbolTable;
    }

    inspect(): string {
        const parameters = this.parameters.map(param => param.value).join(", ");
        let res = "";
        this.body.statements.forEach(el => res += el.toString());
        const body = this.body.toString().substring(0, this.body.toString().indexOf(")" + 1));
        return `fn(${parameters}) { ${body} [..] }`;
    }
}