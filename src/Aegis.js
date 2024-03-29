import fs from "fs/promises"
import process from "process"
import parse from "./parser.js"
import analyze from "./analyzer.js"
import generate from "./generator.js"
import optimize from "./optimizer.js"

const help = `Aegis compiler

Syntax: src/aegis.js <filename> <outputType>

Prints to stdout according to <outputType>, which must be one of:
  ast        prints a representation of of the abstract syntax tree
  analyzed   the semantically analyzed representation
  optimized  the optimized semantically analyzed representation
  js         the translation to JavaScript
`

function compile(source, outputType) {
  outputType = outputType.toLowerCase()
  if (outputType === "ast") {
    return parse(source)
  } else if (outputType === "analyzed") {
    return analyze(parse(source))
  } else if (outputType === "optimized") {
    return optimize(analyze(parse(source)))
  } else if (outputType === "js") {
    return generate(analyze(parse(source)))
  } else if(outputType === "jso"){
    return generate(optimize(analyze(parse(source))))
  } else {
    return "Unknown output type"
  }
}

async function compileFromFile(filename, outputType) {
  try {
    const buffer = await fs.readFile(filename)
    console.log(compile(buffer.toString(), outputType))
  } catch (e) {
    console.error(e)
    process.exitCode = 1
  }
}

if (process.argv.length !== 4) {
  console.log(help)
} else {
  compileFromFile(process.argv[2], process.argv[3])
}
