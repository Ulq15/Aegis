// Code generator from Aegis to JavaScript
// Call the generate(program) function with a program's root node to
// get a JS translation as a String

const makeTabs = (num, line) => {
  let tabs = ""
  for (let i = 0; i < num; i++) {
    tabs += "  "
  }
  line = tabs + line
  return line
}

const translateOperator = operator => {
  if (operator === "MOD") {
    return "%"
  } else if (operator === "&") {
    return "&&"
  } else if (operator === "|") {
    return "||"
  } else {
    return operator
  }
}

export default function generate(program) {
  const output = []

  const gen = node => generators[node.constructor.name](node)

  const targetName = (mapping => {
    return entity => {
      if (!mapping.has(entity)) {
        mapping.set(entity, mapping.size + 1)
      }
      //NextLine => should it be `${entity.description ?? entity}... or `${entity.id.description ?? entity.id}...
      return `${entity.id.description ?? entity.id}_${mapping.get(entity)}`
    }
  })(new Map())

  let inLine = false
  const generators = {
    tabNum: 0,
    Program(node) {
      node.classBody.map(body => gen(body))
    },
    FunDec(node) {
      let line = `let ${targetName(node)} = (${node.parameters.map(params => gen(params))}) => {`
      output.push(makeTabs(this.tabNum, line))
      this.tabNum++
      node.body.map(statement => gen(statement))
      this.tabNum--
      output.push(makeTabs(this.tabNum, "}"))
    },
    FunCall(node) {
      let line = `${targetName(node.callee)}(${node.parameters.map(param => gen(param)).join(", ")})`
      if (inLine) {
        return line
      } else {
        output.push(makeTabs(this.tabNum, line + ";"))
      }
    },
    VarInitializer(node) {
      if (inLine) {
        return `let ${gen(node.target)} = ${gen(node.source)}`
      } else {
        let prev = inLine
        inLine = true
        output.push(makeTabs(this.tabNum, `let ${gen(node.target)} = ${gen(node.source)};`))
        inLine = prev
      }
    },
    VarDec(node) {
      output.push(makeTabs(this.tabNum, `let ${gen(node.variable)};`))
    },
    ReturnStatement(node) {
      let prev = inLine
      inLine = true
      let exp = gen(node.expression)
      inLine = prev
      output.push(makeTabs(this.tabNum, `return ${exp};`))
    },
    PrintStatement(node) {
      let prev = inLine
      inLine = true
      let exp = gen(node.argument)
      inLine = prev
      output.push(makeTabs(this.tabNum, `console.log(${exp});`))
    },
    BinaryExpression(node) {
      let line = `${gen(node.left)} `
      let prevInLine = inLine
      inLine = true
      for (let index = 0; index < node.op.length; index++) {
        line += `${translateOperator(node.op[index])} ${gen(node.right[index])} `
      }
      inLine = prevInLine
      return line
    },
    PrefixExpression(node) {
      let line = `${node.op}${gen(node.operand)}`
      if (inLine) {
        return line
      } else {
        output.push(makeTabs(this.tabNum, line + ";"))
      }
    },
    PostfixExpression(node) {
      let line = `${gen(node.operand)}${node.op}`
      if (inLine) {
        return line
      } else {
        output.push(makeTabs(this.tabNum, line + ";"))
      }
    },
    Assignment(node) {
      let line = `${gen(node.target)} = `
      if (inLine) {
        return line + `${gen(node.source)}`
      } else {
        output.push(makeTabs(this.tabNum, line + `${gen(node.source)};`))
      }
    },
    ArrayLiteral(node) {
      return `[${gen(node.list).join(", ")}]`
    },
    ArrayAccess(node) {
      return `${gen(node.arrayVar)}[${gen(node.indexExp)}]`
    },
    DictionaryAccess(node) {
      return `${targetName(node.dictionaryVar)}.${gen(node.key)}`
    },
    Conditional(node) {
      gen(node.ifStatement)
      node.elseIfStatements.map(block => gen(block))
      node.elseStatement.map(block => gen(block))
    },
    ConditionalIF(node) {
      output.push(makeTabs(this.tabNum, `if(${gen(node.exp)}) {`))
      this.tabNum++
      node.body.map(stmnt => gen(stmnt))
      this.tabNum--
      output.push(makeTabs(this.tabNum, "}"))
    },
    ConditionalELSEIF(node) {
      output.push(makeTabs(this.tabNum, `else if(${gen(node.exp)}) {`))
      this.tabNum++
      node.body.map(stmnt => gen(stmnt))
      this.tabNum--
      output.push(makeTabs(this.tabNum, "}"))
    },
    ConditionalELSE(node) {
      output.push(makeTabs(this.tabNum, "else {"))
      this.tabNum++
      node.body.map(stmnt => gen(stmnt))
      this.tabNum--
      output.push(makeTabs(this.tabNum, "}"))
    },
    Loop(node) {
      output.push(makeTabs(this.tabNum, `while (${gen(node.condition)}) {`))
      this.tabNum++
      node.body.map(stmnt => gen(stmnt))
      this.tabNum--
      output.push(makeTabs(this.tabNum, "}"))
    },
    DoLoop(node) {
      let prevInLine = inLine
      inLine = true
      let line = `for(${gen(node.iterator)}; `
      line += gen(node.range) + "; "
      line += gen(node.steps) + ") {"
      inLine = prevInLine
      output.push(makeTabs(this.tabNum, line))
      this.tabNum++
      node.body.map(stmnt => gen(stmnt))
      this.tabNum--
      output.push(makeTabs(this.tabNum, "}"))
    },
    Variable(node) {
      return targetName(node)
    },
    Array(node) {
      return node.map(item => gen(item))
    },
    Literal(node) {
      if (node.type.description == "CHARS") {
        return '"' + node.value + '"'
      } else {
        return node.value
      }
    }
  }

  gen(program)
  return output.join("\n")
}

export { makeTabs }
