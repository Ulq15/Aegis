class Variable {
  constructor(name, type) {
    this.type = type
    this.name = name
  }
}

class Context {
  constructor(context) {
    this.locals = new Map()
  }
  analyze(node) {
    //console.log(node)
    return this[node.constructor.name](node)
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
    p.classBody.map(body => this.analyze(body))
    this.add(p.id.name, p.classBody )
    return p
  }
  FunDec(f){
    f.parameters.map(params => this.analyze(params))
    f.body.map( stmnt => this.analyze(stmnt))
    this.add(f.id.name, { name: f.id.name, param: f.parameters, type: f.returnType, body: f.body } )
    return f
  }
  Param(p){
    p.variable = new Variable(p.id.name, p.type)
    this.add(p.id.name, p.variable)
    return p
  }
  FunCall(c){
    c.parameters.map(params => this.analyze(params))

    return this.lookup(c.id.name)
  }
  VarInitializer(v){
    v.variable = new Variable(v.assignment.target.name, v.type)
    this.add(v.assignment.target.name, v.variable)
    v.assignment = this.analyze(v.assignment)
    return v
  }
  VarDec(d){
    d.variable = new Variable(d.id, d.type)
    this.add(d.id.name, d.variable)
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
    return a.map(item => this.analyze(item))
  }
  Assignment(a){
    a.target = this.analyze(a.target)
    a.source = this.analyze(a.source)
    return a
  }
  ArrayVar(a){
    a.baseName = this.analyze(a.baseName)
    a.indexExp = this.analyze(a.indexExp)
    return a
  }
  DictionaryVar(d){
    d.variable = new Variable(d.id)
    d.key  = this.analyze(d.key)
    this.add(d.id, d.variable)
    return d
  }
  DictionaryGet(g){
    g.dictionary = this.analyze(g.dictionary)
    g.key = this.analyze(g.key)
    return g
  }
  Conditional(c){
    c.ifStatement = this.analyze(c.ifStatement)
    c.elseIfStatements = this.analyze(c.elseIfStatements)
    c.elseStatement = this.analyze(c.elseStatement)
    return c
  }
  ConditionalIF(c){
    c.exp = this.analyze(c.exp)
    c.body = this.analyze(c.body)
    return c
  }
  ConditionalELSEIF(c){
    c.exp = this.analyze(c.exp)
    c.body = this.analyze(c.body)
    return c
  }
  ConditionalELSE(c){
    c.body = this.analyze(c.body)
    return c
  }
  Loop(l){
    l.condition = this.analyze(l.condition)
    l.body = this.analyze(l.body)
    return l
  }
  DoLoop(d){
    d.iterator =  this.analyze(d.iterator)
    d.range =  this.analyze(d.range)
    d.steps =  this.analyze(d.steps)
    d.body = this.analyze(d.body)
    return d
  }
  Array(a) {
    return a.map(item => this.analyze(item))
  }
  TypeExp(t){
    return t
  }
  Number(i){
    return i
  }
  IdExp(id){
    return this.lookup(id.name)
  }
  String(s){
    return s
  }
}

export default function analyze(node) {
  // Analyze in a fresh global context
  return new Context().analyze(node)
}
