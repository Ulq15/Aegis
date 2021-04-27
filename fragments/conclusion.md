
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