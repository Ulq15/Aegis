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
  ["dictionary declare", "[NUM][BOOL] dictionary;"]
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

const ex1AST = `   1 | Program id=Symbol(Example1) classBody=[#2,#34]
   2 | FunDec id=Symbol(factors) parameters=[#3] returnType=#5 body=[#6,#9,#12,#15,#33]
   3 | Variable id=Symbol(y) type=#4
   4 | Type description='NUM'
   5 | Type description='VOID'
   6 | VarDec type=#7 id=Symbol(results)
   7 | ArrayType description='NUM{}' baseType=#8
   8 | Type description='NUM'
   9 | VarInitializer type=#10 assignment=#11
  10 | Type description='NUM'
  11 | Assignment target=Symbol(count) source='0'
  12 | VarInitializer type=#13 assignment=#14
  13 | Type description='NUM'
  14 | Assignment target=Symbol(x) source='1'
  15 | Loop condition=#16 body=[#18,#23,#31]
  16 | BinaryExpression left=Symbol(x) op=[#17] right=[Symbol(y)]
  17 | Operator symbol='<='
  18 | VarInitializer type=#19 assignment=#20
  19 | Type description='NUM'
  20 | Assignment target=Symbol(z) source=#21
  21 | BinaryExpression left=Symbol(y) op=[#22] right=[Symbol(x)]
  22 | Operator symbol='MOD'
  23 | Conditional ifStatement=#24 elseIfStatements=[] elseStatement=[]
  24 | ConditionalIF exp=#25 body=[#27,#29]
  25 | BinaryExpression left=Symbol(z) op=[#26] right=['0']
  26 | Operator symbol='=='
  27 | Assignment target=#28 source=Symbol(x)
  28 | ArrayAccess arrayVar=Symbol(results) indexExp=Symbol(count)
  29 | PostfixExpression operand=Symbol(count) op=#30
  30 | Operator symbol='++'
  31 | PostfixExpression operand=Symbol(x) op=#32
  32 | Operator symbol='++'
  33 | PrintStatement argument=Symbol(results)
  34 | FunCall callee=Symbol(factors) parameters=['250']`

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
