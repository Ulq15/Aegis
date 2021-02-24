# Aegis

![plot](https://github.com/Ulq1517/Aegis/blob/main/resources/Aegis.png?raw=true)

## Pitch

Aegis, a word that is derived from Greek mythology is defined as protection, backing, or support to an individual person or organization. Similarly, Aegis is a programming language that aims to support the user and their experience with the langauge. With hints of Java, Aegis was designed to be statically a typed language with a more basic and simpler to understand structure, such as structuring the language to be similar to pseudo-code as well as replacing curly braces with colons for scope limitations. Aegis seeks to improve code functionality while honing in on code readability!

## Grammar

```
Aegis {
  Program         = classKey id ":" ClassBody endKey
  ClassBody       = Declaration*
  Declaration     = VarDec 
                  | FunDec
  VarDec          = TypeExp id "=" Exp                                          --declaration
                  | id "=" Exp                                                   --assign
  FunDec          = id "(" (TypeExp id ("," TypeExp id)*)? ")" TypeExp? ":" Body endKey               --declaration
  Body            = Statement*                                             
  Statement       = Conditional 
                  | Loop
                  | returnKey Exp                                                                        --return
                  | printKey Parens                                                               --print        
                  | Declaration
                  | Call
  Call            = id "("(Exp(","Exp)*)? ")"                                                  --call                                                    
  Exp             = Formula (logicop Formula)+
  Formula         = Comperand (compareOp Comperand)+ 
  Comperand       = Term (addop Term)*
  Term            = Factor (multop Factor)*
  Factor          = Primary (exponentop Primary)*                                                               --exponent
  Primary         = Primary crementOp                             --postfix
                  | crementOp Primary                             --prefix
                  | negateOp Primary                              --negate
                  | "{" (Exp ("," Exp)*)? "}"                     --array
                  | id "{" Comperand "}"                          --indexing
                  | DictionaryOp
                  | "(" Exp ")"                                   --parens
                  | literal
                  | id
  DictionaryOp    = id "ADD[" Exp "][" Exp "]"                                                          --addToDictionary
                  | id "GET[" Exp "]"                                                                   --getFromDictionary
  Conditional     = "IF" "(" Logic "):" Body ("ELSEIF" "(" Logic "):" Body)* ("ELSE:" Body)? endKey      --condition
  Loop            = "DO" "(" numType? id ("=" int)? "," Logic "," Exp "):" Body endKey                   --stepByStepBased
                  | "LOOP" "(" Logic "):" Body endKey                                                    --statementBased
  crementOp       = "++" | "--"
  int             = digit+
  decimal         = digit+ ("." digit+)
  num             = decimal | int
  boolean         = "TRUE" | "FALSE"
  char            = alnum
                  | space        
  stringLiteral   = "\"" char* "\""
  literal         = num | boolean | stringLiteral
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
  TypeExp         = ArrayType | DictionaryType | numType | decimalType | booleanType | stringType 
  ArrayType       = TypeExp "{" Comperand? "}" 
  DictionaryType  = "[" TypeExp "][" TypeExp "]" 
  moduloKey       = "MOD"
  conditionalKey  = "IF" | "ELSE" | "ELSEIF"
  loopKey         = "LOOP" | "DO"
  printKey        = "OUTPUT"
  endKey          = "END"
  returnKey       = "RETURN"
  classKey        = "CLASS"
  keyword         = TypeExp
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
