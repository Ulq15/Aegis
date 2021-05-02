
//import * as AST from "./ast.js"

import { Type } from "./ast.js"

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
    binExp.right = optimize(binExp.right)

    return binExp
  },
  PrefixExpression(preExp) {
    preExp.operand = optimize(preExp.operand)
    console.log(JSON.stringify(preExp))
    if(preExp.operand.type === Type.NUM || preExp.operand.type === Type.DECI){
      if(preExp.op.symbol === "-"){
        
        if(preExp.operand.constructor.name === "Literal"){
          preExp.operand.value*=(-1)
        } else {
          
        }
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
  },//u found the hidden joke! congratz :)        // G9NNE-2H0CC-YPK73
  Assignment(ass) {
    ass.target = optimize(ass.target)
    ass.source = optimize(ass.source)
    if(ass.target === ass.source){
      return []
    }
    return ass
  },
  ArrayAccess(aAccess) {
    aAccess.indexExp=optimize(aAccess.indexExp)
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
    if (loop.condition === false){
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
  Literal(lit){
    return lit
  },
  Array(arr) {
    return arr.flatMap(optimize)
  }
}