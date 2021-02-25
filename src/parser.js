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
  ClassBody(_declarations) {
    return declarations.ast()
  },
  Declaration_var(varDec, _semi) {
    return varDec.ast()
  },
  Declaration_func(funDec) {
    return funDec.ast()
  },
  VarDec_declare(type, id, _eq, _exp) {
    if (eq === "=") {
      return new AST.VarInitializer(type.ast(), id.sourceString, exp.ast())
    } else {
      return new AST.VarDec(type.ast(), id.sourceString)
    }
  },
  //Need help here VarDec optional arrayOp or dictionaryOp************************************
  VarDec_array(id, structOp, _eq, exp) {
    return new AST.Assignment(id.sourceString, structOp.ast(), exp.ast())
  },
  VarDec_dictionary(id, structOp, _eq, exp) {
    return new AST.Assignment(id.sourceString, structOp.ast(), exp.ast())
  },
  VarDec_assign(id, _eq, exp) {
    return new AST.Assignment(id.sourceString, false, exp.ast())
  },
  FunDec_declare(
    id,
    _open,
    _paramList,
    _close,
    _returnType,
    _colon,
    body,
    _endKey
  ) {
    return new AST.FunDec(
      id.sourceString,
      paramList.ast(),
      returnType.ast(),
      body.ast()
    )
  },
  //Need help here multiple comma separated parameters****************************************
  ParamList_params(param, _comma, _paramList) {
    return new AST.ParamList(param.ast(), paramList.ast())
  },
  Param_single(type, id) {
    return new AST.Param(type.ast(), id.sourceString)
  },
  Body(_statements) {
    return _statements.ast()
  },
  Statement_return(_returnKey, exp, _semi) {
    return new AST.ReturnStatement(exp.ast())
  },
  Statement_print(_printKey, _open, exp, _close, _semi) {
    return new AST.PrintStatement(exp.ast())
  },
  Statement_line(exp, _semi) {
    return new exp.ast()
  },
  FunCall_call(id, _open, expList, _close, _semi) {
    return new AST.FunCall(id.sourceString, expList.ast())
  },
  //Need help here multiple comma separated parameters****************************************
  ExpList_exps(exp, _comma, _expList) {
    return new AST.ExpList(exp.ast(), expList.ast())
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
  Primary_array(_open, _expList, _close) {
    return expList.ast()
  },
  Primary_accessArray(id, arrayOp) {
    return new AST.PrimaryArrayOp(id.sourceString, arrayOp.ast())
  },
  Primary_accessDictionary(id, dictionaryOp) {
    return id.sourceString, dictionaryOp.ast()
  },
  Primary_parens(_open, exp, _close) {
    return exp.ast()
  },
  //Need help here with multiple kleene star operators****************************************
  Exp(formula, ...more) {},
})

export default function parse(sourceCode) {
  const match = aegisGrammar.match(sourceCode)
  if (!match.succeeded()) {
    throw new Error(match.message)
  }
  return astBuilder(match).ast()
}
