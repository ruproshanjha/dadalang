import { useState } from "react";
// Sidebar navigation items
const sections = [
  { id: "intro", label: "Introduction" },
  { id: "syntax", label: "Syntax" },
  { id: "variables", label: "Variables" },
  { id: "input", label: "Input" },
  { id: "output", label: "Output" },
  { id: "operators", label: "Operators" },
  { id: "conditionals", label: "Conditionals" },
  { id: "loops", label: "Loops" },
  { id: "functions", label: "Functions" },
  { id: "examples", label: "Examples" },
];

// --- CodeBlock component ---
const CodeBlock = ({ code }: { code: string }) => (
  <pre
    style={{
      background: "#232323",
      color: "#B5CEA8",
      padding: "1em",
      borderRadius: 8,
      fontSize: 15,
      margin: "1.2em 0",
      overflowX: "auto",
      lineHeight: 1.6,
      maxWidth: "100%",
    }}
  >
    <code
      style={{
        fontFamily: "'Fira Code', 'Source Code Pro', Consolas, monospace",
      }}
    >
      {code}
    </code>
  </pre>
);

// --- DocsContent component ---
function DocsContent({ section }: { section: string }) {
  const paragraphStyle = {
    margin: "1em 0",
    lineHeight: 1.7,
    fontSize: 17,
    maxWidth: 700,
  };
  const headingStyle = { color: "#CB2D6F", fontWeight: 700, marginBottom: 12 };
  const subheadingStyle = {
    color: "#14A098",
    fontWeight: 600,
    marginTop: 24,
    marginBottom: 8,
  };

  switch (section) {
    case "intro":
      return (
        <>
          <h1 style={{ fontSize: 36, ...headingStyle }}>
            দাদাLang Documentation
          </h1>
          <p style={paragraphStyle}>
            <b>দাদাLang</b> is a Bengali-inspired programming language designed
            to make coding expressive, intuitive, and fun. It combines familiar
            programming concepts with Bengali keywords and syntax to help native
            speakers learn programming naturally.
          </p>
          <p style={paragraphStyle}>
            This documentation provides detailed explanations of language
            features, syntax rules, and practical examples to get you started
            quickly.
          </p>
        </>
      );
    case "syntax":
      return (
        <>
          <h2 style={{ fontSize: 28, ...headingStyle }}>Program Structure</h2>
          <p style={paragraphStyle}>
            Every দাদাLang program must start with <code>nomoshkar dada</code>{" "}
            and end with <code>jachchhi dada</code>. These statements mark the
            beginning and end of your program.
          </p>
          <p style={paragraphStyle}>
            Inside these, you write your code using দাদাLang syntax.
          </p>
          <CodeBlock
            code={`nomoshkar dada

// Your code goes here

jachchhi dada`}
          />
        </>
      );
    case "variables":
      return (
        <>
          <h2 style={{ fontSize: 28, ...headingStyle }}>Variables</h2>
          <p style={paragraphStyle}>
            Variables store values that you can use and manipulate. Declare a
            variable using <code>dada ei je</code> followed by the variable
            name, an equals sign, and the initial value.
          </p>
          <CodeBlock code={`dada ei je x = 10;`} />
          <p style={paragraphStyle}>
            You can reassign a variable by simply using its name followed by an
            equals sign and the new value:
          </p>
          <CodeBlock code={`x = 20;`} />
          <p style={paragraphStyle}>
            Variable names should be meaningful and follow standard naming
            conventions (letters, numbers, and underscores).
          </p>
        </>
      );
    case "input":
      return (
        <>
          <h2 style={{ fontSize: 28, ...headingStyle }}>Input</h2>
          <p style={paragraphStyle}>
            To get input from the user, use the <code>porashona dada</code>{" "}
            statement followed by the variable name. This will prompt the user
            to enter a value, which will be stored in the variable.
          </p>
          <CodeBlock code={`porashona dada name;`} />
          <p style={paragraphStyle}>
            For example, you can ask the user for their name and then use it in
            your program.
          </p>
        </>
      );
    case "output":
      return (
        <>
          <h2 style={{ fontSize: 28, ...headingStyle }}>Output</h2>
          <p style={paragraphStyle}>
            Use <code>bolo dada</code> to print messages or variable values to
            the output console.
          </p>
          <CodeBlock code={`bolo dada "Hello, world!";`} />
          <p style={paragraphStyle}>
            You can also print the value of variables:
          </p>
          <CodeBlock code={`bolo dada x;`} />
        </>
      );
    case "operators":
      return (
        <>
          <h2 style={{ fontSize: 28, ...headingStyle }}>Operators</h2>
          <p style={paragraphStyle}>
            দাদাLang supports standard arithmetic and comparison operators:
          </p>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: 20,
            }}
          >
            <thead>
              <tr style={{ borderBottom: "1px solid #444" }}>
                <th style={{ textAlign: "left", padding: "8px" }}>Operator</th>
                <th style={{ textAlign: "left", padding: "8px" }}>
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["+", "Addition"],
                ["-", "Subtraction"],
                ["*", "Multiplication"],
                ["/", "Division"],
                ["==", "Equality"],
                ["!=", "Not equal"],
                ["<", "Less than"],
                ["<=", "Less than or equal"],
                [">", "Greater than"],
                [">=", "Greater than or equal"],
              ].map(([op, desc]) => (
                <tr key={op} style={{ borderBottom: "1px solid #333" }}>
                  <td
                    style={{
                      padding: "8px",
                      fontFamily: "'Fira Code', monospace",
                    }}
                  >
                    <code>{op}</code>
                  </td>
                  <td style={{ padding: "8px" }}>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={paragraphStyle}>Example usage:</p>
          <CodeBlock code={`dada ei je sum = x + y;`} />
        </>
      );
    case "conditionals":
      return (
        <>
          <h2 style={{ fontSize: 28, ...headingStyle }}>Conditionals</h2>
          <p style={paragraphStyle}>
            Use <code>jodi dada</code> for <code>if</code> statements,{" "}
            <code>nahole jodi dada</code> for <code>else if</code>, and{" "}
            <code>nahole dada</code> for <code>else</code> blocks.
          </p>
          <p style={paragraphStyle}>
            This allows you to execute different code based on conditions.
          </p>
          <CodeBlock
            code={`jodi dada x > 10 {
  bolo dada "Big!";
} nahole jodi dada x > 5 {
  bolo dada "Medium!";
} nahole dada {
  bolo dada "Small!";
}`}
          />
        </>
      );
    case "loops":
      return (
        <>
          <h2 style={{ fontSize: 28, ...headingStyle }}>Loops</h2>
          <p style={paragraphStyle}>
            Loops let you repeat code multiple times.
          </p>
          <h3 style={subheadingStyle}>
            While Loop (<code>jotokhon dada</code>)
          </h3>
          <p style={paragraphStyle}>
            Repeats the block while a condition is true.
          </p>
          <CodeBlock
            code={`jotokhon dada x < 5 {
  bolo dada x;
  x = x + 1;
}`}
          />
          <h3 style={subheadingStyle}>
            For Loop (<code>joto bar dada</code>)
          </h3>
          <p style={paragraphStyle}>
            Repeats the block a specific number of times.
          </p>
          <CodeBlock
            code={`joto bar dada dada ei je i = 0; i < 5; i = i + 1; {
  bolo dada i;
}`}
          />
        </>
      );
    case "functions":
      return (
        <>
          <h2 style={{ fontSize: 28, ...headingStyle }}>Functions</h2>
          <p style={paragraphStyle}>
            Define reusable code blocks with <code>dada kaj</code>.
          </p>
          <CodeBlock
            code={`dada kaj jog(x, y) {
  phiriye dao x + y;
}`}
          />
          <p style={paragraphStyle}>
            Call functions by their name with arguments:
          </p>
          <CodeBlock code={`bolo dada jog(2, 3);`} />
        </>
      );
    case "examples":
      return (
        <>
          <h2 style={{ fontSize: 28, ...headingStyle }}>Examples</h2>
          <h3 style={subheadingStyle}>Hello World</h3>
          <CodeBlock
            code={`nomoshkar dada

bolo dada "Hello, world!";

jachchhi dada`}
          />
          <h3 style={subheadingStyle}>Sum of Two Numbers</h3>
          <CodeBlock
            code={`nomoshkar dada

porashona dada a;
porashona dada b;
dada ei je sum = a + b;
bolo dada "Sum:";
bolo dada sum;

jachchhi dada`}
          />
        </>
      );
    default:
      return null;
  }
}

export default function Documentation() {
  const [active, setActive] = useState("intro");

  return (
    <div
      style={{
        background: "#1E1E1E",
        color: "#D4D4D4",
        fontFamily: "'Fira Code', 'Source Code Pro', Consolas, monospace",
        minHeight: "100vh",
        display: "flex",
      }}
    >
      {/* Sidebar */}
      <nav
        style={{
          width: 220,
          background: "#232323",
          borderRight: "1px solid #282828",
          padding: "2rem 1rem 1rem 1rem",
          position: "sticky",
          top: 0,
          height: "100vh",
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: 22,
            marginBottom: 32,
            color: "#CB2D6F",
            letterSpacing: 1,
          }}
        >
          <span style={{ color: "#14A098", fontWeight: 400 }}>‎ </span>
        </div>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {sections.map((s) => (
            <li key={s.id}>
              <button
                onClick={() => setActive(s.id)}
                style={{
                  background: active === s.id ? "#282828" : "none",
                  color: active === s.id ? "#CB2D6F" : "#D4D4D4",
                  border: "none",
                  width: "100%",
                  textAlign: "left",
                  padding: "0.7em 1em",
                  borderRadius: 6,
                  fontWeight: active === s.id ? 700 : 400,
                  fontSize: 16,
                  cursor: "pointer",
                  marginBottom: 2,
                  transition: "background .2s",
                }}
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center", // centers vertically
          alignItems: "center", // centers horizontally
          padding: "2.5rem 2rem",
          overflowY: "auto", // allows scrolling if content is tall
        }}
      >
        <div style={{ maxWidth: 700, width: "100%" }}>
          <DocsContent section={active} />
        </div>
      </main>
    </div>
  );
}
