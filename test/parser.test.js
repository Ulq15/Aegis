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

const ex1AST = `   1 | Program id=Example1 classBody=[#2,#35]
   2 | FunctionDeclaration id=factors parameters=[#3] returnType=#5 body=[#6,#9,#14,#19,#34]
   3 | Variable id=y type=#4
   4 | Type description='NUM'
   5 | Type description='VOID'
   6 | VariableDeclaration type=#7 id=results
   7 | ArrayType description='NUM{}' baseType=#8
   8 | Type description='NUM'
   9 | VariableAssignment type=#10 assignment=#11
  10 | Type description='NUM'
  11 | Assignment target=count source=#12
  12 | Literal value='0' type=#13
  13 | Type description='NUM'
  14 | VariableAssignment type=#15 assignment=#16
  15 | Type description='NUM'
  16 | Assignment target=x source=#17
  17 | Literal value='1' type=#18
  18 | Type description='NUM'
  19 | Loop condition=#20 body=[#21,#25,#33]
  20 | BinaryExpression left=x op=['<='] right=[y]
  21 | VariableAssignment type=#22 assignment=#23
  22 | Type description='NUM'
  23 | Assignment target=z source=#24
  24 | BinaryExpression left=y op=['MOD'] right=[x]
  25 | Conditional ifStatement=#26 elseIfStatements=[] elseStatement=[]
  26 | ConditionalIF exp=#27 body=[#30,#32]
  27 | BinaryExpression left=z op=['=='] right=[#28]
  28 | Literal value='0' type=#29
  29 | Type description='NUM'
  30 | Assignment target=#31 source=x
  31 | ArrayAccess arrayVar=results indexExp=count
  32 | PostfixExpression operand=count op='++'
  33 | PostfixExpression operand=x op='++'
  34 | PrintStatement argument=results
  35 | FunctionCall callee=factors parameters=[#36]
  36 | Literal value='250' type=#37
  37 | Type description='NUM'`

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
