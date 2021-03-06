export enum ASTKind {
    ArrayLiteral = "ARRAY_LITERAL",
    BlockStatement = "BLOCK_STATEMENT",
    Bool = "BOOL",
    CallExpression = "CALL_EXPRESSION",
    ExprStatement = "EXPRESSION",
    FunctionLiteral = "FUNCTION_LITERAL",
    HashLiteral = "HASH_LITERAL",
    Id = "ID",
    IfExpression = "IF_EXPRESSION",
    IndexExpression = "INDEX_EXPRESSION",
    InfixExpression = "INFIX_EXPRESSION",
    Integer = "INTEGER",
    Float = "FLOAT",
    Val = "VAL",
    PrefixExpression = "PREFIX_EXPRESSION",
    Program = "PROGRAM",
    Return = "RETURN",
    String = "STRING",
    WhileExpression = "WHILE_EXPRESSION",
    ReassignStatement = "REASSIGN_STATEMENT",
    Assign = "="
}

export type Node = Program | Statement | Expression;

export type Expression =
    | Bool
    | CallExpression
    | FunctionLiteral
    | Id
    | IfExpression
    | Integer
    | PrefixExpression
    | InfixExpression
    | String
    | Float
    | WhileExpression;

export type Statement =
    | BlockStatement
    | ExprStatement
    | ValStatement
    | ReassignStatement
    | ReturnStatment;
    

export type Program = {
    kind: ASTKind.Program;
    statements: Statement[];
};


export type BlockStatement = {
    kind: ASTKind.BlockStatement;
    statements: Statement[];
};

export type ExprStatement = {
    kind: ASTKind.ExprStatement;
    expression: Expression;
};

export type ReassignStatement = {
    kind: ASTKind.ReassignStatement;
    name: Id;
    value: Expression;
};

export type ValStatement = {
    kind: ASTKind.Val;
    name: Id;
    value: Expression;
};

export type ReturnStatment = {
    kind: ASTKind.Return;
    value: Expression;
};

export type Bool = {
    kind: ASTKind.Bool;
    value: boolean;
};

export type String = {
    kind: ASTKind.String,
    value: string
}

export type CallExpression = {
    kind: ASTKind.CallExpression;
    function: Id | FunctionLiteral;
    arguments: Expression[];
};

export type FunctionLiteral = {
    kind: ASTKind.FunctionLiteral;
    parameters: Id[];
    body: BlockStatement;
};

export type Id = {
    kind: ASTKind.Id;
    value: string;
};

export type IfExpression = {
    kind: ASTKind.IfExpression;
    condition: Expression;
    consequence: BlockStatement;
    alternative?: BlockStatement;
};

export type WhileExpression = {
    kind: ASTKind.WhileExpression;
    condition: Expression;
    consequence: BlockStatement;
};

export type InfixExpression = {
    kind: ASTKind.InfixExpression;
    operator: string;
    left: Expression;
    right: Expression;
};

export type Integer = {
    kind: ASTKind.Integer;
    value: number;
};

export type Float = {
    kind: ASTKind.Float;
    value: number;
};

export type PrefixExpression = {
    kind: ASTKind.PrefixExpression;
    operator: string;
    right: Expression;
};
