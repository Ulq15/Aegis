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
|Java|Ageis|
|----|-----|
|    |     |
|&&|&|
|!|!|
### Loops
|Java|Ageis|
|----|-----|
|while|LOOP|
|for|DO|
### Conditionals
|Java|Ageis|
|----|-----|
|If...else|IF...OTHER|
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
|Type[] array        |Type array{index}|
|Map<Integer, String>|map[NUM][CHARS]  |
### Function Declarations
|Java|Ageis|
|----|-----|
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
X is True, Y is false.
|Java|Ageis|
|----|-----|
|(X && Y) is false|(X & Y) is false|
|(X||Y) is true|(X|Y) is true|
|(!X) is false|(!X) is false|
### Function Declarations
|Java|Ageis|
|----|-----|
|public static void main(String[] args){...}|main(CHARS{} args):...END|
### Data Structures
|Java      |Ageis|
|----------|-----|
|int[] arr =  {1, 3, 2};|NUM array{}=[1,3,2]|
|int arr[3]|NUM array{3}|
|Map<Integer, String> myMap = new HashMap<Integer, String>()|myMap[NUM][CHARS]|
|myMap.put(1, “SomeString”)|myMap.add[1][“SomeString”]|
|myMap.get(1)|myMap.get[1]|
