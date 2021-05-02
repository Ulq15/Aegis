import assert from "assert/strict"
import optimize from "../src/optimizer.js"
import * as AST from "../src/ast.js"

const zero = new AST.Literal(0, AST.Type.NUM)
const one = new AST.Literal(1, AST.Type.NUM)
const two = new AST.Literal(2, AST.Type.NUM)
const three = new AST.Literal(3, AST.Type.NUM)
const five = new AST.Literal(5, AST.Type.NUM)
const eight = new AST.Literal(8, AST.Type.NUM)

const x = new AST.Variable(AST.Type.NUM, Symbol.for("x"))
const z = new AST.Variable(AST.Type.NUM, Symbol.for("z"))
const pp = new AST.Operator("++")
const mm = new AST.Operator("--")
const p = new AST.Operator("+")
const m = new AST.Operator("-")
const t = new AST.Operator("*")
const d = new AST.Operator("/")
const pow = new AST.Operator("**")
const le = new AST.Operator("<=")
const ge = new AST.Operator(">=")
const ne = new AST.Operator("!=")
const eq = new AST.Operator("==")
const l = new AST.Operator("<")
const g = new AST.Operator(">")
const not = new AST.Operator("!")
const orOp = new AST.Operator("|")
const andOp = new AST.Operator("&")
const xpp = new AST.PostfixExpression(x, pp)
const xmm = new AST.PostfixExpression(x, mm)
const return1p1 = new AST.ReturnStatement(new AST.BinaryExpression(p, one, one))
const return2 = new AST.ReturnStatement(two)
const returnX = new AST.ReturnStatement(x)
const onePlusTwo = new AST.BinaryExpression(p, one, two)
const or = (...d) => d.reduce((x, y) => new AST.BinaryExpression(orOp, x, y))
const and = (...c) => c.reduce((x, y) => new AST.BinaryExpression(andOp, x, y))
const less = (x, y) => new AST.BinaryExpression(l, x, y)
const equal = (x, y) => new AST.BinaryExpression(eq, x, y)
const times = (x, y) => new AST.BinaryExpression(t, x, y)
const neg = x => new AST.UnaryExpression(m, x)
const array = (...elements) => new AST.ArrayLiteral(elements)
const sub = (a, e) => new AST.ArrayAccess(a, e)
const conditional = (ifS, elif, el) => new AST.Conditional(ifS, elif, el)
//check these
const identity = AST.FunDec(Symbol.for("id"), [z], AST.Type.NUM, returnX)
const intFun = body => new AST.FunDec(Symbol.for("id"), [], AST.Type.NUM, body)
const callIdentity = args => new AST.FunCall(identity, args)

const tests = [
  ["folds +", new AST.BinaryExpression(p, five, eight), new AST.Literal(13, AST.Type.NUM)],
  ["folds -", new AST.BinaryExpression(m, five, eight), new AST.Literal(-3, AST.Type.NUM)],
  ["folds *", new AST.BinaryExpression(t, five, eight), new AST.Literal(40, AST.Type.NUM)],
  ["folds /", new AST.BinaryExpression(d, five, eight), new AST.Literal(0.625, AST.Type.DECI)],
  ["folds **", new AST.BinaryExpression(pow, five, eight), new AST.Literal(390625, AST.Type.NUM)],
  ["folds <", new AST.BinaryExpression(l, five, eight), true],
  ["folds <=", new AST.BinaryExpression(le, five, eight), true],
  ["folds ==", new AST.BinaryExpression(eq, five, eight), false],
  ["folds !=", new AST.BinaryExpression(ne, five, eight), true],
  ["folds >=", new AST.BinaryExpression(ge, five, eight), false],
  ["folds >", new AST.BinaryExpression(g, five, eight), false],
  ["optimizes +0", new AST.BinaryExpression(p, x, zero), x],
  ["optimizes -0", new AST.BinaryExpression(m, x, zero), x],
  ["optimizes *1", new AST.BinaryExpression(t, x, 1), x],
  ["optimizes /1", new AST.BinaryExpression(d, x, 1), x],
  ["optimizes *0", new AST.BinaryExpression(t, x, zero), zero],
  ["optimizes 0*", new AST.BinaryExpression(t, zero, x), zero],
  ["optimizes 0/", new AST.BinaryExpression(d, zero, x), zero],
  ["optimizes 0+", new AST.BinaryExpression(p, zero, x), x],
  ["optimizes 0-", new AST.BinaryExpression(m, zero, x), neg(x)],
  ["optimizes 1*", new AST.BinaryExpression(t, one, x), x],
  ["folds negation", new AST.PrefixExpression(m, eight), new AST.Literal(-8, AST.Type.NUM)],
  ["optimizes 1**", new AST.BinaryExpression(pow, one, x), one],
  ["optimizes **0", new AST.BinaryExpression(pow, x, zero), one],
  ["removes left false from |", or(false, less(x, one)), less(x, one)],
  ["removes right false from |", or(less(x, one), false), less(x, one)],
  ["removes left true from &", and(true, less(x, one)), less(x, one)],
  ["removes right true from &", and(less(x, one), true), less(x, one)],
  ["removes x=x at beginning", [new AST.Assignment(x, x), xpp], [xpp]],
  ["removes x=x at end", [xpp, new AST.Assignment(x, x)], [xpp]],
  ["removes x=x in middle", [xpp, new AST.Assignment(x, x), xpp], [xpp, xpp]],
  ["optimizes if-true", conditional(new AST.ConditionalIF(true, xpp), [], new AST.ConditionalELSE(xmm)), xpp],
  ["optimizes if-false", conditional(new AST.ConditionalIF(false, xpp), [], new AST.ConditionalELSE(xmm)), xmm],
  ["optimizes while-false", [new AST.Loop(false, xpp)], []],
  ["optimizes for-false", [new AST.DoLoop(x, equal(x, new AST.Literal(10, AST.Type.NUM)), xpp)], []],
  ["optimizes in functions", intFun(return1p1), intFun(return2)],
  ["optimizes in subscripts", sub(x, onePlusTwo), sub(x, three)],
  [
    "optimizes in array literals",
    array(zero, onePlusTwo, new AST.Literal(9, AST.Type.NUM)),
    array(zero, three, new AST.Literal(9, AST.Type.NUM))
  ],
  ["optimizes in arguments", callIdentity([times(three, five)]), callIdentity([new AST.Literal(15, AST.Type.NUM)])]
  // [
  //   "passes through nonoptimizable constructs",
  //   ...Array(2).fill([
  //     new AST.Program([new AST.ShortReturnStatement()]),
  //     new AST.VarInitializer(Type.NUM, new AST.Assignment(x, z)),
  //     new AST.Assignment(x, new AST.BinaryExpression(t, x, z)),
  //     new AST.Assignment(x, new AST.PrefixExpression(not, x)),
  //     new AST.WhileStatement(true, [new AST.BreakStatement()]),
  //     conditional(x, 1, 2),
  //     unwrapElse(some(x), 7),
  //     new AST.IfStatement(x, [], []),
  //     new AST.ForStatement(x, array(1, 2, 3), []),
  //   ]),
  // ],
]

describe("The optimizer", () => {
  for (const [scenario, before, after] of tests) {
    it(`${scenario}`, () => {
      assert.deepEqual(optimize(before), after)
    })
  }
})
