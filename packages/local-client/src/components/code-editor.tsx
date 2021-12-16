import MonacoEditor, { EditorDidMount } from "@monaco-editor/react"
import prettier from "prettier"
import parser from "prettier/parser-babel"
import { useRef } from "react"

import codeShift from "jscodeshift"
import HighLighter from "monaco-jsx-highlighter"

import "./code-editor.css"
import "./code-editor-syntax.css"

declare module "monaco-jsx-highlighter"

interface CodeEditorProps {
  initialValue: string
  onChange(value: string): void
}

const CodeEditor: React.FC<CodeEditorProps> = ({ onChange, initialValue }) => {
  const editorRef = useRef<any>()

  // only invoked when the editor display on the screen
  const onEditorDidMount: EditorDidMount = (getValue, monacoEditor) => {
    editorRef.current = monacoEditor
    // whenever the editor content is updated in someway
    monacoEditor.onDidChangeModelContent(() => {
      onChange(getValue())
    })

    monacoEditor.getModel()?.updateOptions({
      tabSize: 2,
    })

    // Syntax Highlighted non official packages
    const highlighter = new HighLighter(
      // @ts-ignore
      window.monaco,
      codeShift,
      monacoEditor
    )
    // to avoid the console.log for error syntax on change
    highlighter.highLightOnDidChangeModelContent(
      () => {},
      () => {},
      undefined,
      () => {}
    )
  }

  const onFormatClick = () => {
    // get current value from editor
    const unformatted = editorRef.current.getModel().getValue()
    //format that value
    const formatted = prettier
      .format(unformatted, {
        parser: "babel",
        plugins: [parser],
        useTabs: false,
        semi: false,
        singleQuote: true,
      })
      .replace(/\n$/, "")
    // set the formatted value back to the editor
    editorRef.current.setValue(formatted)
  }

  return (
    <div className="editor-wrapper">
      <button
        className="button button-format is-link is-small"
        onClick={onFormatClick}
      >
        Format
      </button>
      <MonacoEditor
        editorDidMount={onEditorDidMount}
        value={initialValue}
        language="javascript"
        theme="dark"
        height="100%"
        options={{
          wordWrap: "on",
          minimap: { enabled: false },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 14,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          fontLigatures: true,
          fontFamily: "'Fira Code', monospace",
          smoothScrolling: true,
          renderLineHighlight: "line",
          renderLineHighlightOnlyWhenFocus: true,
        }}
      />
    </div>
  )
}

export default CodeEditor
