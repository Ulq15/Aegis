import assert from "assert"
import parse from "../src/parser.js"
import fs from "fs"
import util from "util"

const examples = []
const location = "./examples/example"
for (let index = 1; index <= 7; index++) {
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
  ["dictionary add", "dictionary ADD[\"SomeKey\"][\"SomeValue\"];"],
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

const ex1 = fs.readFileSync(location+"1.ags").toString()

const ex1AST = `   1 | Program id=#2 classBody=[#3,#40]
   2 | IdExp name='Example1'
   3 | FunDec id=#4 parameters=[#5] returnType=[] body=[#7,#9,#12,#15,#38]
   4 | IdExp name='factors'
   5 | Param type='NUM' id=#6
   6 | IdExp name='y'
   7 | VarDec type='NUM {}' id=#8
   8 | IdExp name='results'
   9 | VarInitializer type='NUM' assignment=#10
  10 | Assignment target=#11 source='0'
  11 | IdExp name='count'
  12 | VarInitializer type='NUM' assignment=#13
  13 | Assignment target=#14 source='1'
  14 | IdExp name='x'
  15 | Loop condition=#16 body=[#19,#25,#36]
  16 | BinaryExpression left=#17 op=['<='] right=[#18]
  17 | IdExp name='x'
  18 | IdExp name='y'
  19 | VarInitializer type='NUM' assignment=#20
  20 | Assignment target=#21 source=#22
  21 | IdExp name='z'
  22 | BinaryExpression left=#23 op=['MOD'] right=[#24]
  23 | IdExp name='y'
  24 | IdExp name='x'
  25 | Conditional ifStatement=#26 elseIfStatements=[] elseStatement=[]
  26 | ConditionalIF exp=#27 body=[#29,#34]
  27 | BinaryExpression left=#28 op=['=='] right=['0']
  28 | IdExp name='z'
  29 | Assignment target=#30 source=#33
  30 | ArrayVar id=#31 indexExp=#32
  31 | IdExp name='results'
  32 | IdExp name='count'
  33 | IdExp name='x'
  34 | PostfixExpression operand=#35 op='++'
  35 | IdExp name='count'
  36 | PostfixExpression operand=#37 op='++'
  37 | IdExp name='x'
  38 | PrintStatement argument=#39
  39 | IdExp name='results'
  40 | FunCall id=#41 parameters=['250']
  41 | IdExp name='factors'`

describe("Parsing Example AST", () => {
  it("Successfuly Built Expected AST for example1.ags", ()=>{
    assert.deepStrictEqual(util.format(parse(ex1)), ex1AST)
  })
})

describe("Parsing Example Programs", () => {
  for (const {name, code} of examples) {
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
