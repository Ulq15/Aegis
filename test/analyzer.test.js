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
const funcOpen = "testMethod()VOID:\n"
const close = "\nEND"

const source = fs.readFileSync(location + "7.ags").toString()

const expectedAst = String.raw`   1 | Program id='Example7' classBody=[#2,#22,#38]
   2 | FunDec id='fibonacci' parameters=[#3] returnType=#4 body=[#5]
   3 | Variable id='n' type=#4
   4 | Type description='NUM'
   5 | Conditional ifStatement=#6 elseIfStatements=[#10] elseStatement=[#15]
   6 | ConditionalIF exp=#7 body=[#9]
   7 | BinaryExpression left=#3 op=['=='] right=['0'] type=#8
   8 | Type description='BOOL'
   9 | ReturnStatement expression='0'
  10 | ConditionalELSEIF exp=#11 body=[#14]
  11 | BinaryExpression left=#12 op=['|'] right=[#13] type=#8
  12 | BinaryExpression left=#3 op=['=='] right=['1'] type=#8
  13 | BinaryExpression left=#3 op=['=='] right=['2'] type=#8
  14 | ReturnStatement expression='1'
  15 | ConditionalELSE body=[#16]
  16 | ReturnStatement expression=#17
  17 | BinaryExpression left=#18 op=['+'] right=[#20] type=#4
  18 | FunCall callee=#2 parameters=[#19] type=#4
  19 | BinaryExpression left=#3 op=['-'] right=['1'] type=#4
  20 | FunCall callee=#2 parameters=[#21] type=#4
  21 | BinaryExpression left=#3 op=['-'] right=['2'] type=#4
  22 | FunDec id='main' parameters=[] returnType=#23 body=[#24,#27,#29,#37]
  23 | Type description='VOID'
  24 | VarInitializer target=#25 source='""'
  25 | Variable id='fibList' type=#26
  26 | Type description='CHARS'
  27 | VarInitializer target=#28 source='0'
  28 | Variable id='i' type=#4
  29 | Loop condition=#30 body=[#33,#36]
  30 | BinaryExpression left=#31 op=['&'] right=[#32] type=#8
  31 | BinaryExpression left=#28 op=['<'] right=[#3] type=#8
  32 | BinaryExpression left=#28 op=['!='] right=[#3] type=#8
  33 | Assignment target=#25 source=#34
  34 | BinaryExpression left=#25 op=['+','+'] right=[#35,'" "'] type=#26
  35 | FunCall callee=#2 parameters=[#28] type=#4
  36 | PostfixExpression operand=#28 op='++'
  37 | PrintStatement argument=#25
  38 | FunCall callee=#22 parameters=[] type=#23`

const errorFixture = [
  ["using undeclared ids", "id + 1;", /Identifier id not declared/],
  ["redeclared ids", "NUM x = 1;\nNUM x = 1;", /Identifier x already declared/],
  ["calling nondeclared functions", "NUM x = fibonacci(13);", /Identifier fibonacci not declared/],
  ["redeclaring functions", "END\ntestMethod()VOID:", /Identifier testMethod already declared/]
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
  //["dictionary get", "[NUM][CHARS] dic;\ndic GET[1];"],
  //["Do loop with internal assignment", "NUM i;\nDO(i = 0, i < 10, i++):\nOUTPUT(i);\nEND"],
  //["dictionary add", '[NUM][CHARS] dic;\n dic ADD[0]["SomeValue"];'],
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
