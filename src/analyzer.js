import { Variable } from "./ast.js"

class Context {
  constructor(context) {
    this.localVars = new Map()
  }
  analyze(node) {
    return this[node.constructor.name](node)
  }
  add(name, entity) {
    //console.log(`Added ${name}`)
    if (this.localVars.has(name)) {
      throw new Error(`Identifier ${name} already declared`)
    }
    this.localVars.set(name, entity)
  }
  lookup(name) {
    const entity = this.localVars.get(name)
    if (entity) {
      return entity
    }
    throw new Error(`Identifier ${name} not declared`)
  }
  Program(p) {
    p.classBody.map(body => this.analyze(body))
    this.add(p.id.description, p.classBody)
    return p
  }
  FunDec(f) {
    //f.returnType = f.returnType.map(type => type.description)
    this.add(f.id.description, f)
    f.parameters.map(params => this.analyze(params))
    f.body.map(stmnt => this.analyze(stmnt))
    return f
  }
  Param(p) {
    p.variable = new Variable(p.type, p.id)
    this.add(p.id.description, p.variable)
    delete p.id
    delete p.type
    return p
  }
  FunCall(c) {
    
    c.function = this.lookup(c.id.description)
    const p = c.parameters.map(params => this.analyze(params))
    c.parameters = p
    return c
  }
  VarInitializer(v) {
    const i = this.analyze(v.assignment.target.description)
    v.variable = new Variable(v.type, v.assignment.target)
    this.add(i, v.variable)
    v.source = this.analyze(v.assignment.source)
    delete v.assignment
    delete v.type
    return v
  }
  VarDec(d) {
    d.variable = new Variable(d.type.description, d.id.description)
    this.add(d.id.description, d.variable)
    return d
  }
  ReturnStatement(r) {
    r.expression = this.analyze(r.expression)
    return r
  }
  PrintStatement(p) {
    p.argument = this.analyze(p.argument)
    return p
  }
  BinaryExpression(e) {
    e.left = this.analyze(e.left)
    e.right = this.analyze(e.right)
    e.op = this.analyze(e.op)
    return e
  }
  PrefixExpression(e) {
    e.operand = this.analyze(e.operand)
    e.op = this.analyze(e.op)
    return e
  }
  PostfixExpression(e) {
    e.operand = this.analyze(e.operand)
    e.op = this.analyze(e.op)
    return e
  }
  ArrayLiteral(a) {
    return a.list.map(item => this.analyze(item))
  }
  Assignment(a) {
    a.target = this.analyze(a.target)
    a.source = this.analyze(a.source)
    return a
  }
  ArrayVar(a) {
    this.lookup(a.id.description)
    a.id = this.analyze(a.id.description)
    a.indexExp = this.analyze(a.indexExp)
    return a
  }
  DictionaryAccess(g) {
    g.id = this.analyze(g.id)
    g.key = this.analyze(g.key)
    return g
  }
  Conditional(c) {
    c.ifStatement = this.analyze(c.ifStatement)
    c.elseIfStatements = this.analyze(c.elseIfStatements)
    c.elseStatement = this.analyze(c.elseStatement)
    return c
  }
  ConditionalIF(c) {
    c.exp = this.analyze(c.exp)
    c.body = this.analyze(c.body)
    return c
  }
  ConditionalELSEIF(c) {
    c.exp = this.analyze(c.exp)
    c.body = this.analyze(c.body)
    return c
  }
  ConditionalELSE(c) {
    c.body = this.analyze(c.body)
    return c
  }
  Loop(l) {
    l.condition = this.analyze(l.condition)
    l.body = this.analyze(l.body)
    return l
  }
  DoLoop(d) {
    d.iterator = this.analyze(d.iterator)
    d.range = this.analyze(d.range)
    d.steps = this.analyze(d.steps)
    d.body = this.analyze(d.body)
    return d
  }
  Array(a) {
    return a.map(item => this.analyze(item))
  }
  Symbol(node) {
    //console.log(node)
    return this.lookup(node.description)
  }
  String(node) {
    return node
  }
}

export default function analyze(node) {
  //console.log(node)
  return new Context().analyze(node)
}
