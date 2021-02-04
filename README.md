# Aegis
![plot](https://github.com/Ulq1517/Aegis/blob/main/Aegis.png?raw=true)

## Grammar (Still WIP)
```
Aegis {
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
  Multiply    		     = Exp (multop Exp)+                                                                    --mulidivide
                       | Exponent
  Exponent		         = Exp (exponentop Exp)+                                                                --exponent
                       | Modulo
  Modulo		           = Exp (moduloKey Exp)+                                                                 --modulo
  Assignment           = (typeKeys)? id "=" Exp			                                                          --varAssign
                       | typeKeys id ("=" Exp)?                                                               --varDeclare
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
}
```

## Features
### Arithmetic
|Java|Ageis|
|----|-----|
|+|+|
|-|-|
|*|*|
|/|/|
|%|MOD|
|Math.pow()|**|

### Increment / Decrement
|Java|Aegis|
|-----|-----|
|var++|var++|
|var--|var--|
|++var|++var|
|--var|--var|


### Logic
|Java|Ageis|
|----|-----|
|\|\||\||
|&&|&|
|!|!|

### Compare Logic
|Java|Ageis|
|----|-----|
|==|==|
|!=|!=|
|<|<|
|<=|<=|
|>|>|
|>=|>=|

### Loops
|Java|Ageis|
|----|-----|
|while|LOOP|
|for|DO|

### Conditionals
|Java|Ageis|
|----|-----|
|if...else|IF...OTHER|
|else if|IFOTHER|


### Statically Typed
|Java|Ageis|
|----|-----|
|int|NUM|
|double|DECI|
|boolean|BOOL|
|String|CHARS|

### Comments
|Java|Ageis|
|----|-----|
|//|##|
|/* */|#* *#|

### Data Structures
|Java|Ageis|
|----|-----|
|Type[] array|Type array{index}|
|Map<Integer, String>|map[tyoe1][type2]|

### Function Declarations
|Java|Ageis|
|----|-----|
|public static void main(String[] args){...}|main(CHARS{} args):...END|
| public int addOne(int x){ return ++x;}|addOne(NUM x) NUM: RETURN ++x END|

## Example Programs
### Hello World!
|Java|Ageis|
|----|-----|
|System.out.println("Hello world")|OUTPUT("Hello world")|

### Assignment Operation
|Java         |Ageis        |
|-------------|-------------|
|int x = 3 * y|NUM x = 3 * y|
|double y = 3.14|DECI y = 3.14|
|boolean condition = true|BOOL condition = TRUE|
|String name = "Hello, World!"|CHARS name = "Hello, World!"|
|char character = 'c'|CHARS character = 'c'|

### Looping
|Java|Ageis|
|----|-----|
|for(int i = 0; i < max, i++){...}|DO(NUM i = 0, i < max, i++):...END|
|while(bool){...}|LOOP(BOOL):...END|

### Conditionals
|Java|Ageis|
|----|-----|
|if(boolean){...}|IF(BOOL):... END|
|if(boolean){...}else{...}|IF(BOOL):...OTHER:...END|
|if(boolean){...}else if{...}else{..}|IF(BOOL):...IFOTHER:...OTHER:...END|

### Logic
|Java|Ageis|
|----|-----|
|(X && Y)|(X & Y)|
|(X\|\|Y)|(X\|Y)|
|(!X)|(!X)|
|X == Y| X==Y|
|X!=Y | X!=Y|
|X<=Y|X<=Y|

### Function Declarations
|Java|Ageis|
|----|-----|
|public static void main(String[] args){...}|main(CHARS{} args):...END|

### Data Structures
|Java      |Ageis|
|----------|-----|
|int[] arr =  {1, 3, 2};|NUM{} array=[1,3,2]|
|int arr[3]|NUM array{3}|
|Map<Integer, String> myMap = new HashMap<Integer, String>()|myMap[NUM][CHARS]|
|myMap.put(1, “SomeString”)|myMap ADD[1][“SomeString”]|
|myMap.get(1)|myMap GET[1]|
