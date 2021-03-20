class Variable {
  constructor(name) {
    this.name = name
  }
}

class Context {
  constructor(context) {
    this.locals = new Map()
    this.funcs = new Map()
  }
  analyze(node) {
    return this[node.constructor.name](node)
  }
  addFuncs(name, scope) {
    if (this.funcs.has(name)) {
      throw new Error(`Function Identifier ${name} already declared`)
    }
    this.funcs.set(name, scope)
  }
  lookupFunc(name) {
    const entity = this.funcs.get(name)
    if (entity) {
      return entity
    }
    throw new Error(`Identifier ${name} not declared`)
  }
  add(name, entity) {
    if (this.locals.has(name)) {
      throw new Error(`Identifier ${name} already declared`)
    }
    this.locals.set(name, entity)
  }
  lookup(name) {
    const entity = this.locals.get(name)
    if (entity) {
      return entity
    }
    throw new Error(`Identifier ${name} not declared`)
  }
  Program(p){
    p.programBody = this.analyze(p.programBody)
    this.addClassFuncs(p.name, p.programBody )
    return p
  }
  FunDec(f){
    f.parameters = this.analyze(f.parameters)
    f.returnType = this.analyze(f.returnType)
    f.body = this.analyze(f.body)
    this.addFuncs(f.name, {param: f.parameters, returnType: f.returnType, body: f.body})
    return f
  }
  Param(p){
    p.type = this.analyze(p.type)
    return p
  }
  FunCall(c){
    c.parameters = this.analyze(c.parameters)
    return this.lookupFunc(c.name)
  }
  VarInitializer(v){
    v.type = this.analyze(v.type)
    v.variable = new Variable(v.assignment.target)
    v.assignment = this.analyze(v.assignment)
    this.add(v.assignment.target, v.variable)
    return v
  }
  VarDec(d){
    d.type = this.analyze(d.type)
    d.variable = new Variable(d.id)
    this.add(d.id, d.variable)
    return d
  }
  ReturnStatement(r){
    r.expression = this.analyze(r.expression)
    return r
  }
  PrintStatement(p){
    p.argument = this.analyze(p.argument)
    return p
  }
  BinaryExpression(e){
    e.left = this.analyze(e.left)
    e.right = this.analyze(e.right)
    e.op = this.analyze(e.op)
    return e
  }
  PrefixExpression(e){
    e.operand = this.analyze(e.operand)
    e.op = this.analyze(e.op)
    return e
  }
  PostfixExpression(e){
    e.operand = this.analyze(e.operand)
    e.op = this.analyze(e.op)
    return e
  }
  ArrayLiteral(a){
    a.list = this.analyze(a.list)
    return a
  }
  Assignment(a){
    a.target = this.analyze(a.target)
    a.source = this.analyze(a.source)
  }
  ArrayVar(a){
    a.baseName = this.analyze(a.baseName)
    a.indexExp = this.analyze(a.indexExp)
    //LINE 86+
  }
}

export default function analyze(node) {
  // Analyze in a fresh global context
  return new Context().analyze(node)
}
