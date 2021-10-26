import { Token, TokenType, keywords } from './tokens';

export default class Lexer {

    public input: string;
    // Posição atual
    public pos = 0;
    // Próxima posição
    public readPos = 0;
    public currentChar: string | null = "";
    private line = 1;

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

        if (this.currentChar == "\n" && this.pos <= this.input.length - 1) {
            this.next();
            this.line++;
        }

        while(this.currentChar == " ") {
            this.next();
        }

        if (this.currentChar == "=" && this.peek() == "=") {
            this.next();
            token = new Token(TokenType.EQ, "==").setLine(this.line);
        } else if (this.currentChar == "'") {
            token = new Token(TokenType.String, this.string()).setLine(this.line);
        } else if (this.currentChar == TokenType.Assign) {
            token = new Token(TokenType.Assign, this.currentChar).setLine(this.line);
        } else if (this.currentChar == TokenType.Plus) {
            token = new Token(TokenType.Plus, this.currentChar).setLine(this.line);
        } else if (this.currentChar == TokenType.Semicolon) {
            token = new Token(TokenType.Semicolon, this.currentChar).setLine(this.line);
        } else if (this.currentChar == TokenType.Comma) {
            token = new Token(TokenType.Comma, this.currentChar).setLine(this.line);
        } else if (this.currentChar == TokenType.LParen) {
            token = new Token(TokenType.LParen, this.currentChar).setLine(this.line);
        } else if (this.currentChar == TokenType.RParen) {
            token = new Token(TokenType.RParen, this.currentChar).setLine(this.line);
        } else if (this.currentChar == TokenType.LBrace) {
            token = new Token(TokenType.LBrace, this.currentChar).setLine(this.line);
        } else if (this.currentChar == TokenType.RBrace) {
            token = new Token(TokenType.RBrace, this.currentChar).setLine(this.line);
        } else if (this.currentChar == TokenType.Deny) {
            token = new Token(TokenType.Deny, this.currentChar).setLine(this.line);
        } else if (this.currentChar == TokenType.Minus) {
            token = new Token(TokenType.Minus, this.currentChar).setLine(this.line);
        } else if (this.currentChar == TokenType.Mul) {
            token = new Token(TokenType.Mul, this.currentChar).setLine(this.line);
        } else if (this.currentChar == TokenType.Div) {
            token = new Token(TokenType.Div, this.currentChar).setLine(this.line);
        } else if (this.currentChar == '<' && this.peek() == '>') {
            this.next();
            token = new Token(TokenType.DIF, "<>").setLine(this.line);
        } else if (this.currentChar == TokenType.GT) {
            token = new Token(TokenType.GT, this.currentChar).setLine(this.line);
        } else if (this.currentChar == TokenType.LT) {
            token = new Token(TokenType.LT, this.currentChar).setLine(this.line);
        } else if (this.currentChar == null) {
            // Fim da entrada
            token = new Token(TokenType.EOF, this.currentChar).setLine(this.line);
        } else {
            if (this.isLetter(this.currentChar)) {
                const target = this.val();
                let type = keywords[target];
                if (!type) type = TokenType.Ident;
                return new Token(type, target).setLine(this.line);
            } else if (this.isNumeric(this.currentChar)) {
                return this.numeric();
            } else {
                return new Token(TokenType.Illegal, this.currentChar).setLine(this.line);
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
            return new Token(TokenType.Float, this.input.slice(pos, this.pos)).setLine(this.line);
        }
        return new Token(TokenType.Integer, this.input.slice(pos, this.pos)).setLine(this.line);
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