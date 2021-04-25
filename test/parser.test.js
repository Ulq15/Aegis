import assert from "assert"
import parse from "../src/parser.js"
import fs from "fs"
import util from "util"

const examples = []
const location = "./examples/example"
for (let index = 1; index <= 7; index++) {
  const example = location + index + ".ags"
  const code = fs.readFileSync(example).toString()
  examples.push({ name: example, code: code })
}

const classOpen = "CLASS TestClass:\n"
const funcOpen = "testMethod() VOID:\n"
const close = "\nEND"

const syntaxChecks = [
  ["all numeric literal forms", "OUTPUT( 8 * 89.123 );"],
  ["complex expressions", "OUTPUT ( 83 * ((((((((-13 / 21)))))))) + 1 ** 2  - -0);"],
  ["single line comment", "OUTPUT( 0 ); ## this is a comment"],
  ["comments with no text", 'OUTPUT("SomeString");##OUTPUT(TRUE);##'],
  ["non-Latin letters in identifiers", "NUM コンパイラ = 100;"],
  ["variable prefix increment", "NUM x = ++y;"],
  ["logical negate", "BOOL x = TRUE; RETURN(!x != TRUE);"],
  ["array literal assignment", "NUM{} arr = {1,2,3,4,5};"],
  ["dictionary get", "dictionary GET[1];"],
  ["Do loop with internal assignment", "NUM i; DO(i = 0, i < 10, i++): OUTPUT(i); END"],
  ["dictionary add", 'dictionary ADD["SomeKey"]["SomeValue"];'],
  ["dictionary declare", "[NUM][BOOL] dictionary;"],
  ["boolean initialization", "BOOL x = FALSE;"],
  ["Decimal initialization", "DECI d = 3.14;"],
  ["strings", "CHARS c  = \"strings are cool\";"]
]

const syntaxErrors = [
  ["non-letter in an identifier", "NUM ab😭c = 2;", /Line 3, col 7:/],
  ["malformed number", "NUM x= 2. ;", /Line 3, col 10:/],
  ["a missing right operand", "OUTPUT(5 -);", /Line 3, col 11:/],
  ["a non-operator", "OUTPUT(7 * ((2 _ 3))", /Line 3, col 16:/],
  ["an expression starting with a )", "OUTPUT )", /Line 3, col 8:/],
  ["a statement starting with a )", ") * 5;", /Line 3, col 1:/],
  ["an expression starting with a *", "NUM x = * 71;", /Line 3, col 9:/]
]

const ex1 = fs.readFileSync(location + "1.ags").toString()

const ex1AST = `   1 | Program id=Symbol(Example1) classBody=[#2,#40]
   2 | FunDec id=Symbol(factors) parameters=[#3] returnType=#5 body=[#6,#9,#14,#19,#39]
   3 | Variable id=Symbol(y) type=#4
   4 | Type description='NUM'
   5 | Type description='VOID'
   6 | VarDec type=#7 id=Symbol(results)
   7 | ArrayType description='NUM{}' baseType=#8
   8 | Type description='NUM'
   9 | VarInitializer type=#10 assignment=#11
  10 | Type description='NUM'
  11 | Assignment target=Symbol(count) source=#12
  12 | Literal value='0' type=#13
  13 | Type description='NUM'
  14 | VarInitializer type=#15 assignment=#16
  15 | Type description='NUM'
  16 | Assignment target=Symbol(x) source=#17
  17 | Literal value='1' type=#18
  18 | Type description='NUM'
  19 | Loop condition=#20 body=[#22,#27,#37]
  20 | BinaryExpression left=Symbol(x) op=[#21] right=[Symbol(y)]
  21 | Operator symbol='<='
  22 | VarInitializer type=#23 assignment=#24
  23 | Type description='NUM'
  24 | Assignment target=Symbol(z) source=#25
  25 | BinaryExpression left=Symbol(y) op=[#26] right=[Symbol(x)]
  26 | Operator symbol='MOD'
  27 | Conditional ifStatement=#28 elseIfStatements=[] elseStatement=[]
  28 | ConditionalIF exp=#29 body=[#33,#35]
  29 | BinaryExpression left=Symbol(z) op=[#30] right=[#31]
  30 | Operator symbol='=='
  31 | Literal value='0' type=#32
  32 | Type description='NUM'
  33 | Assignment target=#34 source=Symbol(x)
  34 | ArrayAccess arrayVar=Symbol(results) indexExp=Symbol(count)
  35 | PostfixExpression operand=Symbol(count) op=#36
  36 | Operator symbol='++'
  37 | PostfixExpression operand=Symbol(x) op=#38
  38 | Operator symbol='++'
  39 | PrintStatement argument=Symbol(results)
  40 | FunCall callee=Symbol(factors) parameters=[#41]
  41 | Literal value='250' type=#42
  42 | Type description='NUM'`

describe("Parsing Example AST", () => {
  it("Successfuly Built Expected AST for example1.ags", () => {
    assert.deepStrictEqual(util.format(parse(ex1)), ex1AST)
  })
})

describe("Parsing Example Programs", () => {
  for (const { name, code } of examples) {
    it(`Parse ${name}`, () => {
      assert(parse(code))
    })
  }
})

describe("Syntax Checks", () => {
  for (const [scenario, source] of syntaxChecks) {
    const formatted = classOpen + funcOpen + source + close + close
    it(`recognizes that ${scenario}`, () => {
      assert(parse(formatted))
    })
  }
})

describe("Syntax Errors", () => {
  for (const [scenario, source, errorMessagePattern] of syntaxErrors) {
    const formatted = classOpen + funcOpen + source + close + close
    it(`throws on ${scenario}`, () => {
      assert.throws(() => parse(formatted), errorMessagePattern)
    })
  }
})
