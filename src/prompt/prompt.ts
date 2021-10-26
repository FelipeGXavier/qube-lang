import Lexer from '../lexer/lexer';
import { TokenType } from '../lexer/tokens';
import Parser from '../parser/parser';
const readline = require('readline');
var log = console.log;

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function searchPrompt() {
    return new Promise((res, rej) => {
        rl.question('> ', input => {
            res(input);
          });
    });
}


async function run() {
    console.log(`
      /$$$$$$            /$$                       /$$                                    
    /$$__  $$          | $$                      | $$                                    
   | $$  \ $$ /$$   /$$| $$$$$$$   /$$$$$$       | $$        /$$$$$$  /$$$$$$$   /$$$$$$ 
   | $$  | $$| $$  | $$| $$__  $$ /$$__  $$      | $$       |____  $$| $$__  $$ /$$__  $$
   | $$  | $$| $$  | $$| $$  \ $$| $$$$$$$$      | $$        /$$$$$$$| $$  \ $$| $$  \ $$
   | $$/$$ $$| $$  | $$| $$  | $$| $$_____/      | $$       /$$__  $$| $$  | $$| $$  | $$
   |  $$$$$$/|  $$$$$$/| $$$$$$$/|  $$$$$$$      | $$$$$$$$|  $$$$$$$| $$  | $$|  $$$$$$$
    \____ $$$ \______/ |_______/  \_______/      |________/ \_______/|__/  |__/ \____  $$
         \__/                                                                   /$$  \ $$
                                                                               |  $$$$$$/
                                                                                \______/ `)
    while (true) {
        const input = await searchPrompt();
        if (input == 'exit') {
            process.exit(0);
        }
        const lexer = new Lexer(input.toString());
        const parser = new Parser(lexer);
        const ast = parser.parse();
        if (parser.getErrors().length > 0) {
            console.log(parser.getErrors());
        }else {
            console.dir(ast, {depth: null});
        }
    }
}


run();