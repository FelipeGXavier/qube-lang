
export enum TokenType {
    
    Illegal = "ILLEGAL",
    EOF = "EOF",

    Ident = "IDENT",
    Integer = "INTEGER",

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
    Return = "RETURN"
}


export class Token {

    public type: TokenType;
    public value: string;

    constructor(type, value) {
        this.type = type;
        this.value = value;
    }

}

export const keywords: { [keyword: string]: TokenType } = {
    def: TokenType.Function,
    let: TokenType.Val,
    true: TokenType.True,
    false: TokenType.False,
    if: TokenType.If,
    else: TokenType.Else,
    return: TokenType.Return
};




