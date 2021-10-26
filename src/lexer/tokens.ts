
export enum TokenType {
    
    Illegal = "ILLEGAL",
    EOF = "EOF",

    Ident = "IDENT",
    Integer = "INTEGER",
    Float = "FLOAT",
    String = "STRING",

    // Operators
    Assign = "=",
    Plus = "+",
    Mul = "*",
    Div = "/",
    Deny = "!",
    Minus = "-",

    // Comparator
    GT = ">",
    LT = "<",
    EQ = "==",
    DIF = "<>",


    // Delimiters
    Comma = ",",
    Semicolon = ";",
    LParen = "(",
    RParen = ")",
    LBrace = "{",
    RBrace = "}",

    // Keywords
    Function = "DEF",
    Val = "VAL",
    True = "TRUE",
    False = "FALSE",
    If = "IF",
    Else = "ELSE",
    Return = "RETURN",
    Print = "PRINT"
}


export class Token {

    public type: TokenType;
    public value: string;
    public line = 0;

    constructor(type, value) {
        this.type = type;
        this.value = value;
    }

    setLine(line) {
        this.line = line;
        return this;
    }

}

export const keywords = {
    def: TokenType.Function,
    val: TokenType.Val,
    true: TokenType.True,
    false: TokenType.False,
    if: TokenType.If,
    else: TokenType.Else,
    return: TokenType.Return,
    print: TokenType.Print
};




