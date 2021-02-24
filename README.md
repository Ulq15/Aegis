# Aegis

![plot](https://github.com/Ulq1517/Aegis/blob/main/resources/Aegis.png?raw=true)

## Pitch

Aegis, a word that is derived from Greek mythology is defined as protection, backing, or support to an individual person or organization. Similarly, Aegis is a programming language that aims to support the user and their experience with the langauge. With hints of Java, Aegis was designed to be statically a typed language with a more basic and simpler to understand structure, such as structuring the language to be similar to pseudo-code as well as replacing curly braces with colons for scope limitations. Aegis seeks to improve code functionality while honing in on code readability!

## Grammar

```
Aegis {
  Program         = classKey id ":" ProgramBody endKey
  ProgramBody     = Function*
  Function        = id "(" (typeKeys id ("," typeKeys id)*)? ")" typeKeys? ":" Body endKey               --declaration
  Body            = (Expression | Conditional | Loop)*                                                   
  Expression      = Exp ";"
  Exp             = DataStructures
                  | Math
                  | Logic
                  | Variable
                  | Parens
                  | returnKey Exp                                                                        --return
                  | printKey Parens                                                               --print
                  | id
                  | data
  Parens          = "(" Exp ")"                                                                          --parens
  DataStructures  = Array
                  | Dictionary
                  | DictionaryOp
                  | ArrayOp
  Array           = typeKeys "{" (id | int)? "}" id ("=" "{" (data ("," data)*)? "}")?                   --declaration
  ArrayOp         = id"{" (id | int) "}" "=" Exp                                                         --assign
  Dictionary      = id "[" typeKeys "][" typeKeys "]"                                                    --declaration
  DictionaryOp    = id "ADD[" data "][" data "]"                                                         --addToDictionary
                  | id "GET[" data "]"                                                                   --getFromDictionary
  Variable        = typeKeys  ~("{" (id | int)? "}") id "=" Exp                                          --declaration
                  | (typeKeys)?  ~("{" (id | int)? "}") id "=" Exp                                       --assign
  Math            = Arithmetic
                  | Multiply
                  | Exponent
                  | Modulo
                  | Crement
  Arithmetic      = Exp (addop Exp)+                                                                     --addsubtract
  Multiply        = Exp (multop Exp)+                                                                    --multidivide
  Exponent        = Exp (exponentop Exp)+                                                                --exponent
  Modulo          = Exp (moduloKey Exp)+                                                                 --modulo
  Crement         = crementOp? Exp crementOp?                                                            --addsubtract
  Logic           = Exp (logicop | compareOp) Exp ((logicop | compareOp) Exp)*                                                   --basicLogicStatement
                  | negateOp Exp                                                                         --negation
  Conditional     = "IF" "(" Logic "):" Body ("IFELSE" "(" Logic "):" Body)* ("ELSE:" Body)? endKey      --condition
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
