//import * as AST from "./ast.js"

import { Literal, Operator, PrefixExpression, Type } from "./ast.js"

export default function optimize(node) {
  return optimizers[node.constructor.name](node)
}

const optimizers = {
  Program(p) {
    p.classBody = optimize(p.classBody)
    return p
  },
  FunDec(fDec) {
    fDec.body = optimize(fDec.body)
    return fDec
  },
  FunCall(fCall) {
    fCall.callee = optimize(fCall.callee)
    fCall.parameters = optimize(fCall.parameters)
    return fCall
  },
  VarInitializer(vInit) {
    vInit.source = optimize(vInit.source)
    vInit.target.stored = vInit.source
    return vInit
  },
  VarDec(vDec) {
    return vDec
  },
  ReturnStatement(rSttmnt) {
    rSttmnt.expression = optimize(rSttmnt.expression)
    return rSttmnt
  },
  PrintStatement(pSttmnt) {
    pSttmnt.argument = optimize(pSttmnt.argument)
    return pSttmnt
  },
  BinaryExpression(binExp) {
    binExp.left = optimize(binExp.left)
    binExp.right = optimize(binExp.right[0])
    binExp.op = optimize(binExp.op[0])
    if (binExp.op.symbol === "&") {
      // Optimize boolean constants in && and ||
      if (binExp.left === true) return binExp.right
      else if (binExp.right === true) return binExp.left
    } else if (binExp.op.symbol === "|") {
      if (binExp.left === false) return binExp.right
      else if (binExp.right === false) return binExp.left
    } else if ([Literal].includes(binExp.left.constructor)) {
      // Numeric constant folding when left operand is constant
      if ([Literal].includes(binExp.right.constructor)) {
        if (binExp.op.symbol === "+") return binExp.left.value + binExp.right.value
        else if (binExp.op.symbol === "-") return binExp.left - binExp.right.value
        else if (binExp.op.symbol === "*") return binExp.left * binExp.right.value
        else if (binExp.op.symbol === "/") return binExp.left / binExp.right.value
        else if (binExp.op.symbol === "**") return binExp.left ** binExp.right.value
        else if (binExp.op.symbol === "<") return binExp.left < binExp.right.value
        else if (binExp.op.symbol === "<=") return binExp.left <= binExp.right.value
        else if (binExp.op.symbol === "==") return binExp.left === binExp.right.value
        else if (binExp.op.symbol === "!=") return binExp.left !== binExp.right.value
        else if (binExp.op.symbol === ">=") return binExp.left >= binExp.right.value
        else if (binExp.op.symbol === ">") return binExp.left > binExp.right.value
      } else if (binExp.left.value === 0 && binExp.op.symbol === "+") return binExp.right.value
      else if (binExp.left.value === 1 && binExp.op.symbol === "*") return binExp.right.value
      else if (binExp.left.value === 0 && binExp.op.symbol === "-") return this.PrefixExpression(new PrefixExpression(new Operator("-"), binExp.right.value))
      else if (binExp.left.value === 1 && binExp.op.symbol === "**") return 1
      else if (binExp.left.value === 0 && ["*", "/"].includes(binExp.op.symbol)) return 0
    } else if (binExp.right.constructor === Number) {
      // Numeric constant folding when right operand is constant
      if (["+", "-"].includes(binExp.op.symbol) && binExp.right.value === 0) return binExp.left.value
      else if (["*", "/"].includes(binExp.op.symbol) && binExp.right.value === 1) return binExp.left.value
      else if (binExp.op.symbol === "*" && binExp.right.value === 0) return 0
      else if (binExp.op.symbol === "**" && binExp.right.value === 0) return 1
    }
    return binExp
  },
  PrefixExpression(preExp) {
    preExp.operand = optimize(preExp.operand)
    if (preExp.op.symbol === "-") {
      if (preExp.operand.id) {
        return optimize(new Literal(preExp.operand.stored.value * -1, preExp.operand.type))
      }
    }
    return preExp
  },
  PostfixExpression(postExp) {
    postExp.operand = optimize(postExp.operand)
    return postExp
  },
  ArrayLiteral(aLit) {
    aLit.list = optimize(aLit.list)
    return aLit
  }, //u found the hidden joke! congratz :)        // G9NNE-2H0CC-YPK73
  Assignment(ass) {
    ass.target = optimize(ass.target)
    ass.source = optimize(ass.source)
    if (ass.target === ass.source) {
      return []
    }
    return ass
  },
  ArrayAccess(aAccess) {
    aAccess.indexExp = optimize(aAccess.indexExp)
    aAccess.arrayVar = optimize(aAccess.arrayVar)
    return aAccess
  },
  Conditional(cond) {
    return cond
  },
  ConditionalIF(condIF) {
    return condIF
  },
  ConditionalELSEIF(condELIF) {
    return condELIF
  },
  ConditionalELSE(condELSE) {
    return condELSE
  },
  Loop(loop) {
    loop.condition = optimize(loop.condition)
    if (loop.condition === false) {
      return []
    }
    loop.body = optimize(loop.body)
    return loop
  },
  DoLoop(doLoop) {
    return doLoop
  },
  Variable(v) {
    return v
  },
  Operator(op) {
    return op
  },
  ArrayType(arrType) {
    return arrType
  },
  DictionaryType(dicType) {
    return dicType
  },
  Type(type) {
    return type
  },
  Literal(lit) {
    return lit
  },
  Array(arr) {
    return arr.flatMap(optimize)
  }
}
