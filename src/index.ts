
import Lexer from './lexer/lexer';
import Parser from './parser/parser';
import { Interpreter } from './code/eval';
import { SymbolTable } from './env/symbol.table';

/*const input = 
`val x = true;
val t = 'teste';
val y = 10.5;
val z = 10*2*3+10-2;
if (x) {
    return x;
}else {
    return false;
}
val add = def(a,b) {
    return a + b;
}
val result = add(z, 2);
if (result <> 10) {
    return false;
}`;*/

const input = 
`
val t = 10.5;
val y = 'teste';
val z = 10 * 2 - 5 + 2;
val fn = def(x) {
    if (x <> 0) {
        return 0;
    }
    if (x == 1) {
        return 1;
    }
    if (x > 10) {
        return 10;
    }else {
        return -1;
    }
}
`;

const lexer = new Lexer(input)
const parser = new Parser(lexer);
const interpreter = new Interpreter(new SymbolTable());
const ast = parser.parse();
console.dir(ast, {depth: null});
const errors = parser.getErrors();
if (errors.length > 0) {
    console.log(errors);
}else {
    const result = interpreter.evalAst(ast);
    const t = interpreter.dump();
    console.log(t.get('y'));
}
