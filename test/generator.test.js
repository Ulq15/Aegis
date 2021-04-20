import assert from "assert"
import parse from "../src/parser.js"
import analyze from "../src/analyzer.js"
import generate from "../src/generator.js"

const open = "CLASS TestClass:\ntestMethod() VOID:\n"
const close = "\nEND\nEND"

function dedent(s) {
  return `${s}`.replace(/(?<=\n)\s+/g, "").trim()
}

const fixtures = [
  {
    name: "small",
    source: open+`NUM y = 3;\nNUM x = 3 * y;\nx++;\ny--;\nBOOL z = FALSE;\n`+
    `x = 3 * 3 + 2;\ny = -3 * 3 / 22 - 16;\nOUTPUT("Hello World");`+close,
    expected: `let y_1 = 3;\nlet x_2 = 3 * y_1;\nx_2++;\ny_1--;\n`+
      `let z_3 = false;\nx_2 = ((3 * 3) + 2);\ny_1 = ((((-3) * 3) / 22) - 16);\n`+
      `console.log("Hello World");`
    
  },
  {
    name: "single function",
    source: `CLASS ClassDeclaration:\nfunctionDeclaration()VOID:\nOUTPUT("Hello World");\nEND\nEND`,
    expected: `let functionDeclaration_1 = () => {\n  console.log("Hello World");\n}`
  }
]

describe("The code generator", () => {
  for (const fixture of fixtures) {
    it(`produces expected js output for the ${fixture.name} program`, () => {
      const actual = generate(analyze(parse(fixture.source)))
      assert.deepEqual(actual, fixture.expected)
    })
  }
})
