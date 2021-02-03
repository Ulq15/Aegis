# Aegis
![plot](https://github.com/Ulq1517/Aegis/blob/main/Aegis.png?raw=true)

## Grammar
```
Aegis {
  Program          = FunctionDeclare+
  FunctionDeclare  = id "(" (typeKeys id ("," typeKeys id)*)? ")" typeKey? ":\n" Statement+ "\n"endKey
  Statement        = Math
                   | Assignment
                   | Conditional
                   | Loop
                   | Declaration
  
                     
  int              = digit+
  decimal          = digit+ ("." digit+)
  boolean          = "TRUE" | "FALSE"
  string           = alnum*
  data             = int | decimal | boolean | string
  logicop          = "&" | "|" | "!"
  addop            = "+" | "-"
  multop           = "*" | "/"
  exponentop       = "**"
  numType          = "NUM"
  decimalType      = "DECI"
  booleanType      = "BOOL"
  stringType       = "CHARS"
  typeKeys         = numType | decimalType | booleanType | stringType
  moduloKey        = "MOD"
  conditionalKey   = "IF" | "OTHER" | "IFOTHER"
  loopKey          = "LOOP" | "DO"
  printKey         = "OUTPUT"
  endKey           = "END"
  array            = typeKeys id "{" int "}"
                   | numType id "{}" "=" "[" int (("," int)*)? "]"
                   | decimalType id "{}" "=" "[" decimal (("," decimal)*)? "]"
                   | booleanType id "{}" "=" "[" boolean (("," boolean)*)? "]"
                   | stringType id "{}" "=" "[" string (("," string)*)? "]"
  dictionary       = id "[" typeKeys "][" typeKeys "]"
  dictionaryOp     = "ADD[" data "][" data "]"
                   | "GET[" data "]"
  keyword          = typeKeys
                   | conditionalKey
                   | loopKey
                   | printKey
                   | endKey
                   | moduloKey
  id               = ~keyword letter alnum*
  comment         += "##" (~"\n" any)* ("\n" | end)   --comment
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
