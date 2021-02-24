import ohm from "ohm-js"

const aegisGrammar = ohm.grammar(String.raw`Aegis {
    Program         = classKey id ":" ProgramBody endKey
    ProgramBody     = Body Function* Body
    Function        = id "(" (typeKeys id ("," typeKeys id)*)? ")" typeKeys? ":" Body endKey               --declaration
    Body            = (Expression | Conditional | Loop)*                                                   --multi
    Expression      = Exp ";"
    Exp             = Assignment
                    | Math
                    | Logic
                    | returnKey Exp                                                                        --returnStatement
                    | printKey "(" Exp ")"                                                                 --print
                    | id
                    | data
    Assignment      = Array
                    | Dictionary
                    | DictionaryOp
                    | ArrayOp
                    | Variable
    Array           = typeKeys "{" (id | int)? "}" id ("=" "{" (data ("," data)*)? "}")?                   --arrayCreate
    ArrayOp         = id"{" (id | int) "}" "=" Exp                                                         --arrayAssignment
    Dictionary      = id "[" typeKeys "][" typeKeys "]"                                                    --dictionaryCreate
    DictionaryOp    = id "ADD[" data "][" data "]"                                                         --addToDictionary
                    | id "GET[" data "]"                                                                   --getFromDictionary
    Variable        = typeKeys  ~("{" (id | int)? "}") id "=" Exp                                          --varDeclare
                    | (typeKeys)?  ~("{" (id | int)? "}") id "=" Exp                                       --varAssign
    Math            = Arithmetic
                    | Multiply
                    | Exponent
                    | Modulo
                    | Crement
    Arithmetic      = Exp (addop Exp)+                                                                     --addsubtract
    Multiply        = Exp (multop Exp)+                                                                    --mulidivide
    Exponent        = Exp (exponentop Exp)+                                                                --exponent
    Modulo          = Exp (moduloKey Exp)+                                                                 --modulo
    Crement         = crementOp? Exp crementOp?                                                            --post_increment
    Logic           = Exp ((logicop | compareOp) Logic)*                                                   --basicLogicStatement
                    | negateOp Exp                                                                         --negation
    Conditional     = "IF" "(" Logic "):" Body ("IFELSE" "(" Logic "):" Body)* ("ELSE:" Body)? endKey      --multipleIFs
    Loop            = "DO" "(" numType? id ("=" int)? "," Logic "," Exp "):" Body endKey                   --stepByStepBased
                    | "LOOP" "(" Logic "):" Body endKey                                                    --statementBased
    crementOp       = "++" | "--"
    int             = digit+
    decimal         = digit+ ("." digit+)
    num             = decimal | int
    boolean         = "TRUE" | "FALSE"
    string          = alnum
                    | space        
    stringLiteral   = "\"" string* "\""
    data            = int | decimal | boolean | stringLiteral
    logicop         = "&" | "|"
    compareOp       = "==" | "!=" | ">=" | "<=" | "<" | ">" 
    negateOp        = "!"
    addop           = "+" | "-"
    multop          = "*" | "/"
    exponentop      = "**"
    numType         = "NUM"
    decimalType     = "DECI"
    booleanType     = "BOOL"
    stringType      = "CHARS"
    typeKeys        = numType | decimalType | booleanType | stringType
    moduloKey       = "MOD"
    conditionalKey  = "IF" | "ELSE" | "IFELSE"
    loopKey         = "LOOP" | "DO"
    printKey        = "OUTPUT"
    endKey          = "END"
    returnKey       = "RETURN"
    classKey        = "CLASS"
    keyword         = typeKeys
                    | conditionalKey
                    | loopKey
                    | printKey
                    | endKey
                    | returnKey
                    | moduloKey
                    | classKey
    id              = ~keyword letter alnum*
    space          += ~"\n"
    space          += "##" (~"\n" any)* ("\n" | end)                                                       --singleLineComment
                    | "#*" (~"*#" any)* ("*#" | end)                                                       --multiLineComment
  }`)

export default function parse(sourceCode) {
  const match = aegisGrammar.match(sourceCode)
  if (!match.succeeded()) {
    throw new Error(match.message)
  } else {
    return match.succeeded()
  }
}
