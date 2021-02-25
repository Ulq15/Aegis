import ohm from "ohm-js"
import * as AST from "./ast.js"
import fs from "fs"

const aegisGrammar = ohm.grammar(
  fs.readFileSync("./fragments/Aegis.ohm").toString()
)

const astBuilder = aegisGrammar.createSemantics().addOperation("ast", {
  Program_declare(_classKey, id, _colon, classBody, _endKey) {
    return new AST.Program(id.sourceString, classBody.ast())
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
    return new AST.VarDec(type.ast(), id.sourceString)
  },
  Assignment_array(id, _open, comparand, _close, _eq, exp) {
    return new AST.Assignment(
      new AST.ArrayVar(id.sourceString, comparand.ast()),
      exp.ast()
    )
  },
  Assignment_dictAdd(id, _add, key, _bracket, value, _close) {
    return new AST.Assignment(
      new AST.DictionaryVar(id.sourceString, key.ast()),
      value.ast()
    )
  },
  Assignment_assign(id, _eq, exp) {
    return new AST.Assignment(id.sourceString, exp.ast())
  },
  FunDec_declare(
    id,
    _open,
    param1,
    _comma,
    param2,
    _close,
    returnType,
    _colon,
    body,
    _endKey
  ) {
    var paramList = []
    paramList.push(param1.ast())
    if (param2 !== undefined) {
      paramList.push(param2.ast())
    }
    return new AST.FunDec(
      id.sourceString,
      paramList,
      returnType.ast(),
      body.ast()
    )
  },
  Param_single(type, id) {
    return new AST.Param(type.ast(), id.sourceString)
  },
  Body(statements) {
    return statements.ast()
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
  Statement_funcLine(call, _semi) {
    return call.ast()
  },
  FunCall_call(id, _open, exp1, _comma, exp2, _close) {
    var expList = []
    expList.push(exp1.ast())
    expList.push(exp2.ast())
    return new AST.FunCall(id.sourceString, expList)
  },
  Formula_compare(left, op, right) {
    return new AST.BinaryExpression(op.sourceString, left.ast(), right.ast())
  },
  Comparand_arithmetic(left, op, right) {
    return new AST.BinaryExpression(op.sourceString, left.ast(), right.ast())
  },
  Term_multiOp(left, op, right) {
    return new AST.BinaryExpression(op.sourceString, left.ast(), right.ast())
  },
  Factor_exponent(left, op, right) {
    return new AST.BinaryExpression(op.sourceString, left.ast(), right.ast())
  },
  Primary_postfix(primary, op) {
    return new AST.PostfixExpression(op, primary)
  },
  Primary_prefix(op, primary) {
    return new AST.PrefixExpression(op, primary)
  },
  Primary_negate(op, primary) {
    return new AST.PostfixExpression(op, primary)
  },
  Primary_arrayLiteral(_open, exp1, _comma, exp2, _close) {
    var expList = []
    expList.push(exp1.ast())
    expList.push(exp2.ast())
    return new AST.ArrayLiteral(expList)
  },
  Primary_accessArray(id, _open, comparand, _close) {
    return new AST.ArrayVar(id.sourceString, comparand.ast())
  },
  Primary_getDictionary(id, _get, exp, _close) {
    return new AST.DictionaryGet(id.sourceString, exp.ast())
  },
  Primary_parens(_open, exp, _close) {
    return exp.ast()
  },
  Primary_id(id) {
    return new AST.Variable(id.sourceString)
  },
  Primary_literal(literal) {
    return new AST.Literal(literal.sourceString)
  },
  Conditional_condition(
    _if,
    _open1,
    exp1,
    _close1,
    body1,
    _elseif,
    _open2,
    exp2,
    _close2,
    body2,
    _else,
    body3,
    _endKey
  ) {
    var ifStatement = new AST.ConditionalIF(exp1.ast(), body1.ast())
    var elseIfStatements = []
    elseIfStatements.push(new AST.ConditionalELSEIF(exp2.ast(), body2.ast()))
    var elseStatement = new AST.ConditionalELSE(body3.ast())
    return new AST.Conditional(ifStatement, elseIfStatements, elseStatement)
  },
  Loop_stepByStep(
    _do,
    _open,
    varExp,
    _comma1,
    exp1,
    _comma2,
    exp2,
    _close,
    body,
    _endKey
  ) {
    return new AST.DoLoop(varExp.ast(), exp1.ast(), exp2.ast(), body.ast())
  },
  Loop_statement(_loop, _open, exp, _close, body, _endKey) {
    return new AST.Loop(exp, body)
  },
  TypeExp(type) {
    return new AST.TypeExp(type.sourceString)
  },
})

export default function parse(sourceCode) {
  const match = aegisGrammar.match(sourceCode)
  if (!match.succeeded()) {
    throw new Error(match.message)
  }
  //console.log(astBuilder(match).ast())
  return astBuilder(match).ast()
}
