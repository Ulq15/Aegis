# Aegis
![plot](https://github.com/Ulq1517/Aegis/blob/main/Aegis.png?raw=true)

## Grammar
```ohm
Aegis {
  Program          = FunctionDeclare+
  FunctionDeclare  = id "(" (typeKeys id ("," typeKeys id)*)? ")" typeKey? ":\n" Statement+ "\n"endKey
  
  
  
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
  conditionalKey   = "IF" | "OTHER"
  loopKey          = "LOOP" | "DO"
  printKey         = "OUTPUT"
  endKey           = "END"
  keyword          = typeKeys
                   | conditionalKey
                   | loopKey
                   | printKey
                   | endKey
                   | moduloKey
  id               = ~keyword letter alnum*
  comment          = "##" (~"\n" any)* ("\n" | end)   --comment
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
