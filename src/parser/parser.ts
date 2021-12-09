import { ASTKind, Program } from '../ast/ast';
import Lexer from "../lexer/lexer";
import { Token, TokenType } from "../lexer/tokens";


enum ExpressionPrecedence {
    LOWEST,
    EQUALS, // = 
    LTGT, // > ou <
    SUM, // + 
    PRODUCT, // *
    PREFIX, // !x ou -x
    CALL // função
}

export default class Parser {

    private lexer: Lexer;
    private currentToken: Token;
    private peekToken: Token;
    private errors = [];
    private prefixFn;
    private infixFn;
    private precedences;

    constructor(lexer) {
        this.lexer = lexer;
        this.currentToken = this.lexer.getNextToken();
        this.peekToken = this.lexer.getNextToken();
        this.init();
    }

    // Produz AST 
    public parse(): Program {
        const statements = [];
        while (this.currentToken.type != TokenType.EOF) {
            const statement = this.parseStatement();
            if (statement != null) {
                statements.push(statement);
            }
            this.next();
        }
        return {
            kind: ASTKind.Program,
            statements
        };
    }

    parseStatement() {
        if (this.currentToken.type == TokenType.Val) {
            return this.parseDeclarationStatement();
        } else if (this.currentToken.type == TokenType.Return) {
            return this.parsetReturn();
        } else {
            return this.parseExprStatement();
        }
    }

    // Erros sintáticos
    public getErrors() {
        return this.errors;
    }

    parseInfixExpr(left) {
        const operator = this.currentToken.value;
        const precedence = this.curPrecedence();
        this.next();
        const right = this.parseExpression(precedence);
        return {
            kind: ASTKind.InfixExpression,
            operator,
            left,
            right
        };
    }

    parseExprStatement() {
        const expression = this.parseExpression(ExpressionPrecedence.LOWEST);
        if (this.peekTokenIs(TokenType.Semicolon)) {
            this.next();
        }
        return {
            kind: ASTKind.ExprStatement,
            expression
        };
    }

    parsePrefixExpr() {
        const operator = this.currentToken.value;
        this.next();
        return {
            kind: ASTKind.PrefixExpression,
            operator,
            right: this.parseExpression(ExpressionPrecedence.PREFIX)
        };
    }

    parseExpression(precedence) {
        const prefix = this.prefixFn[this.currentToken.type];
        if (!prefix) {
            this.errors.push(`Linha ${this.currentToken.line}, Expressão inválida ${this.currentToken.type}`);
            return null;
        }
        let leftExpression = prefix();
        while (!this.peekTokenIs(TokenType.Semicolon) && precedence < this.peekPrecedence()) {
            const infix = this.infixFn[this.peekToken.type];
            if (!infix) {
                return leftExpression;
            }
            this.next();
            leftExpression = infix(leftExpression);
        }

        return leftExpression;
    }

    // Booleano
    parseBool() {
        return { kind: ASTKind.Bool, value: this.currentToken.value };
    }

    // Numérico
    parseNumber() {
        try {
            if (this.currentToken.type == TokenType.Integer) {
                const value = parseInt(this.currentToken.value, 10);
                return { kind: ASTKind.Integer, value };
            } else {
                // Float
                const value = parseFloat(this.currentToken.value);
                return { kind: ASTKind.Float, value };
            }
        } catch (e) {
            const msg = `Linha ${this.currentToken.line}, Não foi possível converter o valor numérico ${this.currentToken.value}`;
            this.errors.push(msg);
            return null;
        }
    }

    // Bloco condicional
    parseIfExpr() {
        if (!this.consume(TokenType.LParen)) {
            return null;
        }
        this.next();
        const condition = this.parseExpression(ExpressionPrecedence.LOWEST);
        if (!this.consume(TokenType.RParen)) {
            return null;
        }
        if (!this.consume(TokenType.LBrace)) {
            return null;
        }
        const consequence = this.parseBlockStatement();
        let alternative;
        if (this.peekTokenIs(TokenType.Else)) {
            this.next();
            this.consume(TokenType.LBrace);
            alternative = this.parseBlockStatement();
        }
        return {
            kind: ASTKind.IfExpression,
            condition,
            consequence,
            alternative
        };
    }

    parseBlockStatement() {
        const statements = [];
        this.next();
        while (this.currentToken.type != TokenType.RBrace && this.currentToken.type != TokenType.EOF) {
            statements.push(this.parseStatement());
            this.next();
        }
        return {
            kind: ASTKind.BlockStatement,
            statements
        };
    }

    parseExpr(precedence) {
        const prefix = this.prefixFn[this.currentToken.type];
        if (!prefix) {
            this.errors.push(`Linha ${this.currentToken.line}, Expressão inválida`);
            return null;
        }
        let leftExpression = prefix();
        while (!this.peekTokenIs(TokenType.Semicolon) && precedence < this.peekPrecedence()) {
            const infix = this.infixFn[this.peekToken.type];
            if (!infix) {
                return leftExpression;
            }
            this.next();
            leftExpression = infix(leftExpression);
        }
        return leftExpression;
    }

    // Parâmetros da função
    parseFunctionParameters() {
        const parameters = [];
        if (this.peekTokenIs(TokenType.RParen)) {
            this.next();
            return parameters;
        }
        this.next();
        const identifier = {
            kind: ASTKind.Id,
            value: this.currentToken.value
        };
        parameters.push(identifier);
        while (this.peekTokenIs(TokenType.Comma)) {
            this.next();
            this.next();
            const identifier = {
                kind: ASTKind.Id,
                value: this.currentToken.value
            };
            parameters.push(identifier);
        }
        this.consume(TokenType.RParen);
        return parameters;
    }

    // Função
    parseFunction() {
        this.consume(TokenType.LParen);
        // Parâmetros
        const parameters = this.parseFunctionParameters();
        this.consume(TokenType.LBrace);
        // Corpo função
        const body = this.parseBlockStatement();
        return {
            kind: ASTKind.FunctionLiteral,
            parameters,
            body
        };
    }

    // Retorno função
    parsetReturn() {
        this.next();
        const value = this.parseExpr(ExpressionPrecedence.LOWEST);
        if (this.peekTokenIs(TokenType.Semicolon)) {
            this.next();
        }
        return {
            kind: ASTKind.Return,
            value
        };
    }

    // Variável
    parseId() {
        return { kind: ASTKind.Id, value: this.currentToken.value };
    }

    parseCallExpr(expression) {
        // Verifica se argumento é uma variável ou função
        if (expression.kind !== ASTKind.Id && expression.kind !== ASTKind.FunctionLiteral) {
            const msg = `Linha ${this.currentToken.line}, Expressão de chamada espera um elemento ou função, obetido ${expression.kind}`;
            this.errors.push(msg);
            return null;
        }
        const args = this.parseExpressionList(TokenType.RParen);
        return {
            kind: ASTKind.CallExpression,
            function: expression,
            arguments: args
        };
    }

    parseExpressionList(endToken) {
        const list = [];
        if (this.peekTokenIs(endToken)) {
            this.next();
            return list;
        }
        this.next();
        list.push(this.parseExpression(ExpressionPrecedence.LOWEST));
        while (this.peekTokenIs(TokenType.Comma)) {
            this.next();
            this.next();
            list.push(this.parseExpression(ExpressionPrecedence.LOWEST));
        }
        this.consume(endToken);
        return list;
    }

    // Declaração de variável
    parseDeclarationStatement() {
        if (!this.consume(TokenType.Ident)) {
            return null;
        }
        const name = {
            kind: ASTKind.Id,
            value: this.currentToken.value
        };
        if (!this.consume(TokenType.Assign)) {
            return null;
        }
        this.next();
        const value = this.parseExpr(ExpressionPrecedence.LOWEST);
        if (this.peekTokenIs(TokenType.Semicolon)) {
            this.next();
        }
        return {
            kind: ASTKind.Val,
            name,
            value
        };
    }

    peekTokenIs(expected) {
        return this.peekToken.type === expected;
    }

    consume(tokenType) {
        if (this.peekTokenIs(tokenType)) {
            this.next();
            return true;
        } else {
            const msg = `Linha ${this.currentToken.line}, Elemento esperado ${tokenType}, obtido ${this.peekToken.type}`;
            this.errors.push(msg);
            return false;
        }
    }

    parseString() {
        return { kind: ASTKind.String, value: this.currentToken.value };
    }

    next() {
        this.currentToken = this.peekToken;
        this.peekToken = this.lexer.getNextToken();
    }

    peekPrecedence() {
        return this.precedences[this.peekToken.type] || ExpressionPrecedence.LOWEST;
    }

    curPrecedence() {
        return this.precedences[this.currentToken.type] || ExpressionPrecedence.LOWEST;
    }

    init() {
        this.prefixFn = {
            [TokenType.Deny]: this.parsePrefixExpr.bind(this),
            [TokenType.LBrace]: this.parsePrefixExpr.bind(this),
            [TokenType.Ident]: this.parseId.bind(this),
            [TokenType.Integer]: this.parseNumber.bind(this),
            [TokenType.Float]: this.parseNumber.bind(this),
            [TokenType.String]: this.parseString.bind(this),
            [TokenType.Minus]: this.parsePrefixExpr.bind(this),
            [TokenType.True]: this.parseBool.bind(this),
            [TokenType.False]: this.parseBool.bind(this),
            [TokenType.If]: this.parseIfExpr.bind(this),
            [TokenType.Function]: this.parseFunction.bind(this),
        }

        this.infixFn = {
            [TokenType.Plus]: this.parseInfixExpr.bind(this),
            [TokenType.Minus]: this.parseInfixExpr.bind(this),
            [TokenType.Div]: this.parseInfixExpr.bind(this),
            [TokenType.Mul]: this.parseInfixExpr.bind(this),
            [TokenType.EQ]: this.parseInfixExpr.bind(this),
            [TokenType.DIF]: this.parseInfixExpr.bind(this),
            [TokenType.LT]: this.parseInfixExpr.bind(this),
            [TokenType.GT]: this.parseInfixExpr.bind(this),
            [TokenType.LParen]: this.parseCallExpr.bind(this)
        }

        this.precedences = {
            [TokenType.EQ]: ExpressionPrecedence.EQUALS,
            [TokenType.DIF]: ExpressionPrecedence.EQUALS,
            [TokenType.LT]: ExpressionPrecedence.LTGT,
            [TokenType.GT]: ExpressionPrecedence.LTGT,
            [TokenType.Plus]: ExpressionPrecedence.SUM,
            [TokenType.Minus]: ExpressionPrecedence.SUM,
            [TokenType.Div]: ExpressionPrecedence.PRODUCT,
            [TokenType.Mul]: ExpressionPrecedence.PRODUCT,
            [TokenType.LParen]: ExpressionPrecedence.CALL,
        };
    }

}