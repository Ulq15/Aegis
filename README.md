# Aegis
![plot](https://github.com/Ulq1517/Aegis/blob/main/Aegis.png?raw=true)

## Grammar
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

### Logic

### Loops

### Conditionals

### Statically Typed

### Comments

### Data Structures

### Function Declarations

## Example Programs
