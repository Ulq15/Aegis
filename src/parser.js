import ohm from "ohm-js"

const aegisGrammar = ohm.grammar(String.raw`Aegis {
    Program              = FunctionDeclare+
    FunctionDeclare      = id "(" (typeKeys id ("," typeKeys id)*)? ")" typeKeys? ":\n" Body endKey            --functiondeclaration
    Body                 = Exp ("\n" Exp)*
    Exp                  = Math
                         | Assignment
                         | Logic
                         | Conditional
                         | Loop
                         | returnKey Exp                                                                        --returnStatement
                         | printKey "(" Exp ")"                                                                 --print
                         | data
    Math                 = Exp (addop Exp)+                                                                     --addsubtract
                         | Exp crementOp                                                                        --post_increment
                         | crementOp Exp                                                                        --pre_increment
                         | Multiply
    Multiply             = Exp (multop Exp)+                                                                    --mulidivide
                         | Exponent
    Exponent             = Exp (exponentop Exp)+                                                                --exponent
                         | Modulo
    Modulo               = Exp (moduloKey Exp)+                                                                 --modulo
    Assignment           = typeKeys id ("=" Exp)?                                                               --varDeclare
                         |(typeKeys)? id "=" Exp                                                                --varAssign
                         | DictionaryOp
                         | ArrayOp
                         | Array
                         | Dictionary
    Logic                = Exp ((logicop | compareOp) Logic)*                                                   --basicLogicStatement
                         | negateOp Exp                                                                         --negation
    Conditional          = "IF" "(" Logic "):" Body ("IFOTHER" "(" Logic "):" Body)* ("OTHER:" Body)? endKey    --multipleIFs
    Loop                 = "DO" "(" numType? id "=" int "," Logic "," Math "):" Body endKey                     --stepByStepBased
                         | "LOOP" "(" Logic "):" Body endKey                                                    --statementBased
    Array                = typeKeys "{" int "}" id                                                              --declaration
                         | typeKeys "{""}" id "=" "[" data ("," data)* "]"                                      --populate
    ArrayOp              = id"{" int "}" "=" data                                                               --arrayAssignment
    Dictionary           = id "[" typeKeys "][" typeKeys "]"                                                    --dictionaryDeclaration
    DictionaryOp         = id "ADD[" data "][" data "]"                                                         --addToDictionary
                         | id "GET[" data "]"                                                                   --getFromDictionary
    crementOp            = "++" | "--"
    int                  = digit+
    decimal              = digit+ ("." digit+)
    num                  = int | decimal
    boolean              = "TRUE" | "FALSE"
    string               = alnum
                         | space
    stringLiteral        = "\"" string* "\""
    data                 = int | decimal | boolean | stringLiteral | id
    logicop              = "&" | "|"
    compareOp            = "==" | "!=" | "<" | "<=" | ">" | ">="
    negateOp             = "!"
    addop                = "+" | "-"
    multop               = "*" | "/"
    exponentop           = "**"
    numType              = "NUM"
    decimalType          = "DECI"
    booleanType          = "BOOL"
    stringType           = "CHARS"
    typeKeys             = numType | decimalType | booleanType | stringType
    moduloKey            = "MOD"
    conditionalKey       = "IF" | "OTHER" | "IFOTHER"
    loopKey              = "LOOP" | "DO"
    printKey             = "OUTPUT"
    endKey               = "END"
    returnKey            = "RETURN"
    keyword              = typeKeys
                         | conditionalKey
                         | loopKey
                         | printKey
                         | endKey
                         | returnKey
                         | moduloKey
    id                   = ~keyword letter alnum*
    space               += "##" (~"\n" any)* ("\n" | end)                                                       --singleLineComment
                         | "#*" (~"*#" any)* ("*#" | end)                                                       --multiLineComment
  }`)


export default function parse(sourceCode) {
    const match = aegisGrammar.match(sourceCode)
    if (!match.succeeded()) {
        throw new Error(match.message)
    }
    else {
        return match.succeeded()
    }
}