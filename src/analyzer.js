import { Variable, Type, ArrayType, DictionaryType } from "./ast.js"

function must(condition, errorMessage) {
  if (!condition) {
    throw new Error(errorMessage)
  }
}

Object.assign(Type.prototype, {
  isEquivalentTo(target) {
    if (
      (this.description === "NUM" || this.description == "DECI") &&
      (target.description === "NUM" || target.description == "DECI")
    )
      return true
    else return this.description === target.description
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
Type.VOID = Object.assign(new Type(), { description: "VOID" })

const PRIMITIVES = {
  BOOL: Type.BOOL,
  NUM: Type.NUM,
  DECI: Type.DECI,
  CHARS: Type.CHARS,
  VOID: Type.VOID,
  isIn(type) {
    return this[type] != undefined
  }
}
const ARRAYS = {
  BOOL: new ArrayType(Type.BOOL),
  NUM: new ArrayType(Type.NUM),
  DECI: new ArrayType(Type.DECI),
  CHARS: new ArrayType(Type.CHARS)
}

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
      `Expected a number or string, found ${self.type.description}`
    )
  },
  isBoolean() {
    must([Type.BOOL.description].includes(self.type.description), `Expected a boolean, found ${self.type.description}`)
  },
  returnsSomething() {
    must(self.returnType != Type.VOID, `The Function must have a return type that is not VOID to RETURN something`)
  },
  isReturnableFrom(func) {
    check(self).isAssignableTo(func.returnType)
  },
  isInsideAFunction() {
    must(self.function, "Return can only appear in a function")
  },
  isAssignableTo(type) {
    if (type.constructor === ArrayType && self.type === ARRAYS[self.type]) {
      must(
        self.baseType.isAssignableTo(type.baseType),
        `Cannot assign an Array of ${self.baseType.description} to an Array of ${type.baseType.description}`
      )
    } else if (self.type.constructor === DictionaryType) {
      must(
        self.type.isAssignableTo(type.storedType),
        `Cannot assign a ${self.type.description} to an Array of ${type.storedType.description}`
      )
    } else {
      must(self.type.isAssignableTo(type), `Cannot assign a ${self.type.description} to a ${type.description}`)
    }
  },
  allHaveSameType() {
    must(
      self.slice(1).every(e => e.type.isEquivalentTo(self[0].type)),
      "Not all elements have the same type"
    )
  }
})

class Context {
  constructor(context) {
    this.localVars = new Map()
    this.primitives = PRIMITIVES
    this.function = null
  }
  analyze(node) {
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
  Program(p) {
    p.id = p.id.description
    p.classBody = p.classBody.map(bodyStmnts => this.analyze(bodyStmnts))
    this.add(p.id, p.classBody)
    return p
  }
  FunDec(f) {
    f.id = f.id.description
    f.returnType = this.analyze(f.returnType)
    f.parameters = f.parameters.map(params => this.analyze(params))
    this.add(f.id, f)
    this.function = this.lookup(f.id)
    f.body = f.body.map(stmnt => this.analyze(stmnt))
    return f
  }
  FunCall(c) {
    c.callee = this.lookup(c.callee.description)
    c.parameters = c.parameters.map(params => this.analyze(params))
    c.type = c.callee.returnType
    return c
  }
  VarInitializer(v) {
    v.target = new Variable(v.type, v.assignment.target)
    v.target = this.analyze(v.target)
    v.source = this.analyze(v.assignment.source)
    check(v.source).isAssignableTo(v.target.type)
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
    e.op = e.op.map(op => this.analyze(op))
    for (let i = 0; i < e.right.length; i++) {
      if (["+"].includes(e.op[i])) {
        check(e.left).isNumericOrString()
        check(e.right[i]).isNumericOrString()
        check(e.right[i]).isAssignableTo(e.left.type)
        e.type = e.left.type
      } else if (["-", "*", "/", "MOD", "**"].includes(e.op[i])) {
        check(e.left).isNumeric()
        check(e.right[i]).isNumeric()
        check(e.right[i]).isAssignableTo(e.left.type)
        e.type = e.left.type
      } else if (["<", ">", "<=", ">="].includes(e.op[i])) {
        check(e.left).isNumericOrString()
        check(e.right[i]).isNumericOrString()
        e.type = this.primitives["BOOL"]
      } else if (["==", "!="].includes(e.op[i])) {
        e.type = this.primitives["BOOL"]
      } else if (["&", "|"].includes(e.op[i])) {
        check(e.left).isBoolean()
        check(e.right[i]).isBoolean()
        e.type = this.primitives["BOOL"]
      }
    }
    return e
  }
  PrefixExpression(e) {
    e.operand = this.analyze(e.operand)
    e.op = this.analyze(e.op)
    if (["++", "--"].includes(e.op)) {
      check(e.operand).isNumeric()
      e.type = this.primitives["NUM"]
    } else if (e.op === "!") {
      check(e.operand).isBoolean()
      e.type = this.primitives["BOOL"]
    }
    return e
  }
  PostfixExpression(e) {
    e.operand = this.analyze(e.operand)
    e.op = this.analyze(e.op)
    if (["++", "--"].includes(e.op)) {
      check(e.operand).isNumeric()
      e.type = this.primitives["NUM"]
    }
    return e
  }
  ArrayLiteral(a) {
    a.list = a.list.map(item => this.analyze(item))
    check(a.list).allHaveSameType()
    a.baseType = this.primitives[a.list[0].type.description]
    a.type = ARRAYS[a.baseType]
    return a
  }
  Assignment(a) {
    a.target = this.analyze(a.target)
    a.source = this.analyze(a.source)
    check(a.source).isAssignableTo(a.target.type)
    return a
  }
  ArrayAccess(a) {
    a.arrayVar = this.analyze(a.arrayVar)
    a.indexExp = this.analyze(a.indexExp)
    a.type = this.analyze(a.arrayVar.type.baseType)
    return a
  }
  DictionaryAccess(g) {
    g.dictionaryVar = this.analyze(g.dictionaryVar)
    g.key = this.analyze(g.key)
    g.type = g.dictionaryVar.type.storedType
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
    v.type = this.analyze(v.type)
    this.add(v.id, v)
    return this.lookup(v.id)
  }
  Array(a) {
    return a.map(item => this.analyze(item))
  }
  Symbol(node) {
    return this.lookup(node.description)
  }
  Operator(node) {
    return node.symbol
  }
  ArrayType(node) {
    if (this.primitives.isIn(node.baseType.description)) {
      node.baseType = this.primitives[node.baseType.description]
    }
    return node
  }
  DictionaryType(node) {
    if (this.primitives.isIn(node.keyType.description)) {
      node.keyType = this.primitives[node.keyType.description]
    }
    if (this.primitives.isIn(node.storedType.description)) {
      node.storedType = this.primitives[node.storedType.description]
    }
    return node
  }
  Type(node) {
    if (this.primitives.isIn(node.description)) {
      return this.primitives[node.description]
    }
  }
  Literal(node) {
    if (this.primitives.isIn(node.type.description)) {
      node.type = this.primitives[node.type.description]
    }
    return node
  }
}

export default function analyze(node) {
  return new Context().analyze(node)
}
