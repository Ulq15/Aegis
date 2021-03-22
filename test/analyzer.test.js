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
  examples.push({"name": example, "code": code})
}

const classOpen = "CLASS TestClass:\n"
const funcOpen = "testMethod():\n"
const close = "\nEND"

const source =  fs.readFileSync(location+"7.ags").toString()

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
  17 | FunCall id='fibonacci' function=#2 parameters=[#18]
  18 | BinaryExpression left=#4 op=['-'] right=['1']
  19 | FunCall id='fibonacci' function=#2 parameters=[#20]
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
  30 | FunCall id='fibonacci' function=#2 parameters=[#25]
  31 | PostfixExpression operand=#25 op='++'
  32 | PrintStatement argument=#23
  33 | FunCall id='main' function=#21 parameters=[]`

const errorFixture = [
  ["redeclarations", "OUTPUT( x );", /Identifier x not declared/],
  ["non declared ids", "NUM x = 1;\nNUM x = 1;", /Identifier x already declared/],
  ["calling nondeclared functions", "NUM x = fibonacci(13);", /Function Identifier fibonacci not declared/],
  ["redeclaring functions", "END\ntestMethod():", /Function Identifier testMethod already declared/]
]

function format(test){
  return classOpen+funcOpen+test+close+close
}

describe("The Analyzer", () => {
  it("can analyze all the nodes", done => {
    assert.deepStrictEqual(util.format(analyze(parse(source))), expectedAst)
    done()
  })
  for (const {name, code} of examples) {
    it(`Analyze ${name}`, () =>{
      assert(analyze(parse(code)))
    })
  }
  for (const [scenario, source, errorMessagePattern] of errorFixture) {
    it(`throws on ${scenario}`, done => {
      assert.throws(() => analyze(parse(format(source))), errorMessagePattern)
      done()
    })
  }
})
