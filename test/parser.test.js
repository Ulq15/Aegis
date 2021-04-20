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
const funcOpen = "testMethod():\n"
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

const ex1AST = `   1 | Program id=Symbol(Example1) classBody=[#2,#33]
   2 | FunDec id=Symbol(factors) parameters=[#3] returnType=[] body=[#5,#8,#11,#14,#32]
   3 | Variable id=Symbol(y) type=#4
   4 | Type description='NUM'
   5 | VarDec type=#6 id=Symbol(results)
   6 | ArrayType description='NUM{}' baseType=#7
   7 | Type description='NUM'
   8 | VarInitializer type=#9 assignment=#10
   9 | Type description='NUM'
  10 | Assignment target=Symbol(count) source='0'
  11 | VarInitializer type=#12 assignment=#13
  12 | Type description='NUM'
  13 | Assignment target=Symbol(x) source='1'
  14 | Loop condition=#15 body=[#17,#22,#30]
  15 | BinaryExpression left=Symbol(x) op=[#16] right=[Symbol(y)]
  16 | Operator op='<='
  17 | VarInitializer type=#18 assignment=#19
  18 | Type description='NUM'
  19 | Assignment target=Symbol(z) source=#20
  20 | BinaryExpression left=Symbol(y) op=[#21] right=[Symbol(x)]
  21 | Operator op='MOD'
  22 | Conditional ifStatement=#23 elseIfStatements=[] elseStatement=[]
  23 | ConditionalIF exp=#24 body=[#26,#28]
  24 | BinaryExpression left=Symbol(z) op=[#25] right=['0']
  25 | Operator op='=='
  26 | Assignment target=#27 source=Symbol(x)
  27 | ArrayAccess id=Symbol(results) indexExp=Symbol(count)
  28 | PostfixExpression operand=Symbol(count) op=#29
  29 | Operator op='++'
  30 | PostfixExpression operand=Symbol(x) op=#31
  31 | Operator op='++'
  32 | PrintStatement argument=Symbol(results)
  33 | FunCall callee=Symbol(factors) parameters=['250']`

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
