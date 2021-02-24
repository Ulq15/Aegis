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

export class Function {
  constructor(id, parameters, returnType, body) {
    Object.assign(this, { id, parameters, returnType, body })
  }
}

export class Expression {}

export class Conditional {}

export class Loop {}

export class DoLoop {}

export class Array {}

export class Dictionary {}

export class BinaryExpression {
  constructor(op, left, right) {
    Object.assign(this, { op, left, right })
  }
}

export class UnaryExpression {
  constructor(op, operand) {
    Object.assign(this, { op, operand })
  }
}

export class ArrayExpression {
  constructor(type, id, _size, _data) {
    Object.assign(this, { type, id, _size, _data })
  }
}

export class Math {
  constructor(op, left, right='') {
    if (right === '') {
      Object.assign(this, { op, operand=left })
    } else {
      Object.assign(this, { op, left, right })
    }
  }
}

export class Variable {
  constructor(type, id, data) {
    Object.assign(this, { type, id, data })
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

export class IdentifierExpression {
  constructor(name) {
    this.name = name
  }
}

export class Data {
  constructor(value) {
    this.value = value
  }
}

function formatAST(node) {}
