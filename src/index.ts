
import Lexer from './lexer/lexer';
import Parser from './parser/parser';
import { Interpreter } from './code/eval';
import { SymbolTable } from './env/symbol.table';

const input = 
`
val x = 1;
while(x < 10) {
    x = x + 1;
    if (x == 9) {
        console('Aqui');
    }
}
console('Resultado: ', x);
`;

const lexer = new Lexer(input);
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
}
