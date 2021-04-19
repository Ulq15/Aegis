// Code generator from Aegis to JavaScript
// Call the generate(program) function with a program's root node to
// get a JS translation as a String

export default function generate(program) {
  const output = []

  const gen = node => generators[node.constructor.name](node)
  
  const targetName = (mapping => {
    return entity => {
      if (!mapping.has(entity)) {
        mapping.set(entity, mapping.size + 1)
      }
      //NextLine => should it be `${entity.description ?? entity}... or `${entity.id.description ?? entity.id}...
      return `${entity.id.description ?? entity.id}_${mapping.get(entity)}`
    }
  })(new Map())
  
  const makeTabs = ((num, line) =>{
    let tabs = ""
    for(let i =0; i<num; i++){
      tabs+="  "
    }
    line = tabs+line
    return line
  })

  const generators = {
    inLine: 0,
    tabNum:0,
    Program(node) {
      node.classBody.map(body => gen(body))
    },
    FunDec(node) {
      let line = `let ${targetName(node)} = function (${node.parameters.map(params => gen(params))}) {`
      line = makeTabs(this.tabNum, line)
      output.push(line)
      this.tabNum++
      node.body.map(statement => gen(statement))
      this.tabNum--
      output.push(makeTabs(this.tabNum, "}"))
    },
    Param(node) {
      return targetName(node)
    },
    FunCall(node) {
      let line = `${targetName(node.id)}(${node.parameters.map(param=>gen(param)).join(", ")})`
      if(this.inLine===1){
        return line
      }      
      output.push(makeTabs(this.tabNum,line+";"))
    },
    VarInitializer(node) {
      if (this.inLine === 1){
        let t = gen(node.target)
        let s = gen(node.source)
        return(`let ${t} = ${s}`)
      }
      else{
        this.inLine = 1
        let t = gen(node.target)
        let s = gen(node.source)
        this.inLine = 0
        output.push(makeTabs(this.tabNum, `let ${t} = ${s};`))
      }
    },
    VarDec(node) {
      output.push(makeTabs(this.tabNum, `let ${gen(node.variable)};`))
    },
    ReturnStatement(node) {
      output.push(makeTabs(this.tabNum, `return ${gen(node.expression)};`))
    },
    PrintStatement(node) {
      output.push(makeTabs(this.tabNum, `console.log(${gen(node.argument)});`))
    },
    BinaryExpression(node) {
      let line =`${gen(node.left)} `
     
      this.inLine=1
      for(let index =0; index < node.op.length; index++){
        line += `${node.op[index]} ${gen(node.right[index])}`
      }
      this.inLine =0
      return line
    },
    PrefixExpression(node) {
      let line = `${gen(node.op)}${gen(node.operand)}`
      if(this.inLine===1)
        return line
      else
        output.push(makeTabs(this.tabNum, line+";"))
    },
    PostfixExpression(node) {
      let line = `${gen(node.operand)}${gen(node.op)}`
      if(this.inLine===1)
        return line
      else
        output.push(makeTabs(this.tabNum, line+";"))
    },
    Assignment(node) {
      let line = `${gen(node.target)} = ${gen(node.source)}`
      if(this.inLine===1){
        return line
      }
      else{
        output.push(makeTabs(this.tabNum, line+";"))
      }
    },
    ArrayLiteral(node) {
      return `[${gen(node.list).join(", ")}]`
    },
    ArrayVar(node) {
      return `${gen(node.id)}[${gen(node.indexExp)}]`
    },
    DictionaryAccess(node) {
      return `${targetName(node.id)}.${gen(node.key)}`
    },
    Conditional(node) {
      gen(node.ifStatement)
      node.elseIfStatements.map(block=>gen(block))
      node.elseStatement.map(block=>gen(block))
    },
    ConditionalIF(node) {
      output.push(makeTabs(this.tabNum, `if(${gen(node.exp)}) {`))
      this.tabNum++
      node.body.map(stmnt => gen(stmnt))
      this.tabNum--
      output.push(makeTabs(this.tabNum, "}"))
    },
    ConditionalELSEIF(node) {
      output.push(makeTabs(this.tabNum, `else if(${gen(node.exp)}) {`))
      this.tabNum++
      node.body.map(stmnt => gen(stmnt))
      this.tabNum--
      output.push(makeTabs(this.tabNum, "}"))
    },
    ConditionalELSE(node) {
      output.push(makeTabs(this.tabNum, "else {"))
      this.tabNum++
      node.body.map(stmnt => gen(stmnt))
      this.tabNum--
      output.push(makeTabs(this.tabNum, "}"))
    },
    Loop(node) {
      output.push(makeTabs(this.tabNum, `while (${gen(node.condition)}) {`))
      this.tabNum++
      node.body.map(stmnt => gen(stmnt))
      this.tabNum--
      output.push(makeTabs(this.tabNum, "}"))
    },
    DoLoop(node) {
      this.inLine = 1
      output.push(makeTabs(this.tabNum, `for(${gen(node.iterator)}; ${gen(node.range)}; ${gen(node.steps)}) {`))
      this.tabNum++
      this.inLine = 0
      node.body.map(stmnt => gen(stmnt))
      this.tabNum--
      output.push(makeTabs(this.tabNum, "}"))
    },
    Variable(node) {
      return targetName(node)
    },
    String(node) {
      return node
    },
  }

  gen(program)
  return output.join("\n")
}
