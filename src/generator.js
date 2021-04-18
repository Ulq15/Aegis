// Code generator from Aegis to JavaScript
// Call the generate(program) function with a program's root node to
// get a JS translation as a String

export default function generate(program) {
  const output = []

  const gen = node => generators[node.constructor.name](node)
  const printFunc = arg => `console.log(${arg})`

  const targetName = (mapping => {
    return entity => {
      if (!mapping.has(entity)) {
        mapping.set(entity, mapping.size + 1)
      }
      //NextLine => should it be `${entity.description ?? entity}... or `${entity.id.description ?? entity.id}...
      return `${entity.id.description ?? entity.id}_${mapping.get(entity)}`
    }
  })(new Map())

  const generators = {
    Program(node) {
      node.classBody.map(body => gen(body))
    },
    FunDec(node) {
      output.push(`let ${targetName(node)} = function (${node.parameters.map(params => gen(params))}) {`)
      node.body.map(statement => gen(statement))
      output.push(`}`)
    },
    Param(node) {
      return targetName(node)
    },
    FunCall(node) {
      output.push(`${gen(node.id)}(${gen(node.parameters).join(", ")});`)
    },
    VarInitializer(node) {
      output.push(`let ${gen(node.target)} = ${gen(node.source)};`)
    },
    VarDec(node) {
      output.push(`let ${gen(node.variable)};`)
    },
    ReturnStatement(node) {
      output.push(`return ${gen(node.expression)};`)
    },
    PrintStatement(node) {
      output.push(`console.log(${gen(node.argument)});`)
    },
    BinaryExpression(node) {
      return `${gen(node.left)} ${gen(node.op)} ${gen(node.right)}`
    },
    PrefixExpression(node) {
      return `${gen(node.op)}${gen(node.operand)}`
    },
    PostfixExpression(node) {
      return `${gen(node.operand)}${gen(node.op)}`
    },
    Assignment(node) {
      output.push(`${gen(node.target)} = ${gen(node.source)};`)
    },
    ArrayLiteral(node) {
      return `[${gen(node.list).join(", ")}]`
    },
    ArrayVar(node) {
      return `${targetName(node.id)}[${gen(node.indexExp)}]`
    },
    DictionaryAccess(node) {
      return `${targetName(node.id)}.${gen(node.key)}`
    },
    Conditional(node) {
      gen(node.ifStatement)
      gen(node.elseIfStatements)
      gen(node.elseStatement)
    },
    ConditionalIF(node) {
      output.push(`if(${gen(node.exp)}) {\n${gen(node.body)}\n} `)
    },
    ConditionalELSEIF(node) {
      output.push(`else if(${gen(node.exp)}) {\n${gen(node.body)}\n} `)
    },
    ConditionalELSE(node) {
      output.push(`else {\n${gen(node.body)}\n} `)
    },
    Loop(node) {
      output.push(`while (${gen(node.condition)}) {\n${gen(node.body)}\n}`)
    },
    DoLoop(node) {
      output.push(`for(${gen(node.iterator)}; ${gen(node.range)}; ${gen(node.steps)}) {\n${gen(node.body)}\n} `)
    },
    Variable(node) {
      return targetName(node)
    },
    String(node) {
      return node
    },
    
  }

  gen(program)
  return output.join("\n")
}
