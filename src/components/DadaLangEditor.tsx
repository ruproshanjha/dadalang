import Editor, { useMonaco } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { useEffect, useState } from "react";

type DadaLangEditorProps = {
  code: string;
  setCode: (v: string) => void;
};

const DADALANG_KEYWORDS = [
  "nomoshkar dada",
  "jachchhi dada",
  "dada ei je",
  "bolo dada",
  "porashona dada",
  "jodi dada",
  "nahole jodi dada",
  "nahole dada",
  "jotokhon dada",
  "joto bar dada",
  "dada kaj",
  "phiriye dao",
];

const monarchTokensProvider = {
  tokenizer: {
    root: [
      [/"([^"\\]|\\.)*$/, "string.invalid"],
      [/"/, { token: "string.quote", bracket: "@open", next: "@string" }],
      [/\/\/.*$/, "comment"],
      [
        new RegExp(
          DADALANG_KEYWORDS.map((k) => k.replace(/ /g, "\\s+")).join("|")
        ),
        "keyword",
      ],
      [/\b\d+\b/, "number"],
      [/[a-zA-Z_][a-zA-Z0-9_]*/, "identifier"],
      [/[\=\+\-\*\/\<\>\!\;]+/, "operator"],
      [/[{}()\[\]]/, "@brackets"],
    ] as monaco.languages.IMonarchLanguageRule[],
    string: [
      [/[^\\"]+/, "string"],
      [/\\./, "string.escape"],
      [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }],
    ] as monaco.languages.IMonarchLanguageRule[],
  },
};

export default function DadaLangEditor({ code, setCode }: DadaLangEditorProps) {
  const monacoInstance = useMonaco();
  const [themeReady, setThemeReady] = useState(false);

  useEffect(() => {
    if (monacoInstance) {
      if (
        !monacoInstance.languages
          .getLanguages()
          .some((l) => l.id === "dadalang")
      ) {
        monacoInstance.languages.register({ id: "dadalang" });
        monacoInstance.languages.setMonarchTokensProvider(
          "dadalang",
          monarchTokensProvider
        );
      }

      monacoInstance.editor.defineTheme("leetcode-dark", {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "keyword", foreground: "569CD6" },
          { token: "string", foreground: "D69D85" },
          { token: "number", foreground: "B5CEA8" },
          { token: "comment", foreground: "6A9955" },
          { token: "operator", foreground: "D4D4D4" },
          { token: "identifier", foreground: "9CDCFE" },
        ],
        colors: {
          "editor.background": "#1E1E1E",
          "editor.foreground": "#D4D4D4",
          "editorLineNumber.foreground": "#858585",
          "editorCursor.foreground": "#AEAFAD",
        },
      });

      setThemeReady(true);
    }
  }, [monacoInstance]);

  if (!themeReady) return null;

  return (
    <Editor
      height="320px"
      language="dadalang"
      theme="leetcode-dark"
      value={code}
      onChange={(v) => setCode(v ?? "")}
      options={{
        fontFamily: "'Fira Code', monospace",
        fontSize: 15,
        minimap: { enabled: false },
        lineNumbers: "on",
        wordWrap: "on",
        scrollbar: { vertical: "hidden", horizontal: "hidden" },
        overviewRulerLanes: 0,
        renderLineHighlight: "all",
        scrollBeyondLastLine: false,
        smoothScrolling: true,
        cursorBlinking: "expand",
        cursorSmoothCaretAnimation: "on",
        bracketPairColorization: { enabled: true },
      }}
    />
  );
}
