import {Variable} from "./ast.js"

class Context {
  constructor(context) {
    this.localVars = new Map()
    this.localFuncs = new Map()
  }
  analyze(node) {
    // console.log(node)
    return this[node.constructor.name](node)
  }
  add(name, entity) {
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
  addFunc(name, entity) {
    if (this.localFuncs.has(name)) {
      throw new Error(`Function Identifier ${name} already declared`)
    }
    this.localFuncs.set(name, entity)
  }
  lookupFunc(name) {
    const entity = this.localFuncs.get(name)
    if (entity) {
      return entity
    }
    throw new Error(`Function Identifier ${name} not declared`)
  }
  Program(p) {
    p.id=p.id.name
    p.classBody.map((body) => this.analyze(body))
    this.add(p.id, p.classBody)
    return p
  }
  FunDec(f) {
    f.id = f.id.name
    this.addFunc(f.id, f)
    f.parameters.map((params) => this.analyze(params))
    f.body.map((stmnt) => this.analyze(stmnt))
    return f
  }
  Param(p) {
    p.variable = new Variable(p.id.name, p.type)
    this.add(p.id.name, p.variable)
    delete p.type
    delete p.id
    return p
  }
  FunCall(c) {
    c.id = c.id.name
    c.function = this.lookupFunc(c.id)
    const p = c.parameters.map((params) => this.analyze(params))
    c.parameters = p
    return c
  }
  VarInitializer(v) {
    const i = this.analyze(v.assignment.target.name)
    v.variable = new Variable(i, v.type)
    this.add(i, v.variable)
    v.source = this.analyze(v.assignment.source)
    delete v.assignment
    delete v.type
    return v
  }
  VarDec(d) {
    d.variable = new Variable(d.id.name, d.type)
    this.add(d.id.name, d.variable)
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
    return a.list.map((item) => this.analyze(item))
  }
  Assignment(a) {
    a.target = this.analyze(a.target)
    a.source = this.analyze(a.source)
    return a
  }
  ArrayVar(a) {
    this.lookup(a.id.name)
    a.id = this.analyze(a.id)
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
    return a.map((item) => this.analyze(item))
  }
  IdExp(i) {
    return this.lookup(i.name)
  }
  String(node) {
    return node
  }
}

export default function analyze(node) {
  return new Context().analyze(node)
}
