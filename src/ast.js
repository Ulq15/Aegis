/*  Abstract Syntax Tree Node Classes */

import util from "util"

export class Program {
  constructor(id, classBody) {
    Object.assign(this, { id, classBody })
  }
  [util.inspect.custom]() {
    return formatAST(this)
  }
}

export class FunDec {
  constructor(id, parameters, returnType, body) {
    Object.assign(this, { id, parameters, returnType, body })
  }
}

export class Param {
  constructor(type, id) {
    Object.assign(this, { id, type })
  }
}

export class FunCall {
  constructor(id, parameters) {
    Object.assign(this, { id, parameters })
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
    Object.assign(this, { left, op, right })
  }
}

export class PrefixExpression {
  constructor(op, operand) {
    Object.assign(this, { op, operand })
  }
}

export class PostfixExpression {
  constructor(op, operand) {
    Object.assign(this, { operand, op })
  }
}

export class ArrayLiteral {
  constructor(list) {
    Object.assign(this, { list })
  }
}

export class Assignment {
  constructor(target, source) {
    Object.assign(this, { target, source })
  }
}

export class ArrayVar {
  constructor(id, indexExp) {
    Object.assign(this, { id, indexExp })
  }
}

export class DictionaryAccess {
  constructor(id, key) {
    Object.assign(this, { id, key })
  }
}

export class Conditional {
  constructor(ifStatement, elseIfStatements, elseStatement) {
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
  constructor(condition, body) {
    Object.assign(this, { condition, body })
  }
}

export class DoLoop {
  constructor(iterator, range, steps, body) {
    Object.assign(this, { iterator, range, steps, body })
  }
}

export class Variable {
  constructor(type, id) {
    Object.assign(this, { id, type })
  }
}

function formatAST(node) {
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
    for (const [node, id] of [...tags.entries()].sort((a, b) => a[1] - b[1])) {
      let [type, props] = [node.constructor.name, ""]
      Object.entries(node).forEach(([k, v]) => (props += ` ${k}=${view(v)}`))
      yield `${String(id).padStart(4, " ")} | ${type}${props}`
    }
  }

  tag(node)
  return [...lines()].join("\n")
}
