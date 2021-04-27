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

const expectedAst = String.raw`   1 | Program id='Example7' classBody=[#2,#29,#48]
   2 | FunDec id='fibonacci' parameters=[#3] returnType=#4 body=[#5]
   3 | Variable id='n' type=#4
   4 | Type description='NUM'
   5 | Conditional ifStatement=#6 elseIfStatements=[#12] elseStatement=[#20]
   6 | ConditionalIF exp=#7 body=[#10]
   7 | BinaryExpression left=#3 op=['=='] right=[#8] type=#9
   8 | Literal value='0' type=#4
   9 | Type description='BOOL'
  10 | ReturnStatement expression=#11
  11 | Literal value='0' type=#4
  12 | ConditionalELSEIF exp=#13 body=[#18]
  13 | BinaryExpression left=#14 op=['|'] right=[#16] type=#9
  14 | BinaryExpression left=#3 op=['=='] right=[#15] type=#9
  15 | Literal value='1' type=#4
  16 | BinaryExpression left=#3 op=['=='] right=[#17] type=#9
  17 | Literal value='2' type=#4
  18 | ReturnStatement expression=#19
  19 | Literal value='1' type=#4
  20 | ConditionalELSE body=[#21]
  21 | ReturnStatement expression=#22
  22 | BinaryExpression left=#23 op=['+'] right=[#26] type=#4
  23 | FunCall callee=#2 parameters=[#24] type=#4
  24 | BinaryExpression left=#3 op=['-'] right=[#25] type=#4
  25 | Literal value='1' type=#4
  26 | FunCall callee=#2 parameters=[#27] type=#4
  27 | BinaryExpression left=#3 op=['-'] right=[#28] type=#4
  28 | Literal value='2' type=#4
  29 | FunDec id='main' parameters=[] returnType=#30 body=[#31,#35,#38,#47]
  30 | Type description='VOID'
  31 | VarInitializer target=#32 source=#34
  32 | Variable id='fibList' type=#33
  33 | Type description='CHARS'
  34 | Literal value='' type=#33
  35 | VarInitializer target=#36 source=#37
  36 | Variable id='i' type=#4
  37 | Literal value='0' type=#4
  38 | Loop condition=#39 body=[#42,#46]
  39 | BinaryExpression left=#40 op=['&'] right=[#41] type=#9
  40 | BinaryExpression left=#36 op=['<'] right=[#3] type=#9
  41 | BinaryExpression left=#36 op=['!='] right=[#3] type=#9
  42 | Assignment target=#32 source=#43
  43 | BinaryExpression left=#32 op=['+','+'] right=[#44,#45] type=#33
  44 | FunCall callee=#2 parameters=[#36] type=#4
  45 | Literal value=' ' type=#33
  46 | PostfixExpression operand=#36 op='++'
  47 | PrintStatement argument=#32
  48 | FunCall callee=#29 parameters=[] type=#30`

const semanticErrors  = [
  ["using undeclared ids", "id + 1;", /Identifier id not declared/],
  ["redeclared ids", "NUM x = 1;\nNUM x = 1;", /Identifier x already declared/],
  ["calling nondeclared functions", "NUM x = fibonacci(13);", /Identifier fibonacci not declared/],
  ["redeclaring functions", "END\ntestMethod()VOID:", /Identifier testMethod already declared/]
]

const semanticChecks = [
  ["all numeric literal forms", "OUTPUT( 8 * 89.123 );"],
  ["complex expressions", "OUTPUT ( 83 * ((((((((-13 / 21)))))))) + 1 ** 2  - -0);"],
  ["single line comment", "OUTPUT( 0 ); ## this is a comment"],
  ["comments with no text", 'OUTPUT("SomeString");##OUTPUT(TRUE);##'],
  ["non-Latin letters in identifiers", "NUM コンパイラ = 100;"],
  ["variable prefix increment", "NUM x = 0;\nNUM y = ++x;"],
  ["logical negate", "BOOL x=TRUE; OUTPUT(!x);"],
  ["array literal assignment", "NUM{} arr = {1,2,3,4,5};"],
  ["dictionary get", "[NUM][CHARS] dic;\ndic GET[1];"],
  ["Do loop with internal assignment", "NUM i;\nDO(i = 0, i < 10, i++):\nOUTPUT(i);\nEND"],
  ["dictionary add", '[NUM][CHARS] dic;\n dic ADD[0]["SomeValue"];'],
  ["dictionary declare", "[NUM][BOOL] dictionary;"]
]

function format(test) {
  return classOpen + funcOpen + test + close + close
}

describe("The Analyzer", () => {
  it("Can Analyze all the nodes of Example7.ags as expected", done => {
    assert.deepStrictEqual(util.format(analyze(parse(source))), expectedAst)
    done()
  })
})

describe("Tha Analyzer", () => {
  for (const { name, code } of examples) {
    it(`Can analyze ${name}`, () => {
      assert(analyze(parse(code)))
    })
  }
  for (const [scenario, source] of semanticChecks) {
    it(`Can recognize that ${scenario}`, () => {
      assert(analyze(parse(format(source))))
    })
  }
  for (const [scenario, source, errorMessagePattern] of semanticErrors ) {
    it(`Throws on ${scenario}`, done => {
      assert.throws(() => analyze(parse(format(source))), errorMessagePattern)
      done()
    })
  }
})
