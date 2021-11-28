
import Lexer from './lexer/lexer';
import Parser from './parser/parser';

const input = 
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
}`;

const lexer = new Lexer(input)
const parser = new Parser(lexer);
console.dir(parser.parse(), {depth: null})
console.log(parser.getErrors())
