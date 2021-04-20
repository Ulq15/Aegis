import { Variable, Type, ArrayType, DictionaryType } from "./ast.js"

Type.BOOL = Object.assign(new Type(), { description: "BOOL" })
Type.NUM = Object.assign(new Type(), { description: "NUM" })
Type.DECI = Object.assign(new Type(), { description: "DECI" })
Type.CHARS = Object.assign(new Type(), { description: "CHARS" })
Type.VOID = Object.assign(new Type(), { description: "void" })

function must(condition, errorMessage) {
  if (!condition) {
    throw new Error(errorMessage)
  }
}

Object.assign(Type.prototype, {
  isEquivalentTo(target) {
    return this.description == target.description
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

const check = self => ({
  isNumeric() {
    must(
      [Type.NUM.description, Type.DECI.description].includes(self.type.description),
      `Expected a number, found ${self.type.description}`
    )
  },
  isNumericOrString() {
    must(
      [Type.NUM.description, Type.DECI.description, Type.CHARS.description].includes(self.type.description),
      `Expected a NUM or DECI or CHARS, found ${self.type.description}`
    )
  },
  isBoolean() {
    must([Type.BOOL].includes(self.type), `Expected a boolean, found ${self.type.description}`)
  },
  isInteger() {
    must([Type.NUM].includes(self.type), `Expected an integer, found ${self.type.description}`)
  },
  isAType() {
    must(self instanceof Type, "Type expected")
  },
  isAnArray() {
    must(self.type.constructor === ArrayType, "Array expected")
  },
  isDictionary() {
    must(self.type.constructor === DictionaryType, "Dictionary expected")
  },
  hasSameTypeAs(other) {
    must(self.type.isEquivalentTo(other.type), "Operands do not have the same type")
  },
  allHaveSameType() {
    must(
      self.slice(1).every(e => e.type.isEquivalentTo(self[0].type)),
      "Not all elements have the same type"
    )
  },
  isInsideAFunction() {
    must(self.function, "Return can only appear in a function")
  },
  match(targetTypes) {
    must(targetTypes.length === self.length, `${targetTypes.length} argument(s) required but ${self.length} passed`)
    targetTypes.forEach((type, i) => check(self[i]).isAssignableTo(type))
  },
  isAssignableTo(type) {
    console.log("****" + type + "****")
    must(self.type.isAssignableTo(type), `Cannot assign a ${self.type.description} to a ${type.description}`)
  }, //CHECK BELOW 4 PROBLEMS
  matchParametersOf(calleeType) {
    check(self).match(calleeType.parameters)
  }
})

class Context {
  constructor(parent = null, config = {}) {
    this.parent = parent
    this.localVars = new Map()
    this.function = config.forFunction ?? parent?.function ?? null
  }
  sees(name) {
    return this.localVars.has(name) || this.parent?.sees(name)
  }
  analyze(node) {
    return this[node.constructor.name](node)
  }
  add(name, entity) {
    if (this.sees(name)) {
      throw new Error(`Identifier ${name} already declared`)
    }
    this.localVars.set(name, entity)
  }
  lookup(name) {
    const entity = this.localVars.get(name)
    if (entity) {
      return entity
    } else if (this.parent) {
      return this.parent.lookup(name)
    }
    throw new Error(`Identifier ${name} not declared`)
  }
  newChild(config = {}) {
    return new Context(this, config)
  }
  Program(p) {
    //p.id = p.id.description
    // let size = p.classBody.length
    // for (let i = 0; i < size; i++) {
    //   p.classBody[i] = this.analyze(p.classBody[i])
    // }
    p.classBody.map(bodyStmnts => this.analyze(bodyStmnts))
    //this.add(p.id.description, p.classBody)
    return p
  }
  FunDec(f) {
    f.id = f.id.description
    //f.returnType = f.returnType[0]
    //f.returnType = f.returnType.map(type => type.description)
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
    v.target = new Variable(v.type, v.assignment.target.description)
    this.add(v.target.id, v.target)
    v.assignment = this.analyze(v.assignment)
    v.source = v.assignment.source
    return v
  }
  VarDec(d) {
    d.variable = new Variable(this.analyze(d.type), d.id.description)
    this.add(d.id.description, d.variable)
    return d
  }
  ReturnStatement(r) {
    check(this).isInsideAFunction()
    check(this.function).returnsSomething()
    r.expression = this.analyze(r.expression)
    check(r.expression).isReturnableFrom(this.function)
    return r
  }
  PrintStatement(p) {
    p.argument = this.analyze(p.argument)
    return p
  }
  BinaryExpression(e) {
    e.left = this.analyze(e.left)
    e.right = e.right.map(right => this.analyze(right))
    e.op.map(op => this.analyze(op))
    check(e.right).allHaveSameType()
    let size = e.right.length
    for (let i = 0; i < size; i++) {
      if (e.op[i].symbol === "+") {
        check(e.left).isNumericOrString()
        check(e.left).hasSameTypeAs(e.right[i])
        e.type = e.left.type
      } else if (["-", "*", "/", "MOD", "**"].includes(e.op[i].symbol)) {
        check(e.left).isNumeric()
        check(e.left).hasSameTypeAs(e.right[i])
        e.type = e.left.type
      } else if (["<", ">", "<=", ">="].includes(e.op[i].symbol)) {
        check(e.left).isNumericOrString()
        check(e.left).hasSameTypeAs(e.right[i])
        e.type = Type.BOOL
      } else if (["==", "!="].includes(e.op[i].symbol)) {
        check(e.left).hasSameTypeAs(e.right[i])
        e.type = Type.BOOL
      } else if (["&", "|"].includes(e.op[i].symbol)) {
        check(e.left).isBoolean()
        check(e.right[i]).isBoolean()
        e.type = Type.BOOL
      }
    }
    if (e.type != undefined) {
      return e
    } else {
      throw new Error("Type of binary expression undefined")
    }
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
    console.log(a.source.type.description + " = " + a.target.type)
    check(a.source).isAssignableTo(a.target.type)
    return a
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
  Param(v) {
    let p = new Variable(v.type, v.id)
    this.add(p.id.description, p)
    return this.analyze(p)
  }
  Variable(v) {
    return this.lookup(v.id.description)
  }
  Array(a) {
    return a.map(item => this.analyze(item))
  }
  Symbol(node) {
    return this.lookup(node.description)
  }
  Operator(node) {
    return node
  }
  ArrayType(node) {
    return node.baseType
  }
  DictionaryType(node) {
    return node
  }
  Type(node) {
    return node
  }
  Literal(node) {
    return node
  }
  String(node) {
    return node
  }
}

export default function analyze(node) {
  //console.log(node)
  return new Context().analyze(node)
}
