import "./add-cell.css"
import { useActions } from "../hooks/use-actions"

interface AddCellProps {
  previousCellId: string | null
  forceVisible?: boolean
}

const AddCell: React.FC<AddCellProps> = ({ previousCellId, forceVisible }) => {
  const { insertCellAfter } = useActions()

  return (
    <div className={`add-cell ${forceVisible && "force-visible"}`}>
      <button
        className="button is-small is-dark"
        onClick={() => insertCellAfter(previousCellId, "code")}
      >
        <i className="fas fa-plus"></i>
        Code
      </button>
      <button
        className="button is-small is-dark"
        onClick={() => insertCellAfter(previousCellId, "text")}
      >
        <i className="fas fa-plus"></i>
        Text
      </button>
    </div>
  )
}

export default AddCell
