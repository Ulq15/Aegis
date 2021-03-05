import assert from "assert"
import parse from "../src/parser.js"
import fs from "fs"
import util from "util"

var examples = []
const location = "./examples/example"
for(var index = 1; index <= 7; index++){
  const example = location + index + ".ags"
  const code = fs.readFileSync(example).toString()
  examples.push({"name": example, "code": code})
}

const classOpen = "CLASS TestClass:\n"
const funcOpen = "testMethod():\n"
const close = "\nEND"

const syntaxChecks = [
  ["all numeric literal forms", "OUTPUT( 8 * 89.123 );"],
  ["complex expressions", "OUTPUT ( 83 * ((((((((-13 / 21)))))))) + 1 ** 2  - -0);"],
  ["single line comment", "OUTPUT( 0 ); ## this is a comment"],
  ["comments with no text", "OUTPUT(\"SomeString\");##\OUTPUT(TRUE);##"],
  ["non-Latin letters in identifiers", "NUM コンパイラ = 100;"],
  ["variable prefix increment", "NUM x = ++y;"],
  ["logical negate", "BOOL x = TRUE; RETURN(!x != TRUE);"],
  ["array literal assignment", "NUM{} arr = {1,2,3,4,5};"],
  ["dictionary get", "dictionary GET[1];"],
  ["Do loop with internal assignment", "NUM i; DO(i = 0, i < 10, i++): OUTPUT(i); END"],
  ["dictionary add", "dictionary ADD[\"SomeKey\"][\"SomeValue\"];"]
]

const syntaxErrors = [
  ["non-letter in an identifier", "NUM ab😭c = 2;", /Line 3, col 7:/],
  ["malformed number", "NUM x= 2. ;", /Line 3, col 10:/],
  ["a missing right operand", "OUTPUT(5 -);", /Line 3, col 11:/],
  ["a non-operator", "OUTPUT(7 * ((2 _ 3))", /Line 3, col 16:/],
  ["an expression starting with a )", "OUTPUT )", /Line 3, col 8:/],
  ["a statement starting with a )", ") * 5;", /Line 3, col 1:/],
  ["an expression starting with a *", "NUM x = * 71;", /Line 3, col 9:/],
]

const ex1 = fs.readFileSync(location+"1.ags").toString()

  const ex1AST = `   1 | Program id='Example1' programBody=[#2,#22]
   2 | FunDec name='factors' parameters=[#3] returnType=[] body=[#4,#5,#7,#9,#21]
   3 | Param type='NUM' name='y'
   4 | VarDec type='NUM {}' name='results'
   5 | VarInitializer type='NUM' assignment=#6
   6 | Assignment target='count' source='0'
   7 | VarInitializer type='NUM' assignment=#8
   8 | Assignment target='x' source='1'
   9 | Loop condition=#10 body=[#11,#14,#20]
  10 | BinaryExpression left='x' op=['<='] right=['y']
  11 | VarInitializer type='NUM' assignment=#12
  12 | Assignment target='z' source=#13
  13 | BinaryExpression left='y' op=['MOD'] right=['x']
  14 | Conditional ifStatement=#15 elseIfStatements=[] elseStatement=[]
  15 | ConditionalIF exp=#16 body=[#17,#19]
  16 | BinaryExpression left='z' op=['=='] right=['0']
  17 | Assignment target=#18 source='x'
  18 | ArrayVar baseName='results' indexExp='count'
  19 | PostfixExpression operand='count' op='++'
  20 | PostfixExpression operand='x' op='++'
  21 | PrintStatement argument='results'
  22 | FunCall name='factors' parameters=['250']`

describe("Example AST", () => {
  it("Successfuly Built Expected AST for example1.ags", ()=>{
    assert.deepStrictEqual(util.format(parse(ex1)), ex1AST)
  })
})

describe("Example Programs", () => {
  for(const { name, code } of examples){
    it(`Parse ${name}`, () =>{
      assert(parse(code))
    })
  }
})

describe("Syntax Checks", () => {
  for (const [scenario, source] of syntaxChecks) {
    const formatted =classOpen+funcOpen+source+close+close
    it(`recognizes that ${scenario}`, () => {
      assert(parse(formatted))
    })
  }
})

describe("Syntax Errors", () => {
  for (const [scenario, source, errorMessagePattern] of syntaxErrors) {
    const formatted =classOpen+funcOpen+source+close+close
    it(`throws on ${scenario}`, () => {
      assert.throws(() => parse(formatted), errorMessagePattern)
    })
  }
})
