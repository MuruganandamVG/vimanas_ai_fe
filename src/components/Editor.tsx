// components/FullPageEditor.tsx

import React, { useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import type { OnMount } from "@monaco-editor/react";

type FullPageEditorProps = {
  language: string;
  value: string;
  onChange: (value: string | undefined) => void;
  theme?: "vs-dark" | "light";
};

const FullPageEditor: React.FC<FullPageEditorProps> = ({
  language,
  value,
  onChange,
  theme = "vs-dark",
}) => {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  return (
    <Editor
      height="calc(100vh - 100px)"
      defaultLanguage={language}
      value={value}
      theme={theme}
      onChange={onChange}
      onMount={handleEditorDidMount}
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        automaticLayout: true,
        formatOnType: true,
        formatOnPaste: true,
        wordWrap: "on",
        scrollBeyondLastLine: false,
        lineNumbers: "on",
      }}
    />
  );
};

// ✅ Parent wrapper component
const FullPageEditorWrapper = () => {
  const [code, setCode] = useState<string>(
    `function greet() {\n  console.log("Hello, world!");\n}`
  );
  const [language, setLanguage] = useState<string>("javascript");

  const instructions = `Welcome to the coding editor!
- Choose your preferred language from the dropdown.
- Write your code in the editor below.
- All changes are saved in memory for now.
Happy coding!`;

  const languages = [
    "javascript",
    "typescript",
    "python",
    "cpp",
    "java",
    "csharp",
    "go",
    "rust",
  ];

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        backgroundColor: "#1e1e1e",
        color: "#fff",
      }}
    >
      {/* Top Bar */}
      <div
        style={{
          height: "100px",
          padding: "16px",
          borderBottom: "1px solid #333",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#1e1e1e",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ margin: 0 }}>AI Coding Interview Editor</h2>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              backgroundColor: "#252526",
              color: "#fff",
              border: "1px solid #3c3c3c",
              padding: "8px 12px",
              fontSize: "14px",
              borderRadius: "4px",
            }}
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <pre
          style={{
            marginTop: "10px",
            fontSize: "13px",
            whiteSpace: "pre-wrap",
            color: "#ccc",
          }}
        >
          {instructions}
        </pre>
      </div>

      {/* Monaco Editor */}
      <FullPageEditor
        language={language}
        value={code}
        onChange={(updatedCode) => setCode(updatedCode || "")}
        theme="vs-dark"
      />
    </div>
  );
};

export default FullPageEditorWrapper;
