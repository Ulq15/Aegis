import assert from "assert"
import parse from "../src/parser.js"
import analyze from "../src/analyzer.js"
import generate from "../src/generator.js"

const classOpen = "CLASS TestClass:\n"
const funcOpen = "testMethod():\n"
const close = "\nEND"

function dedent(s) {
  return `${s}`.replace(/(?<=\n)\s+/g, "").trim()
}

const fixtures = [
  {
    name: "small",
    source: `
      NUM y = 3;
      NUM x = 3 * y;
      x++;
      y--;
      BOOL z = FALSE;
      x = 3 * 3 + 2;
      y = -3 * 3 / 22 - 16;
      OUTPUT("Hello World");
    `,
    expected: dedent`
      let y_1 = 3;
      let x_2 = 3 * y_1;
      x_2++;
      y_1--;
      let z_3 = false;
      x_2 = ((3 * 3) + 2);
      y_1 = ((((-3) * 3) / 22) - 16);
      console.log("Hello World");
    `
  },
  {
    name: "if",
    source: `
      NUM x = 1;

      IF(x == 1):
        OUTPUT(1);
        END

      IF(x == 1):
        OUTPUT(1);
      ELSE:
        OUTPUT(2);
        END

      IF(x == 1):
        OUTPUT(1);
      ELSEIF(x != 1):
        OUTPUT(2);
        END

      IF(x == 1):
        OUTPUT(1);
      ELSEIF(x == 2):
        OUTPUT(2);
      ELSE:
        OUTPUT(3);
        END
    `,
    expected: dedent`
      let x_1 = 1;

      if(x_1 === 1) {
        console.log(1);
      }

      if(x_1 === 1) {
        console.log(1);
      } else {
        console.log(2);
      }

      if(x_1 === 1) {
        console.log(1);
      } else if(x_1 !== 1) {
        console.log(2);
      }

      if(x_1 === 1) {
        console.log(1);
      } else if(x_1 === 2) {
        console.log(2);
      } else {
        console.log(3);
      }
    `
  },
  {
    name: "while",
    source: `
      NUM x = 10;
      LOOP(x >= 0):
        NUM y = 5;
        LOOP(y >= 0):
          OUTPUT("y is " + y);
          y--;
          END
        OUTPUT("x is " + x);
        x--;
        END
    `,
    expected: dedent`
      let x_1 = 10;
      while(x_1 >= 0) {
        let y_2 = 5;
        while(y_2 >= 0) {
        	console.log("y is " + y_2);
          y_2--;
        }
        console.log("x is " + x_1);
        x_1--;
      }
    `
  },
  {
    name: "for",
    source: `
      DO(NUM i = 1, i <= 10, i++):
        OUTPUT(i);
        END
    `,
    expected: dedent`
      for(let i_1 = 1; i_1 <= 10; i_1++) {
        console.log(i_1);
      }
    `
  },
  {
    name: "functions",
    source: `
      helloWorld():
  		  OUTPUT("Hello World");
    	  END

      iterativeFib(NUM n):
  		  NUM a = 0;
        NUM b = 1;
        DO(NUM i = 0, i < n, i++):
        	NUM temp = a;
          a = b;
          b = temp + b;
          END
        RETURN a;
	      END

      multipleTypes(NUM n, BOOL x):
        IF(x):
          RETURN n;
          END
        END

      returnType(NUM n, BOOL x)NUM:
        IF(x):
          RETURN n;
          END
        END

    `,
    expected: dedent`
      function helloWorld() {
        console.log("Hello World");
      }

      function iterativeFib(n_1) {
        let a_2 = 0;
        let b_3 = 1;
        for (let i_4 = 0; i_4 < n_1; i_4++) {
          let temp_5 = a_2;
          a_2 = b_3;
          b_3 = temp_5 + b_3;
        }
        return a_2;
      }

      function multipleTypes(n_1, x_2) {
        if(x_2) {
          return n_1;
        }
      }

      function returnType(n_1, x_2) {
        if(x_2) {
          return n_1;
        }
      }
    `
  },
  {
    name: "arrays",
    source: `
      NUM{} array1 = {10, 100, 1000, 10000};
      BOOL{} array2 = {true, false, true};
      NUM array3 = {5};
      NUM array4 = {};
    `,
    expected: dedent`
      let array1_ = [10,100,1000,10000];
      let array2_ = [true,false,true];
      let array3_ = new Array(5);
      let array4_ = [];
    `
  },
  {
    name: "classes",
    source: `
      CLASS ClassDeclaration:
        functionDeclaration():
            OUTPUT("Hello World");
          END
        END
    `,
    expected: dedent`
      class ClassDeclaration {
        functionDeclaration(){
          console.log("Hello World");
        }
      }
    `
  }
]

describe("The code generator", () => {
  for (const fixture of fixtures) {
    it(`produces expected js output for the ${fixture.name} program`, () => {
      const actual = generate(analyze(parse(fixture.source)))
      assert.deepEqual(actual, fixture.expected)
    })
  }
})
