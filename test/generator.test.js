import assert from "assert"
import parse from "../src/parser.js"
import analyze from "../src/analyzer.js"
import generate from "../src/generator.js"
import fs from "fs"

const openAegisClass = `CLASS TestClass:\n`
const openAegisFunc = openAegisClass + `testMethod() VOID:\n`
const closeAegis = `\nEND\nEND`

const convertToJS = code => {
  return `let testMethod_1 = () => {\n${code}\n}`
}

const examples = []
const location = "./examples/example"
for (let index = 1; index <= 8; index++) {
  const example = location + index + ".ags"
  const code = fs.readFileSync(example).toString()
  examples.push({ name: example, code: code })
}

const fixtures = [
  {
    name: "Var declaration then initilize",
    source: `${openAegisFunc}NUM x;\nDO(x = 0, x < 10, x++):\nOUTPUT(x);\nEND${closeAegis}`,
    expected: convertToJS(`let x_2;\nfor(x_2 = 0; x_2 < 10 ; x_2++) {\nconsole.log(x_2);\n}`)
  },
  {
    name: "Function with params to JS function",
    source: `${openAegisClass}isEven(NUM x) BOOL: RETURN (x MOD 2) == 0; ${closeAegis}`,
    expected: `let isEven_1 = (x_2) => {\nreturn x_2 % 2  == 0 ;\n}`
  },
  {
    name: "Conditional to JS",
    source:
      `${openAegisFunc}NUM x = 10;\nIF(x <= 5):\n` +
      `OUTPUT(\"Less than 5\");\nELSEIF(x > 5 & x < 10):\nOUTPUT(\"Between 6 and 9\");` +
      `\nELSE:\nOUTPUT(\"Greater or equal to 10\");\nEND${closeAegis}`,
    expected: convertToJS(
      `let x_2 = 10;\nif(x_2 <= 5 ) {\nconsole.log(\"Less than 5\");\n}` +
        `\nelse if(x_2 > 5  && x_2 < 10  ) {\nconsole.log(\"Between 6 and 9\");\n}` +
        `\nelse {\nconsole.log(\"Greater or equal to 10\");\n}`
    )
  },
  {
    name: "LOOP to JS while loop",
    source:
      `${openAegisFunc}BOOL testCase = TRUE;\nNUM count = 0;\nLOOP(testCase):\nIF(testCase != FALSE):\n` +
      `testCase = FALSE;\n++count;\nEND\nEND${closeAegis}`,
    expected: convertToJS(
      `let testCase_2 = true;\nlet count_3 = 0;\nwhile (testCase_2) {\n` +
        `if(testCase_2 != false ) {\ntestCase_2 = false;\n++count_3;\n}\n}`
    )
  },
  {
    name: "DOLoop to JS for loop",
    source: `${openAegisFunc}DO(NUM i = 0, i<10, ++i):\nOUTPUT(i);\nEND${closeAegis}`,
    expected: convertToJS("for(let i_2 = 0; i_2 < 10 ; ++i_2) {\nconsole.log(i_2);\n}")
  },
  {
    name: "CHARS literal to JS",
    source: `${openAegisFunc}CHARS str = "SomeString";${closeAegis}`,
    expected: convertToJS(`let str_2 = \"SomeString\";`)
  },
  {
    name: "NUM lietral to JS",
    source: `${openAegisFunc}NUM x = 10;${closeAegis}`,
    expected: convertToJS(`let x_2 = 10;`)
  },
  {
    name: 'print "Hello World"',
    source: `${openAegisFunc}OUTPUT("Hello World");${closeAegis}`,
    expected: convertToJS('console.log("Hello World");')
  }
]

function dedent(s) {
  return `${s}`.replace(/(?<=\n)\s+/g, "").trim()
}

describe("The Examples Generator", () => {
  for (const example of examples) {
    it(`generated JavaScript code from ${example.name}`, () => {
      assert(generate(analyze(parse(example.code))))
    })
  }
})
describe("The Generator", () => {
  for (const fixture of fixtures) {
    it(`produces expected js output for the ${fixture.name}`, () => {
      const actual = dedent(generate(analyze(parse(fixture.source))))
      assert.strictEqual(actual, fixture.expected)
    })
  }
})
