# Aegis

![plot](https://github.com/Ulq1517/Aegis/blob/main/resources/Aegis.png?raw=true)

## Pitch

Aegis, a word that is derived from Greek mythology is defined as protection, backing, or support to an individual person or organization. Similarly, Aegis is a programming language that aims to support the user and their experience with the langauge. With hints of Java, Aegis was designed to be statically a typed language with a more basic and simpler to understand structure, such as structuring the language to be similar to pseudo-code as well as replacing curly braces with colons for scope limitations. Aegis seeks to improve code functionality while honing in on code readability!

## Grammar

```
Aegis {
  Program         = classKey id ":" ClassBody endKey                                                     --declare
  ClassBody       = Declaration*
  Declaration     = VarDec ";"                                                                           --var
                  | FunDec                                                                               --func
  VarDec          = TypeExp Assignment                                                                   --initialize
                  | TypeExp id                                                                           --declare
                  | FunCall                                                                              --funCall              
  Assignment      = id "{" Comparand "}" "=" Exp                                                         --array
                  | id "ADD[" Exp "][" Exp "]"                                                           --dictAdd
                  | id "=" FunCall                                                                       --funCall
                  | id "=" Exp                                                                           --assign
  FunDec          = id "(" Params ")" TypeExp? ":" Body endKey                                          --declare
  Params          = ListOf<Param, ",">
  Param           = TypeExp id                                                                           --single
  Body            = Statement*
  Statement       = Conditional 
                  | DoLoop
                  | Loop
                  | Assignment ";"                                                                        --assign       
                  | returnKey Exp ";"                                                                    --return
                  | printKey "(" Exp ")" ";"                                                             --print
                  | Declaration
                  | Exp ";"                                                                              --expLine
                  | FunCall ";"                                                                          --funcLine
  FunCall         = id "(" ListOf<Exp, ","> ")"                                                         --call
  Exp             = Exp (logicop Formula)*                                                               --logic
                  | Formula
  Formula         = Formula (compareOp Comparand)*                                                       --compare
                  | Comparand
  Comparand       = Comparand (addop Term)*                                                              --arithmetic
                  | Term
  Term            = Term (multop Factor)*                                                                --multiOp
                  | Factor
  Factor          = Factor (exponentop Primary)*                                                         --exponent
                  | Primary                                                        
  Primary         = Primary crementOp                                                                    --postfix
                  | crementOp Primary                                                                    --prefix
                  | negateOp Primary                                                                     --negate
                  | FunCall
                  | "{" ListOf<Exp, ","> "}"                                                             --arrayLiteral
                  | id "{" Comparand "}"                                                                 --accessArray
                  | id "GET[" Exp "]"                                                                    --getDictionary
                  | "(" Exp ")"                                                                          --parens
                  | id                                                                                   --id
                  | literal                                                                              --literal
  Conditional     = If ElseIf* Else? endKey               
  If              = "IF" "(" Exp ")" ":" Body                
  ElseIf          = "ELSEIF" "(" Exp ")" ":" Body         
  Else            = "ELSE" ":" Body                          
  DoLoop          = "DO" "(" Assignment "," Exp "," Exp ")" ":" Body endKey                              --assign
                  | "DO" "(" VarDec "," Exp "," Exp ")" ":" Body endKey                                  --declare
  Loop            = "LOOP" "(" Exp ")" ":" Body endKey                                                   --statement
  crementOp       = "++" | "--"
  int             = digit+
  decimal         = digit+ ("." digit+)
  negative        = "-" (int | decimal)
  boolean         = "TRUE" | "FALSE"
  char            = alnum
                  | space
  stringLiteral   = "\"" char* "\""
  literal         = negative | decimal | int | boolean | stringLiteral
  logicop         = "&" | "|"
  compareOp       = "==" | "!=" | ">=" | "<=" | "<" | ">" 
  negateOp        = "!"
  addop           = "+" | "-" 
  multop          = "*" | "/" | moduloKey
  exponentop      = "**"
  numType         = "NUM"
  decimalType     = "DECI"
  booleanType     = "BOOL"
  stringType      = "CHARS"
  TypeExp         = ArrayType | DictionaryType | literalType
  literalType     = numType | decimalType | booleanType | stringType
  ArrayType       = TypeExp "{" Comparand? "}" 
  DictionaryType  = "[" TypeExp "][" TypeExp "]" 
  moduloKey       = "MOD"
  conditionalKey  = "IF" | "ELSE" | "ELSEIF"
  loopKey         = "LOOP" | "DO"
  printKey        = "OUTPUT"
  endKey          = "END"
  returnKey       = "RETURN"
  classKey        = "CLASS"
  keyword         = literalType
                  | conditionalKey
                  | loopKey
                  | printKey
                  | endKey
                  | returnKey
                  | moduloKey
                  | classKey
  id              = ~keyword letter alnum*
  space          += "##" (~"\n" any)* ("\n" | end)                                                       --singleLineComment
                  | "#*" (~"*#" any)* ("*#" | end)                                                       --multiLineComment
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

```

```
