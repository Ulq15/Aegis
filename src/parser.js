import ohm from "ohm-js"
import * as ast from "./ast.js"
import fs from "fs"

const aegisGrammar = ohm.grammar(
  fs.readFileSync("./fragments/Aegis.ohm").toString()
)

export default function parse(sourceCode) {
  const match = aegisGrammar.match(sourceCode)
  if (!match.succeeded()) {
    throw new Error(match.message)
  }
  return match.succeeded()
}

const astBuilder = aegisGrammar.createSemantics().addOperation("ast", {
  
})
