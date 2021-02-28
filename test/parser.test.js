import assert from "assert"
import parse from "../src/parser.js"
import fs from "fs"

var examples = []
const location = "./examples/example"
for(var index = 1; index <= 6; index++){
  const example = location + index + ".ags"
  const code = fs.readFileSync(example).toString()
  examples.push({"name": example, "code": code})
}

const classOpen = "CLASS TestClass:\n"
const funcOpen = "testMethod():\n"
const close = "\nEND"

const syntaxChecks = [
  ["all numeric literal forms", "OUTPUT( 8 * 89.123 );"],
  ["complex expressions", "OUTPUT ( 83 * ((((((((-13 / 21)))))))) + 1 - -0);"],
  ["single line comment", "OUTPUT( 0 ); ## this is a comment"],
  ["comments with no text", "OUTPUT(\"SomeString\");##\OUTPUT(TRUE);##"],
  ["non-Latin letters in identifiers", "NUM コンパイラ = 100;"]
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
