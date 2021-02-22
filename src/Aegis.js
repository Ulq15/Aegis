import fs from "fs/promises"
import process from "process"
import compile from "./compiler.js"

const help = `Ael compiler

Syntax: src/ael.js <filename>

Prints to stdout
`

async function compileFromFile(filename) {
    try {
        const buffer = await fs.readFile(filename)
        console.log(compile(buffer.toString()))
    } catch (e) {
        console.error(`${e}`)
        process.exitCode = 1
    }
}
if (process.argv.length !== 3) {
    console.log(help)
} else {
    compileFromFile(process.argv[2])
}