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

const expectedAst = String.raw`   1 | Program id='Example7' classBody=[#2,#20,#34]
   2 | FunDec id='fibonacci' parameters=[#3] returnType=['NUM'] body=[#4]
   3 | Variable id='n' type='NUM'
   4 | Conditional ifStatement=#5 elseIfStatements=[#8] elseStatement=[#13]
   5 | ConditionalIF exp=#6 body=[#7]
   6 | BinaryExpression left=#3 op=['=='] right=['0']
   7 | ReturnStatement expression='0'
   8 | ConditionalELSEIF exp=#9 body=[#12]
   9 | BinaryExpression left=#10 op=['|'] right=[#11]
  10 | BinaryExpression left=#3 op=['=='] right=['1']
  11 | BinaryExpression left=#3 op=['=='] right=['2']
  12 | ReturnStatement expression='1'
  13 | ConditionalELSE body=[#14]
  14 | ReturnStatement expression=#15
  15 | BinaryExpression left=#16 op=['+'] right=[#18]
  16 | FunCall callee=#2 parameters=[#17]
  17 | BinaryExpression left=#3 op=['-'] right=['1']
  18 | FunCall callee=#2 parameters=[#19]
  19 | BinaryExpression left=#3 op=['-'] right=['2']
  20 | FunDec id='main' parameters=[] returnType=[] body=[#21,#23,#25,#33]
  21 | VarInitializer target=#22 source='""'
  22 | Variable id='fibList' type='CHARS'
  23 | VarInitializer target=#24 source='0'
  24 | Variable id='i' type='NUM'
  25 | Loop condition=#26 body=[#29,#32]
  26 | BinaryExpression left=#27 op=['&'] right=[#28]
  27 | BinaryExpression left=#24 op=['<'] right=[#3]
  28 | BinaryExpression left=#24 op=['!='] right=[#3]
  29 | Assignment target=#22 source=#30
  30 | BinaryExpression left=#22 op=['+','+'] right=[#31,'" "']
  31 | FunCall callee=#2 parameters=[#24]
  32 | PostfixExpression operand=#24 op='++'
  33 | PrintStatement argument=#22
  34 | FunCall callee=#20 parameters=[]`

const errorFixture = [
  ["using undeclared ids", "id + 1;", /Identifier id not declared/],
  ["redeclared ids", "NUM x = 1;\nNUM x = 1;", /Identifier x already declared/],
  ["calling nondeclared functions", "NUM x = fibonacci(13);", /Identifier fibonacci not declared/],
  ["redeclaring functions", "END\ntestMethod():", /Identifier testMethod already declared/]
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
