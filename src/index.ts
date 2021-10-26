import Lexer from './lexer/lexer';
import Parser from './parser/parser';

// recursive descent parser
const lexer = new Lexer(`val x = 10;`)
const parser = new Parser(lexer);
console.dir(parser.parse(), {depth: null})
console.log(parser.getErrors())
