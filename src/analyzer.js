import { Variable, Type, ArrayType, DictionaryType } from "./ast.js"
/*
function must(condition, errorMessage) {
  if (!condition) {
    throw new Error(errorMessage)
  }
}

Object.assign(Type.prototype, {
  isEquivalentTo(target) {
    return this == target
  },
  isAssignableTo(target) {
    return this.isEquivalentTo(target)
  }
})

Object.assign(ArrayType.prototype, {
  isEquivalentTo(target) {
    return target.constructor === ArrayType && this.baseType.isEquivalentTo(target.baseType)
  },
  isAssignableTo(target) {
    return this.isEquivalentTo(target)
  }
})

Object.assign(DictionaryType.prototype, {
  isEquivalentTo(target) {
    return (
      target.constructor === DictionaryType &&
      this.keyType.isEquivalentTo(target.keyType) &&
      this.storedType.isEquivalentTo(target.storedType)
    )
  },
  isAssignableTo(target) {
    return this.isEquivalentTo(target)
  }
})

Type.BOOL = Object.assign(new Type(), { description: "BOOL" })
Type.NUM = Object.assign(new Type(), { description: "NUM" })
Type.DECI = Object.assign(new Type(), { description: "DECI" })
Type.CHARS = Object.assign(new Type(), { description: "CHARS" })

const check = self => ({
  isNumeric() {
    must([Type.NUM, Type.DECI].includes(self.type), `Expected a number, found ${self.type.description}`)
  },
  isNumericOrString() {
    must(
      [Type.NUM, Type.DECI, Type.CHARS].includes(self.type),
      `Expected a number or string, found ${self.type.description}`
    )
  },
  isBoolean(){
    must([Type.BOOL].includes(self.type), `Expected a boolean, found ${self.type.description}`)
  },
  isInteger(){
    must([Type.NUM].includes(self.type), `Expected an integer, found ${self.type.description}`)
  },
  isAType(){
    must(self instanceof Type, "Type expected")
  },
  isAnArray(){
    must(self.type.constructor === ArrayType, "Array expected")
  },
  isDictionary(){
    must(self.type.constructor === DictionaryType, "Dictionary expected")
  },
  hasSameTypeAs(other){
    must(self.type.isEquivalentTo(other.type), "Operands do not have the same type")
  },
  allHaveSameType(){
    must(
      self.slice(1).every(e => e.type.isEquivalentTo(self[0].type)),
      "Not all elements have the same type"
    )
  },
  isInsideAFunction(context){
    must(self.function, "Return can only appear in a function")
  },
  match(targetTypes){
    must(
      targetTypes.length === self.length,
      `${targetTypes.length} argument(s) required but ${self.length} passed`
    )
    targetTypes.forEach((type, i)=>check(self[i]).isAssignableTo(type))
  },
  isAssignableTo(type){
    must(
      self.type.isEquivalentTo(type), `Cannot assign a ${self.type.description} to a ${type.description}`
    )
  },//CHECK BELOW 4 PROBLEMS
  matchParametersOf(calleeType){
    check(self).match(calleeType.parameters)
  }
})
*/
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
    p.id = p.id.description
    let size = p.classBody.length
    for (let i = 0; i < size; i++) {
      p.classBody[i] = this.analyze(p.classBody[i])
    }
    ///p.classBody.map(bodyStmnts => this.analyze(bodyStmnts))
    this.add(p.id, p.classBody)
    return p
  }
  FunDec(f) {
    f.id = f.id.description
    f.returnType = f.returnType.map(type => type.description)
    f.parameters.map(params => this.analyze(params))
    this.add(f.id, f)
    f.body.map(stmnt => this.analyze(stmnt))
    return f
  }
  FunCall(c) {
    c.callee = c.callee.description
    c.callee = this.lookup(c.callee)
    c.parameters = c.parameters.map(params => this.analyze(params))
    return c
  }
  VarInitializer(v) {
    let i = v.assignment.target
    v.target = new Variable(v.type, i)
    v.target = this.analyze(v.target)
    v.source = this.analyze(v.assignment.source)
    delete v.assignment
    delete v.type
    return v
  }
  VarDec(d) {
    d.variable = new Variable(this.analyze(d.type), d.id.description)
    this.add(d.id.description, d.variable)
    delete d.id
    delete d.type
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
  ArrayAccess(a) {
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
  Variable(v) {
    v.id = v.id.description
    v.type = v.type.description
    this.add(v.id, v)
    return this.lookup(v.id)
  }
  Array(a) {
    return a.map(item => this.analyze(item))
  }
  Symbol(node) {
    //console.log(node)
    return this.lookup(node.description)
  }
  Operator(node) {
    return node.op
  }
  ArrayType(node) {
    return node.description
  }
  DictionaryType(node) {
    return node.description
  }
  Type(node) {
    return node.description
  }
  String(node) {
    return node
  }
}

export default function analyze(node) {
  //console.log(node)
  return new Context().analyze(node)
}
