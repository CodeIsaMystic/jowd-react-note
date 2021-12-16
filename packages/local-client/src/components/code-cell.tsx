import "./code-cell.css"

import { useEffect } from "react"

import CodeEditor from "./code-editor"
import Preview from "./preview"
import Resizable from "./resizable"

import { Cell } from "../state"
import { useActions } from "../hooks/use-actions"
import { useCumulativeCode } from "../hooks/use-cumulative-code"
import { useTypedSelector } from "../hooks/use-typed-selector"

interface CodeCellProps {
  cell: Cell
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const { updateCell, createBundle } = useActions()
  const bundle = useTypedSelector((state) => state.bundles[cell.id])
  const cumulativeCode = useCumulativeCode(cell.id)

  useEffect(() => {
    if (!bundle) {
      createBundle(cell.id, cumulativeCode)
      return
    }
    const timer = setTimeout(async () => {
      createBundle(cell.id, cumulativeCode)
    }, 750)

    return () => {
      clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cumulativeCode, cell.id, createBundle])

  return (
    <Resizable direction="vertical">
      <div className="code-cell-wrapper">
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue={cell.content}
            onChange={(value) => updateCell(cell.id, value)}
          />
        </Resizable>
        <div className="progress-wrapper">
          {!bundle || bundle.loading ? (
            <div className="progress-cover">
              <progress className="progress is-small is-link" max="100">
                Loading
              </progress>
            </div>
          ) : (
            <Preview code={bundle.code} error={bundle.error} />
          )}
        </div>
      </div>
    </Resizable>
  )
}

export default CodeCell
