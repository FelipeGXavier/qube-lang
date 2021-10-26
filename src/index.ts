import Lexer from './lexer/lexer';
import Parser from './parser/parser';

// recursive descent parser
const lexer = new Lexer(`
val x = true;
if (x) {
    return x;
}else {
    return false;
}
val add = def(x,y) {
    return x + y;
}
val result = add(1,2*2);
`)
const parser = new Parser(lexer);
console.dir(parser.parse(), {depth: null})
console.log(parser.getErrors())
