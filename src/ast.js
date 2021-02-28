/*  Abstract Syntax Tree Node Classes */

import util from "util"

export class Program {
  constructor(id, programBody) {
    Object.assign(this, { id, programBody })
  }
  [util.inspect.custom]() {
    return formatAST(this)
  }
}

export class FunDec {
  constructor(id, paramList, returnType, body) {
    Object.assign(this, { id, paramList, returnType, body })
  }
}

export class Param {
  constructor(type, id) {
    Object.assign(this, { type, id })
  }
}

export class FunCall {
  constructor(id, paramList) {
    Object.assign(this, { id, paramList })
  }
}

export class VarInitializer {
  constructor(type, assignment) {
    Object.assign(this, { type, assignment })
  }
}

export class VarDec {
  constructor(type, id) {
    Object.assign(this, { type, id })
  }
}

export class ReturnStatement {
  constructor(expression) {
    Object.assign(this, { expression })
  }
}

export class PrintStatement {
  constructor(argument) {
    Object.assign(this, { argument })
  }
}

export class BinaryExpression {
  constructor(op, left, right) {
    Object.assign(this, { op, left, right })
  }
}

export class PrefixExpression {
  constructor(op, operand) {
    Object.assign(this, { op, operand })
  }
}

export class PostfixExpression {
  constructor(op, operand) {
    Object.assign(this, { op, operand })
  }
}

export class ArrayLiteral {
  constructor(list) {
    Object.assign(this, { list })
  }
}

export class Literal {
  constructor(value) {
    Object.assign(this, { value })
  }
}

export class Variable {
  constructor(name) {
    Object.assign(this, { name })
  }
}

export class Assignment {
  constructor(target, source) {
    Object.assign(this, { target, source })
  }
}

export class TypeExp {
  constructor(type) {
    Object.assign(this, { type })
  }
}

export class ArrayVar {
  constructor(base, indexExp) {
    Object.assign(this, { base, indexExp})
  }
}

export class ArrayType {
  constructor(base) {
    Object.assign(this, { base })
  }
}

export class ArrayOp {
  constructor(exp) {
    Object.assign(this, { exp })
  }
}

export class DictionaryVar {
  constructor(id, key) {
    Object.assign({ id, key })
  }
}

export class DictionaryType {
  constructor(type1, type2) {
    Object.assign(this, { type1, type2 })
  }
}

export class DictionaryAdd {
  constructor(dictionary, key, value) {
    Object.assign(this, { dictionary, key, value })
  }
}

export class DictionaryGet {
  constructor(dictionary, key) {
    Object.assign(this, { dictionary, key })
  }
}

export class Conditional{
  constructor(ifStatement, elseIfStatements, elseStatement){
    Object.assign(this, { ifStatement, elseIfStatements, elseStatement })
  } 
}

export class ConditionalIF {
  constructor(exp, body) {
    Object.assign(this, { exp, body })
  }
}

export class ConditionalELSEIF {
  constructor(exp, body) {
    Object.assign(this, { exp, body })
  }
}

export class ConditionalELSE {
  constructor(body) {
    Object.assign(this, { body })
  }
}

export class Loop {
  constructor(exp, body) {
    Object.assign(this, { exp, body })
  }
}

export class DoLoop {
  constructor(exp, exp1, exp2, body) {
    Object.assign(this, { exp, exp1, exp2, body })
  }
}


function formatAST(node) {
  // Return a compact and pretty string representation of the node graph,
  // taking care of cycles. Written here from scratch because the built-in
  // inspect function, while nice, isn't nice enough.
  const tags = new Map()

  function tag(node) {
    if (tags.has(node) || typeof node !== "object" || node === null) return
    tags.set(node, tags.size + 1)
    for (const child of Object.values(node)) {
      Array.isArray(child) ? child.forEach(tag) : tag(child)
    }
  }

  function* lines() {
    function view(e) {
      if (tags.has(e)) return `#${tags.get(e)}`
      if (Array.isArray(e)) return `[${e.map(view)}]`
      return util.inspect(e)
    }
    for (let [node, id] of [...tags.entries()].sort((a, b) => a[1] - b[1])) {
      let [type, props] = [node.constructor.name, ""]
      Object.entries(node).forEach(([k, v]) => (props += ` ${k}=${view(v)}`))
      yield `${String(id).padStart(4, " ")} | ${type}${props}`
    }
  }

  tag(node)
  return [...lines()].join("\n")
}
