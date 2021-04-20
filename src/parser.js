import ohm from "ohm-js"
import * as AST from "./ast.js"
import fs from "fs"

const aegisGrammar = ohm.grammar(fs.readFileSync("./fragments/Aegis.ohm").toString())

const astBuilder = aegisGrammar.createSemantics().addOperation("ast", {
  Program_declare(_classKey, id, _colon, classBody, _endKey) {
    return new AST.Program(id.ast(), classBody.ast())
  },
  ClassBody(declarations) {
    return declarations.ast()
  },
  Declaration_var(varDec, _semi) {
    return varDec.ast()
  },
  Declaration_func(funDec) {
    return funDec.ast()
  },
  VarDec_initialize(type, assignment) {
    return new AST.VarInitializer(type.ast(), assignment.ast())
  },
  VarDec_declare(type, id) {
    return new AST.VarDec(type.ast(), id.ast())
  },
  VarDec_funCall(funcall) {
    return funcall.ast()
  },
  Assignment_array(id, _open, comparand, _close, _eq, exp) {
    return new AST.Assignment(new AST.ArrayAccess(id.ast(), comparand.ast()), exp.ast())
  },
  Assignment_dictAdd(id, _add, key, _bracket, value, _close) {
    return new AST.Assignment(new AST.DictionaryAccess(id.ast(), key.ast()), value.ast())
  },
  Assignment_assign(id, _eq, exp) {
    return new AST.Assignment(id.ast(), exp.ast())
  },
  Assignment_funCall(id, _eq, funCall) {
    return new AST.Assignment(id.ast(), funCall.ast())
  },
  FunDec_declare(id, _open, params, _close, returnType, _colon, body, _endKey) {
    return new AST.FunDec(id.ast(), params.asIteration().ast(), returnType.ast(), body.ast())
  },
  Param_single(type, id) {
    return new AST.Variable(type.ast(), id.ast())
  },
  Body(statements) {
    return statements.ast()
  },
  Statement_assign(assignment, _semi) {
    return assignment.ast()
  },
  Statement_return(_returnKey, exp, _semi) {
    return new AST.ReturnStatement(exp.ast())
  },
  Statement_print(_printKey, _open, exp, _close, _semi) {
    return new AST.PrintStatement(exp.ast())
  },
  Statement_expLine(exp, _semi) {
    return exp.ast()
  },
  FunCall_call(id, _open, expList, _close) {
    return new AST.FunCall(id.ast(), expList.asIteration().ast())
  },
  Exp_logic(left, op, right) {
    return new AST.BinaryExpression(op.ast(), left.ast(), right.ast())
  },
  Formula_compare(left, op, right) {
    return new AST.BinaryExpression(op.ast(), left.ast(), right.ast())
  },
  Comparand_arithmetic(left, op, right) {
    return new AST.BinaryExpression(op.ast(), left.ast(), right.ast())
  },
  Term_multiOp(left, op, right) {
    return new AST.BinaryExpression(op.ast(), left.ast(), right.ast())
  },
  Factor_exponent(left, op, right) {
    return new AST.BinaryExpression(op.ast(), left.ast(), right.ast())
  },
  Primary_postfix(primary, op) {
    return new AST.PostfixExpression(op.ast(), primary.ast())
  },
  Primary_prefix(op, primary) {
    return new AST.PrefixExpression(op.ast(), primary.ast())
  },
  Primary_negate(op, primary) {
    return new AST.PrefixExpression(op.ast(), primary.ast())
  },
  Primary_arrayLiteral(_open, expList, _close) {
    return new AST.ArrayLiteral(expList.asIteration().ast())
  },
  Primary_accessArray(id, _open, comparand, _close) {
    return new AST.ArrayAccess(id.ast(), comparand.ast())
  },
  Primary_getDictionary(id, _get, exp, _close) {
    return new AST.DictionaryAccess(id.ast(), exp.ast())
  },
  Primary_parens(_open, exp, _close) {
    return exp.ast()
  },
  Primary_id(id) {
    return Symbol(id.sourceString)
  },
  Primary_literal(literal) {
    return literal.sourceString
  },
  If(_if, _open, exp, _close, _colon, body) {
    return new AST.ConditionalIF(exp.ast(), body.ast())
  },
  ElseIf(_elseif, _open, exp, _close, _colon, body) {
    return new AST.ConditionalELSEIF(exp.ast(), body.ast())
  },
  Else(_else, _colon, body) {
    return new AST.ConditionalELSE(body.ast())
  },
  Conditional(IF, ELSEIF, ELSE, _endKey) {
    return new AST.Conditional(IF.ast(), ELSEIF.ast(), ELSE.ast())
  },
  DoLoop_declare(_do, _open, varDec, _comma1, exp1, _comma2, exp2, _close, _colon, body, _endKey) {
    return new AST.DoLoop(varDec.ast(), exp1.ast(), exp2.ast(), body.ast())
  },
  DoLoop_assign(_do, _open, assign, _comma1, exp1, _comma2, exp2, _close, _colon, body, _endKey) {
    return new AST.DoLoop(assign.ast(), exp1.ast(), exp2.ast(), body.ast())
  },
  Loop_statement(_loop, _open, exp, _close, _colon, body, _endKey) {
    return new AST.Loop(exp.ast(), body.ast())
  },
  TypeExp_array(type, _open, _close) {
    return new AST.ArrayType(new AST.Type(type.sourceString))
  },
  TypeExp_dictionary(_open1, type1, _close1, _open2, type2, _close2) {
    return new AST.DictionaryType(new AST.Type(type1.sourceString), new AST.Type(type2.sourceString))
  },
  TypeExp_numType(type) {
    return new AST.Type(type.sourceString)
  },
  // TypeExp_deciType(type) {
  //   return new AST.Type(type.sourceString)
  // },  
  TypeExp_boolType(type) {
    return new AST.Type(type.sourceString)
  },
  TypeExp_charsType(type) {
    return new AST.Type(type.sourceString)
  },
  id(first, sec) {
    return Symbol(first.sourceString + sec.sourceString)
  },
  logicop(_) {
    return new AST.Operator(this.sourceString)
  },
  compareOp(_) {
    return new AST.Operator(this.sourceString)
  },
  negateOp(_) {
    return new AST.Operator(this.sourceString)
  },
  addop(_) {
    return new AST.Operator(this.sourceString)
  },
  multop(_) {
    return new AST.Operator(this.sourceString)
  },
  exponentop(_) {
    return new AST.Operator(this.sourceString)
  },
  crementOp(_) {
    return new AST.Operator(this.sourceString)
  },
  // int(_digits){
  //   return BigInt(this.sourceString)
  // },
  // decimal(_integer , _dot, _fraction){
  //   return Number(this.sourceString)
  // },
  // negative(_sign, _num){
  //   return (-1) * Number(num.sourceString)
  // },
  // false(_){
  //   return false
  // },
  // true(_){
  //   return true
  // },
  // char(_){
  //   return this.sourceString
  // },
  // stringLiteral(_open, chars, _close){
  //   return chars.sourceString
  // },
})

export default function parse(sourceCode) {
  const match = aegisGrammar.match(sourceCode)
  if (!match.succeeded()) {
    throw new Error(match.message)
  }
  return astBuilder(match).ast()
}
