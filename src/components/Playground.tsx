import { useState } from "react";
import { useRef } from "react";
import StarfieldBackground from "./StarfieldBackground";
import DadaLangEditor from "./DadaLangEditor";
import { tokenize } from "../dadalang/lexer";
import { Parser } from "../dadalang/parser";
import { Interpreter } from "../dadalang/interpreter";

const defaultCode = `nomoshkar dada

bolo dada "What's your name?";
porashona dada name;
bolo dada "Nomoskar, ";
bolo dada name;

jachchhi dada`;

export default function Playground() {
  const [code, setCode] = useState(defaultCode);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [inputPrompt, setInputPrompt] = useState<string | null>(null);
  const inputResolveRef = useRef<((value: string) => void) | null>(null);

  // Output callback for interpreter
  const handleOutput = (msg: string) => setOutput((prev) => prev + msg + "\n");

  // Input callback for interpreter (returns a Promise that resolves when user submits input)
  const handleInput = (prompt: string) => {
    setInputPrompt(prompt);
    return new Promise<string>((resolve) => {
      inputResolveRef.current = resolve;
    });
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const value = (form.elements.namedItem("userInput") as HTMLInputElement)
      .value;
    if (inputResolveRef.current) {
      inputResolveRef.current(value);
    }
    setInputPrompt(null);
  };

  async function handleRun() {
    setIsRunning(true);
    setOutput("");
    setInputPrompt(null);

    try {
      // 1. Tokenize
      const tokens = tokenize(code);

      // 2. Parse
      const parser = new Parser(tokens);
      const ast = parser.parse();

      // 3. Run interpreter (async)
      const interpreter = new Interpreter();
      interpreter.onOutput = handleOutput;
      interpreter.onInput = handleInput; // <-- for async input

      await interpreter.run(ast); // <-- await async run
    } catch (err: any) {
      setOutput((prev) => prev + `\nError: ${err.message || err}`);
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <div
      className="relative min-h-screen flex flex-col justify-between overflow-hidden"
      style={{
        background: "#1E1E1E",
        fontFamily: "'Fira Code', 'Source Code Pro', Consolas, monospace",
        color: "#D4D4D4",
      }}
    >
      <StarfieldBackground />
      <main className="flex-1 flex flex-col items-center justify-center z-10 pt-20 pb-16">
        <div className="flex flex-col md:flex-row gap-10 w-full max-w-6xl items-stretch">
          {/* Editor Card */}
          <div
            className="flex-1 rounded-3xl shadow-2xl p-6 flex flex-col min-w-0 border border-[#282828] backdrop-blur-md"
            style={{ background: "#232323" }}
          >
            <div
              className="mb-3 text-[#CB2D6F] text-lg font-bold tracking-wide"
              style={{ fontFamily: "'Fira Code', monospace" }}
            >
              Editor
            </div>
            <DadaLangEditor code={code} setCode={setCode} />
            <div className="flex gap-3 mt-4">
              <button
                aria-label="Reset code"
                onClick={() => setCode(defaultCode)}
                className="px-4 py-1 bg-[#282828] text-[#fff] rounded-lg hover:bg-[#CB2D6F] transition font-bold"
                style={{ fontFamily: "'Fira Code', monospace" }}
              >
                Reset
              </button>
              <button
                aria-label="Copy code"
                onClick={() => navigator.clipboard.writeText(code)}
                className="px-4 py-1 bg-[#14A098] text-[#fff] rounded-lg hover:bg-[#CB2D6F] transition font-bold"
                style={{ fontFamily: "'Fira Code', monospace" }}
              >
                Copy
              </button>
            </div>
          </div>
          {/* Output Card */}
          <div
            className="flex-1 rounded-3xl shadow-2xl p-6 flex flex-col border border-[#282828] backdrop-blur-md"
            style={{ background: "#232323" }}
          >
            <div
              className="mb-3 text-[#14A098] text-lg font-bold tracking-wide"
              style={{ fontFamily: "'Fira Code', monospace" }}
            >
              Output
            </div>
            <pre
              className="flex-1 bg-[#1E1E1E] rounded-lg p-4 font-mono whitespace-pre-wrap overflow-auto min-h-[220px] max-h-[320px] text-base"
              style={{
                fontFamily:
                  "'Fira Code', 'Source Code Pro', Consolas, monospace",
                color: "#D4D4D4",
              }}
            >
              {output || "Output will appear here..."}
            </pre>
            {inputPrompt && (
              <form
                onSubmit={handleInputSubmit}
                className="mt-4 flex gap-2 items-center"
              >
                <label className="text-[#CCCCCC]">{inputPrompt}</label>
                <input
                  type="text"
                  name="userInput"
                  autoFocus
                  aria-label="DadaLang user input"
                  className="bg-[#18181B] border border-[#CB2D6F] text-[#fff] rounded px-3 py-1"
                  style={{ fontFamily: "'Fira Code', monospace" }}
                />
                <button
                  type="submit"
                  className="px-4 py-1 bg-[#CB2D6F] text-[#fff] rounded hover:bg-[#14A098] transition font-bold"
                  style={{ fontFamily: "'Fira Code', monospace" }}
                >
                  Submit
                </button>
              </form>
            )}
            <button
              onClick={handleRun}
              disabled={isRunning || !!inputPrompt}
              className="mt-6 px-8 py-2 bg-[#CB2D6F] text-white rounded-2xl shadow-lg text-lg font-bold hover:scale-105 transition-all border-2 border-[#501F3A] self-end"
              style={{ fontFamily: "'Fira Code', monospace" }}
            >
              {isRunning ? "Running..." : "Run"}
            </button>
          </div>
        </div>
      </main>
      <footer className="w-full flex flex-col items-center mb-8 z-10">
        <div
          className="text-[#CCCCCC] text-sm text-center"
          style={{ fontFamily: "'Fira Code', monospace" }}
        >
          Made with <span className="text-[#CB2D6F]">♥</span> by{" "}
          <a
            href="https://www.linkedin.com/in/ruproshanjha/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[#CB2D6F] no-underline"
            style={{ textDecoration: "none" }}
          >
            @ruproshnjha
          </a>{" "}
          from the city of joy.
        </div>
      </footer>
    </div>
  );
}
