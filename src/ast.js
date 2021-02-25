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
  constructor(id, _paramList, returnType, body) {
    Object.assign(this, { id, _paramList, returnType, body })
  }
}

export class ParamList {
  constructor(param, paramList) {
    this.parm = param
    this.paramList = paramList
  }
}

export class Param {
  constructor(type, id) {
    Object.assign(this, { type, id })
  }
}

export class ExpList {
  constructor(exp, expList) {
    this.exp = exp
    this.expList = expList
  }
}

export class FunCall {
  constructor(id, _paramList) {
    Object.assign(this, { id, _paramList })
  }
}

export class VarInitializer {
  constructor(type, id, initializer) {
    Object.assign(this, { type, id, initializer })
  }
}

export class VarDec {
  constructor(type, id) {
    Object.assign(this, { type, id })
  }
}

export class ReturnStatement {
  constructor(expression) {
    this.expression = expression
  }
}

export class PrintStatement {
  constructor(argument) {
    this.argument = argument
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
    this.list = list
  }
}

export class Literal {
  constructor(value) {
    this.value = value
  }
}

export class Variable {
  constructor(name) {
    this.name = name
  }
}

export class Assignment {
  constructor(target, structOp, source) {
    if (structOp !== false) {
      this.structOp = structOp
    }
    Object.assign(this, { target, source })
  }
}

export class TypeExp {
  constructor(type) {
    this.type = type
  }
}

export class ArrayType {
  constructor(type, indexExp) {
    this.type = type
    if (indexExp !== undefined || indexExp !== null) {
      this.indexExp = indexExp
    }
  }
}

export class ArrayOp {
  constructor(exp) {
    Object.assign(this, { exp })
  }
}

export class PrimaryArrayOp {
  constructor(id, exp) {
    Object.assign(this, { id, exp })
  }
}

export class DictionaryType {
  constructor(type1, type2) {
    Object.assign(this, { type1, type2 })
  }
}

export class DictionaryAdd {
  constructor(key, value) {
    Object.assign(this, { key, value })
  }
}

export class DictionaryGet {
  constructor(key) {
    Object.assign(this, { key })
  }
}

export class ConditionalIF {
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
  constructor(varExp, exp1, exp2, body) {
    Object.assign(this, { varExp, exp1, exp2, body })
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
