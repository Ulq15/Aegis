# Aegis

![plot](https://github.com/Ulq1517/Aegis/blob/main/resources/Aegis.png?raw=true)

## Website

https://patrickjayo.github.io/aegis/

## Presentation

![Google Drive](https://docs.google.com/presentation/d/1fRCdLTDNPLnE6X3SXR3gmGLfLWao9xx8mjs2Dat19mg/edit?usp=sharing)

## Pitch

Aegis, a word that is derived from Greek mythology is defined as protection, backing, or support to an individual person or organization. Similarly, Aegis is a programming language that aims to support the user and their experience with the langauge. With hints of Java, Aegis was designed to be statically a typed language with a more basic and simpler to understand structure, such as structuring the language to be similar to pseudo-code as well as replacing curly braces with colons for scope limitations. Aegis seeks to improve code functionality while honing in on code readability!

## Grammar

```
Aegis {
  Program         = classKey id ":" ClassBody* endKey                                --declare
  ClassBody       = Declaration
                  | Statement
  Declaration     = VarDec ";"                                                       --var
                  | FunDec                                                           --func
  VarDec          = TypeExp Assignment                                               --initialize
                  | TypeExp id                                                       --declare
                  | FunCall                                                          --funCall              
  Assignment      = id "{" Comparand "}" "=" Exp                                     --array
                  | id addKey "[" Exp "][" Exp "]"                                   --dictAdd
                  | id "=" FunCall                                                   --funCall
                  | id "=" Exp                                                       --assign
  FunDec          = id "(" ListOf<Param, ","> ")" TypeExp ":" Body endKey            --declare
  Param           = TypeExp id                                                       --single
  Body            = Statement*
  Statement       = Conditional 
                  | DoLoop
                  | Loop
                  | Assignment ";"                                                   --assign       
                  | returnKey Exp ";"                                                --return
                  | printKey "(" Exp ")" ";"                                         --print
                  | Declaration
                  | Exp ";"                                                          --expLine
  FunCall         = id "(" ListOf<Exp, ","> ")"                                      --call
  Exp             = Exp (logicop Formula)*                                           --logic
                  | Formula
  Formula         = Formula (compareOp Comparand)*                                   --compare
                  | Comparand
  Comparand       = Comparand (addop Term)*                                          --arithmetic
                  | Term
  Term            = Term (multop Factor)*                                            --multiOp
                  | Factor
  Factor          = Factor (exponentop Primary)*                                     --exponent
                  | Primary                                                        
  Primary         = Primary crementOp                                                --postfix
                  | crementOp Primary                                                --prefix
                  | negateOp Primary                                                 --negate
                  | FunCall
                  | "{" ListOf<Exp, ","> "}"                                         --arrayLiteral
                  | id "{" Comparand "}"                                             --accessArray
                  | id getKey "[" Exp "]"                                            --getDictionary
                  | "(" Exp ")"                                                      --parens
                  | id                                                               --id
                  | literal                                                          --literal
  Conditional     = If ElseIf* Else? endKey               
  If              = "IF" "(" Exp ")" ":" Body                
  ElseIf          = "ELSEIF" "(" Exp ")" ":" Body         
  Else            = "ELSE" ":" Body                          
  DoLoop          = "DO" "(" Assignment "," Exp "," Exp ")" ":" Body endKey          --assign
                  | "DO" "(" VarDec "," Exp "," Exp ")" ":" Body endKey              --declare
  Loop            = "LOOP" "(" Exp ")" ":" Body endKey                               --statement
  int             = digit+
  decimal         = digit+ ("." digit+)
  negative        = "-" (int | decimal)
  true            = "TRUE" ~alnum
  false           = "FALSE" ~alnum
  char            = alnum
                  | space
  stringLiteral   = "\"" char* "\""
  literal         = negative | decimal | int | true | false | stringLiteral
  logicop         = "&" | "|"
  compareOp       = "==" | "!=" | ">=" | "<=" | "<" | ">" 
  negateOp        = "!"
  addop           = "+" | "-" 
  multop          = "*" | "/" | moduloKey
  exponentop      = "**"
  crementOp       = "++" | "--"
  numType         = "NUM"
  decimalType     = "DECI"
  booleanType     = "BOOL"
  charsType       = "CHARS"
  voidType        = "VOID"
  TypeExp         = TypeExp "{" "}"                                                  --array
                  | "[" TypeExp "]" "[" TypeExp "]"                                  --dictionary
                  | numType                                                          --numType
                  | decimalType                                                      --deciType
                  | booleanType                                                      --boolType
                  | charsType                                                        --charsType
                  | voidType                                                         --voidType
  moduloKey       = "MOD"
  conditionalKey  = "IF" | "ELSE" | "ELSEIF"
  loopKey         = "LOOP" | "DO"
  printKey        = "OUTPUT"
  endKey          = "END"
  returnKey       = "RETURN"
  classKey        = "CLASS"
  addKey          = "ADD"
  getKey          = "GET"
  keyword         = conditionalKey
                  | loopKey
                  | printKey
                  | endKey
                  | returnKey
                  | moduloKey
                  | classKey
                  | true
                  | false
                  | numType
                  | decimalType
                  | booleanType
                  | charsType
                  | voidType
                  | addKey
                  | getKey
  id              = ~keyword letter alnum*
  space          += "##" (~"\n" any)* ("\n" | end)                                   --singleLineComment
                  | "#*" (~"*#" any)* ("*#" | end)                                   --multiLineComment
}
```
## Features

### Arithmetic

| Java       | Ageis |
| ---------- | ----- |
| +          | +     |
| -          | -     |
| \*         | \*    |
| /          | /     |
| %          | MOD   |
| Math.pow() | \*\*  |

### Increment / Decrement

| Java  | Aegis |
| ----- | ----- |
| var++ | var++ |
| var-- | var-- |
| ++var | ++var |
| --var | --var |

### Logic

| Java | Ageis |
| ---- | ----- |
| \|\| | \|    |
| &&   | &     |
| !    | !     |

### Compare Logic

| Java | Ageis |
| ---- | ----- |
| ==   | ==    |
| !=   | !=    |
| <    | <     |
| <=   | <=    |
| >    | >     |
| >=   | >=    |

### Loops

| Java  | Ageis |
| ----- | ----- |
| while | LOOP  |
| for   | DO    |

### Conditionals

| Java      | Ageis     |
| --------- | --------- |
| if...else | IF...ELSE |
| else if   | IFELSE    |

### Statically Typed

| Java    | Ageis |
| ------- | ----- |
| int     | NUM   |
| double  | DECI  |
| boolean | BOOL  |
| String  | CHARS |

### Comments

| Java    | Ageis   |
| ------- | ------- |
| //      | ##      |
| /\* \*/ | #\* \*# |

### Data Structures

| Java                 | Ageis             |
| -------------------- | ----------------- |
| double[] array       | DECI array{index} |
| Map<Integer, String> | map[NUM][chars]   |

### Function Declarations

| Java                                        | Ageis                              |
| ------------------------------------------- | ---------------------------------- |
| public static void main(String[] args){...} | main(CHARS{} args):...END          |
| public int addOne(int x){ return ++x;}      | addOne(NUM x) NUM: RETURN ++x; END |

## Example Programs

### Hello World!

| Java                               | Ageis                  |
| ---------------------------------- | ---------------------- |
| System.out.println("Hello world"); | OUTPUT("Hello world"); |

### Assignment Operation

| Java                           | Ageis                         |
| ------------------------------ | ----------------------------- |
| int x = 3 \* y;                | NUM x = 3 \* y;               |
| double y = 3.14;               | DECI y = 3.14;                |
| boolean condition = true;      | BOOL condition = TRUE;        |
| String name = "Hello, World!"; | CHARS name = "Hello, World!"; |
| char character = 'c';          | CHARS character = 'c';        |

### Looping

| Java                              | Ageis                              |
| --------------------------------- | ---------------------------------- |
| for(int i = 0; i < max, i++){...} | DO(NUM i = 0, i < max, i++):...END |
| while(bool){...}                  | LOOP(BOOL):...END                  |

### Conditionals

| Java                                 | Ageis                             |
| ------------------------------------ | --------------------------------- |
| if(boolean){...}                     | IF(BOOL):... END                  |
| if(boolean){...}else{...}            | IF(BOOL):...ELSE:...END           |
| if(boolean){...}else if{...}else{..} | IF(BOOL):...IFELSE:...ELSE:...END |

### Logic

| Java     | Ageis   |
| -------- | ------- |
| (X && Y) | (X & Y) |
| (X\|\|Y) | (X\|Y)  |
| (!X)     | (!X)    |
| X == Y   | X==Y    |
| X!=Y     | X!=Y    |
| X<=Y     | X<=Y    |

### Function Declarations

| Java                                                  | Ageis                             |
| ----------------------------------------------------- | --------------------------------- |
| public static void main(String[] args){...}           | main(CHARS{} args):...END         |
| AccessModifier static returnType name(paramList){...} | name(paramList) returnType:...END |

### Data Structures

| Java                                                         | Ageis                       |
| ------------------------------------------------------------ | --------------------------- |
| int[] arr = {1, 3, 2};                                       | NUM{} array=[1,3,2];        |
| int arr[3];                                                  | NUM array{3};               |
| Map<Integer, String> myMap = new HashMap<Integer, String>(); | myMap[NUM][chars];          |
| myMap.put(1, “SomeString”);                                  | myMap ADD[1][“somestring”]; |
| myMap.get(1);                                                | myMap GET[1];               |
