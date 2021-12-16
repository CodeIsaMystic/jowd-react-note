import { useEffect, useRef, useState } from "react"
import MDEditor from "@uiw/react-md-editor"
import { useActions } from "../hooks/use-actions"

import "./text-editor.css"
import { Cell } from "../state"

interface TextEditorProps {
  cell: Cell
}

const TextEditor: React.FC<TextEditorProps> = ({ cell }) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const [editing, setEditing] = useState(false)
  const { updateCell } = useActions()

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (
        ref.current &&
        event.target &&
        ref.current.contains(event.target as Node)
      ) {
        // console.log("element clicked inside the editor")
        return
      }
      // console.log("element clicked outside the editor")

      setEditing(false)
    }
    document.addEventListener("click", listener, { capture: true })
    return () => {
      document.removeEventListener("click", listener, { capture: true })
    }
  }, [])

  if (editing) {
    return (
      <div ref={ref}>
        <MDEditor
          className="text-editor editor-styles"
          value={cell.content}
          onChange={(v) => updateCell(cell.id, v || "")}
        />
      </div>
    )
  }

  return (
    <div className="text-editor card" onClick={() => setEditing(true)}>
      <div className="card-content">
        <MDEditor.Markdown
          source={cell.content || "Click to edit"}
          className="editor-styles"
        />
      </div>
    </div>
  )
}

export default TextEditor
