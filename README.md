# Aegis
![plot](https://github.com/Ulq1517/Aegis/blob/main/Aegis.png?raw=true)

## Grammar (Still WIP)
```
Aegis {
  Program          = FunctionDeclare+
  FunctionDeclare  = id "(" (typeKeys id ("," typeKeys id)*)? ")" typeKeys? ":\n" Body endKey            --functiondeclaration
  Body               = Exp ("\n" Exp)*  
  Exp                 = Math
                          | Declaration
                          | Assignment
                          | Conditional
                          | Loop
                          | id
                          | data
  Math        = Exp (addop Exp)+            --addsubtract
  				   | Multiply
  Multiply    = Exp (multop Exp)+      --mulidivide
                   | Exponent
  Exponent  = Exp (exponentop Exp)+            --exponent
                   | Modulo
  Modulo     =  Exp (moduloKey Exp)+            --modulo
  				   
  Assignment = (typeKeys)? id "=" Exp			         --varAssign
                      | typeKeys id ("=" Exp)?                  --varDeclare
                      | dictionaryOp
                      | arrayOp       
  
  Conditional      =
  
  Loop                = 
  
  Declaration      = array
                          | dictionary
                          
  int                    = digit+
  decimal           = digit+ ("." digit+)
  num                 = int | decimal
  boolean           = "TRUE" | "FALSE"
  string               = alnum
                          | space
  stringLiteral     = "\"" string* "\""
  data                 = int | decimal | boolean | stringLiteral
  logicop             = "&" | "|" | "!"
  addop              = "+" | "-"
  multop             = "*" | "/"
  exponentop     = "**"
  numType         = "NUM"
  decimalType    = "DECI"
  booleanType    = "BOOL"
  stringType        = "CHARS"
  typeKeys          = numType | decimalType | booleanType | stringType
  moduloKey       = "MOD"
  conditionalKey  = "IF" | "OTHER" | "IFOTHER"
  loopKey            = "LOOP" | "DO"
  printKey            = "OUTPUT"
  endKey             = "END"
  array                 = typeKeys id "{" int "}"                           --declaration
                           | numType id "{}" "=" "[" int (("," int)*)? "]"    --numArrayInit
                           | decimalType id "{}" "=" "[" decimal (("," decimal)*)? "]"  --decimalArrayInit
                           | booleanType id "{}" "=" "[" boolean (("," boolean)*)? "]"  --booleanArrayInit
                           | stringType id "{}" "=" "[" string (("," string)*)? "]"              --stringArrayInit
  arrayOp            = id"{" int "}" "=" data                                    --arrayAssignment
  dictionary          = id "[" typeKeys "][" typeKeys "]"                --dictionaryDeclaration
  dictionaryOp     = id "ADD[" data "][" data "]"                         --addToDictionary
                           | id "GET[" data "]"                                        --getFromDictionary
  keyword            = typeKeys
                           | conditionalKey
                           | loopKey
                           | printKey
                           | endKey
                           | moduloKey
  id                      = ~keyword letter alnum*
  space             += "##" (~"\n" any)* ("\n" | end)   --comment
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
### Logic
|Java      |Ageis|
|----------|-----|
|||        ||    |
|&&        |&    |
|!         |!    |
### Loops
|Java      |Ageis|
|----------|-----|
|while     |LOOP |
|for       |DO   |
### Conditionals
|Java      |Ageis     |
|----------|----------|
|If...else |IF...OTHER|
### Statically Typed
|Java      |Ageis|
|----------|-----|
|int       |NUM  |
|double    |DECI |
|boolean   |BOOL |
|String    |CHARS|
### Comments
|Java      |Ageis|
|----------|-----|
|//        |##   |
|/* */     |#* *#|
### Data Structures
|Java                |Ageis            |
|--------------------|-----------------|
|Type[] array        |Type array{index}|
|Map<Integer, String>|map[NUM][CHARS]  |
### Function Declarations
|Java                                   |Ageis|
|---------------------------------------|--------------------|
|Access static return method(param){...}|name(params) return:|

## Example Programs
### Hello World!
|Java|Ageis|
|----|-----|
|System.out.println("Hello world")|output("Hello world")|

### Assignment Operation
|Java         |Ageis        |
|-------------|-------------|
|int x = 3 * y|NUM x = 3 * y|
|double y = 3.14|DECI y = 3.14|
|boolean condition = true|BOOL condition = TRUE|
|String name = "Hello, World!"|CHARS name = "Hello, World!"|
|char character = 'c'|CHARS character = 'c'|
### Looping
```
```
### Conditionals
```
```
### Logic
X is True, Y is false.
```
```
### Function Declarations
```
```
### Data Structures
```
```
