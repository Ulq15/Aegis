import assert from "assert"
import util from "util"
import parse from "../src/parser.js"
import analyze from "../src/analyzer.js"
import fs from "fs"

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

const source = fs.readFileSync(location + "7.ags").toString()

const expectedAst = String.raw`   1 | Program id='Example7' classBody=[#2,#21,#33]
   2 | FunDec id='fibonacci' parameters=[#3] returnType=['NUM'] body=[#5]
   3 | Param variable=#4
   4 | Variable id='n' type='NUM'
   5 | Conditional ifStatement=#6 elseIfStatements=[#9] elseStatement=[#14]
   6 | ConditionalIF exp=#7 body=[#8]
   7 | BinaryExpression left=#4 op=['=='] right=['0']
   8 | ReturnStatement expression='0'
   9 | ConditionalELSEIF exp=#10 body=[#13]
  10 | BinaryExpression left=#11 op=['|'] right=[#12]
  11 | BinaryExpression left=#4 op=['=='] right=['1']
  12 | BinaryExpression left=#4 op=['=='] right=['2']
  13 | ReturnStatement expression='1'
  14 | ConditionalELSE body=[#15]
  15 | ReturnStatement expression=#16
  16 | BinaryExpression left=#17 op=['+'] right=[#19]
  17 | FunCall id='fibonacci' parameters=[#18] function=#2
  18 | BinaryExpression left=#4 op=['-'] right=['1']
  19 | FunCall id='fibonacci' parameters=[#20] function=#2
  20 | BinaryExpression left=#4 op=['-'] right=['2']
  21 | FunDec id='main' parameters=[] returnType=[] body=[#22,#24,#26,#32]
  22 | VarInitializer variable=#23 source='""'
  23 | Variable id='fibList' type='CHARS'
  24 | VarInitializer variable=#25 source='0'
  25 | Variable id='i' type='NUM'
  26 | Loop condition=#27 body=[#28,#31]
  27 | BinaryExpression left=#25 op=['<'] right=[#4]
  28 | Assignment target=#23 source=#29
  29 | BinaryExpression left=#23 op=['+','+'] right=[#30,'" "']
  30 | FunCall id='fibonacci' parameters=[#25] function=#2
  31 | PostfixExpression operand=#25 op='++'
  32 | PrintStatement argument=#23
  33 | FunCall id='main' parameters=[] function=#21`

const errorFixture = [
  ["using undeclared ids", "id + 1;", /Identifier id not declared/],
  ["redeclared ids", "NUM x = 1;\nNUM x = 1;", /Identifier x already declared/],
  ["calling nondeclared functions", "NUM x = fibonacci(13);", /Function Identifier fibonacci not declared/],
  ["redeclaring functions", "END\ntestMethod():", /Function Identifier testMethod already declared/]
]

const syntaxChecks = [
  ["all numeric literal forms", "OUTPUT( 8 * 89.123 );"],
  ["complex expressions", "OUTPUT ( 83 * ((((((((-13 / 21)))))))) + 1 ** 2  - -0);"],
  ["single line comment", "OUTPUT( 0 ); ## this is a comment"],
  ["comments with no text", 'OUTPUT("SomeString");##OUTPUT(TRUE);##'],
  ["non-Latin letters in identifiers", "NUM コンパイラ = 100;"],
  ["variable prefix increment", "NUM x = 0;\nNUM y = ++x;"],
  ["logical negate", "BOOL x; OUTPUT(!x);"],
  ["array literal assignment", "NUM{} arr = {1,2,3,4,5};"],
  ["dictionary get", "[NUM][CHARS] dic;\ndic GET[1];"],
  ["Do loop with internal assignment", "NUM i; DO(i = 0, i < 10, i++): OUTPUT(i); END"],
  ["dictionary add", '[NUM][CHARS] dic;\n dic ADD[0]["SomeValue"];'],
  ["dictionary declare", "[NUM][BOOL] dictionary;"]
]

function format(test) {
  return classOpen + funcOpen + test + close + close
}

describe("The Analyzer", () => {
  it("Can Analyze all the nodes", done => {
    assert.deepStrictEqual(util.format(analyze(parse(source))), expectedAst)
    done()
  })
  for (const { name, code } of examples) {
    it(`Analyze ${name}`, () => {
      assert(analyze(parse(code)))
    })
  }
  for (const [scenario, source] of syntaxChecks) {
    it(`recognizes that ${scenario}`, () => {
      assert(analyze(parse(format(source))))
    })
  }
  for (const [scenario, source, errorMessagePattern] of errorFixture) {
    it(`throws on ${scenario}`, done => {
      assert.throws(() => analyze(parse(format(source))), errorMessagePattern)
      done()
    })
  }
})
