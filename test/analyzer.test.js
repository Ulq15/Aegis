import assert from "assert"
import util from "util"
import parse from "../src/parser.js"
import analyze from "../src/analyzer.js"
import fs from "fs"

const examples = []
const location = "./examples/example"
for (let index = 1; index <= 9; index++) {
  const example = location + index + ".ags"
  const code = fs.readFileSync(example).toString()
  examples.push({ name: example, code: code })
}

const classOpen = "CLASS TestClass:\n"
const funcOpen = "testMethod()VOID:\n"
const close = "\nEND"

const source = fs.readFileSync(location + "7.ags").toString()

const expectedAst = String.raw`   1 | Program id='Example7' classBody=[#2,#29,#46]
   2 | FunctionDeclaration id='fibonacci' parameters=[#3] returnType=#4 body=[#5]
   3 | Variable id='n' type=#4
   4 | Type description='NUM'
   5 | Conditional ifStatement=#6 elseIfStatements=[#12] elseStatement=[#20]
   6 | ConditionalIF exp=#7 body=[#10]
   7 | BinaryExpression left=#3 op=['=='] right=[#8] type=#9
   8 | Literal value=0n type=#4
   9 | Type description='BOOL'
  10 | ReturnStatement expression=#11
  11 | Literal value=0n type=#4
  12 | ConditionalELSEIF exp=#13 body=[#18]
  13 | BinaryExpression left=#14 op=['|'] right=[#16] type=#9
  14 | BinaryExpression left=#3 op=['=='] right=[#15] type=#9
  15 | Literal value=1n type=#4
  16 | BinaryExpression left=#3 op=['=='] right=[#17] type=#9
  17 | Literal value=2n type=#4
  18 | ReturnStatement expression=#19
  19 | Literal value=1n type=#4
  20 | ConditionalELSE body=[#21]
  21 | ReturnStatement expression=#22
  22 | BinaryExpression left=#23 op=['+'] right=[#26] type=#4
  23 | FunctionCall callee=#2 parameters=[#24] type=#4
  24 | BinaryExpression left=#3 op=['-'] right=[#25] type=#4
  25 | Literal value=1n type=#4
  26 | FunctionCall callee=#2 parameters=[#27] type=#4
  27 | BinaryExpression left=#3 op=['-'] right=[#28] type=#4
  28 | Literal value=2n type=#4
  29 | FunctionDeclaration id='main' parameters=[] returnType=#30 body=[#31,#34,#37,#45]
  30 | Type description='VOID'
  31 | VariableDeclaration variable=#32
  32 | Variable id='fibList' type=#33
  33 | ArrayType description='NUM{}' baseType=#4
  34 | VariableAssignment target=#35 source=#36
  35 | Variable id='i' type=#4
  36 | Literal value=0n type=#4
  37 | Loop condition=#38 body=[#41,#44]
  38 | BinaryExpression left=#39 op=['&'] right=[#40] type=#9
  39 | BinaryExpression left=#35 op=['<'] right=[#3] type=#9
  40 | BinaryExpression left=#35 op=['!='] right=[#3] type=#9
  41 | Assignment target=#42 source=#43
  42 | ArrayAccess arrayVar=#32 indexExp=#35 type=#4
  43 | FunctionCall callee=#2 parameters=[#35] type=#4
  44 | PostfixExpression operand=#35 op='++' type=#4
  45 | PrintStatement argument=#32
  46 | FunctionCall callee=#29 parameters=[] type=#30`

const semanticErrors = [
  ["using undeclared ids", "id + 1;", /Identifier id not declared/],
  ["redeclared ids", "NUM x = 1;\nNUM x = 1;", /Identifier x already declared/],
  ["calling nondeclared functions", "NUM x = fibonacci(13);", /Identifier fibonacci not declared/],
  ["redeclaring functions", "END\ntestMethod()VOID:", /Identifier testMethod already declared/],
  ["assigning a string to an integer variable", 'NUM x = "chars";', /Cannot assign a CHARS to a NUM/]
]

const semanticChecks = [
  ["all numeric literal forms", "OUTPUT( 8 * 89.123 );"],
  ["complex expressions", "OUTPUT ( 83 * ((((((((-13 / 21)))))))) + 1 ** 2  - -0);"],
  ["single line comment", "OUTPUT( 0 ); ## this is a comment"],
  ["comments with no text", 'OUTPUT("SomeString");##OUTPUT(TRUE);##'],
  ["non-Latin letters in identifiers", "NUM コンパイラ = 100;"],
  ["variable prefix increment", "NUM pre = 0;\nNUM y = ++pre;"],
  ["variable postfix decrement", "NUM post = 0;\nNUM y = post--;"],
  ["logical negate", "BOOL x=TRUE; OUTPUT(!x);"],
  ["array literal assignment", "NUM{} arr = {1,2,3,4,5};"],
  ["Do loop with internal assignment", "NUM i;\nDO(i = 0, i < 10, i++):\nOUTPUT(i);\nEND"],
  ["dictionary add", '[NUM][CHARS] dic;\n dic ADD[0]["SomeValue"];'],
  ["dictionary declare", "[NUM][BOOL] dictionary;"],
  ["dictionary get", `[NUM][CHARS] dic;\ndic ADD[1]["SomeValue"];\nOUTPUT(dic GET[1] == "SomeValue");`]
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

describe("The Analyzer", () => {
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
  for (const [scenario, source, errorMessagePattern] of semanticErrors) {
    it(`Throws on ${scenario}`, done => {
      //console.log(analyze(parse(format(source))))
      assert.throws(() => analyze(parse(format(source))), errorMessagePattern)
      done()
    })
  }
})
