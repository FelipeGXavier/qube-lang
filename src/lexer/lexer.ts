import { Token, TokenType, keywords } from './tokens';

export default class Lexer {

    public input: string;
    // Posição atual
    public pos = 0;
    // Próxima posição
    public readPos = 0;
    public currentChar: string | null = "";
    private line = 0;

    constructor(input: string) {
        this.input = input;
        this.next();
    }

    next() {
        if (this.readPos >= this.input.length) {
            this.currentChar = null;
        } else {
            this.currentChar = this.input[this.readPos];
        }
        this.pos = this.readPos;
        this.readPos++;
    }

    getNextToken() {
        let token = null;

        // Remove espaços em branco e quebra de linha
        while (this.currentChar === " " || this.currentChar === "\t" || this.currentChar === "\n" || this.currentChar === "\r") {
            this.next();
        }

        // if (this.currentChar == "\n" || this.currentChar == "\r" || this.currentChar == "\t") {
        //     this.next();
        //     this.line++;
        //     this.getNextToken();
        // }

        // if (this.currentChar === " ") {
        //     this.next();
        //     this.getNextToken();
        // }

        if (this.currentChar == "=" && this.peek() == "=") {
            this.next();
            token = new Token(TokenType.EQ, "==");
        } else if (this.currentChar == "'") {
            token = new Token(TokenType.String, this.string());
        } else if (this.currentChar == TokenType.Assign) {
            token = new Token(TokenType.Assign, this.currentChar);
        } else if (this.currentChar == TokenType.Plus) {
            token = new Token(TokenType.Plus, this.currentChar);
        } else if (this.currentChar == TokenType.Semicolon) {
            token = new Token(TokenType.Semicolon, this.currentChar);
        } else if (this.currentChar == TokenType.Comma) {
            token = new Token(TokenType.Comma, this.currentChar);
        } else if (this.currentChar == TokenType.LParen) {
            token = new Token(TokenType.LParen, this.currentChar);
        } else if (this.currentChar == TokenType.RParen) {
            token = new Token(TokenType.RParen, this.currentChar);
        } else if (this.currentChar == TokenType.LBrace) {
            token = new Token(TokenType.LBrace, this.currentChar);
        } else if (this.currentChar == TokenType.RBrace) {
            token = new Token(TokenType.RBrace, this.currentChar);
        } else if (this.currentChar == TokenType.Deny) {
            token = new Token(TokenType.Deny, this.currentChar);
        } else if (this.currentChar == TokenType.Minus) {
            token = new Token(TokenType.Minus, this.currentChar);
        } else if (this.currentChar == TokenType.Mul) {
            token = new Token(TokenType.Mul, this.currentChar);
        } else if (this.currentChar == TokenType.Div) {
            token = new Token(TokenType.Div, this.currentChar);
        } else if (this.currentChar == '<' && this.peek() == '>') {
            this.next();
            token = new Token(TokenType.DIF, "<>");
        } else if (this.currentChar == TokenType.GT) {
            token = new Token(TokenType.GT, this.currentChar);
        } else if (this.currentChar == TokenType.LT) {
            token = new Token(TokenType.LT, this.currentChar);
        }
        else if (this.currentChar == null) {
            // Fim da entrada
            token = new Token(TokenType.EOF, this.currentChar);
        } else {
            if (this.isLetter(this.currentChar)) {
                const target = this.val();
                let type = keywords[target];
                if (!type) type = TokenType.Ident;
                return new Token(type, target);
            } else if (this.isNumeric(this.currentChar)) {
                return this.numeric();
            } else {
                return new Token(TokenType.Illegal, this.currentChar);
            }
        }
        this.next();
        return token;
    }

    private val() {
        const pos = this.pos;
        while (this.currentChar && this.isLetter(this.currentChar)) {
            this.next();
        }
        return this.input.slice(pos, this.pos);
    }

    private numeric() {
        const pos = this.pos;
        while (this.currentChar && "0" <= this.currentChar && this.currentChar <= "9") {
            this.next();
        }
        if (this.currentChar == ".") {
            this.next();
            while (this.currentChar != null && this.isNumeric(this.currentChar)) {
                this.next();
            }
            return new Token(TokenType.Float, this.input.slice(pos, this.pos));
        }
        return new Token(TokenType.Integer, this.input.slice(pos, this.pos));
    }

    private string() {
        const pos = this.pos + 1;
        do {
            this.next();
        } while (this.currentChar && this.currentChar !== "'");
        return this.input.slice(pos, this.pos);
    }

    private isLetter(character): boolean {
        return ("a" <= character && character <= "z") || ("A" <= character && character <= "Z") || character == "_";
    }

    private isNumeric(str) {
        if (typeof str != "string") return false;
        return !isNaN(parseInt(str)) && !isNaN(parseFloat(str));
    }

    private peek(): string | null {
        if (this.readPos >= this.input.length) {
            return null;
        }
        return this.input[this.readPos];
    }
}