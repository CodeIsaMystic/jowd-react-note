import { Fragment, useEffect } from "react"
import { useTypedSelector } from "../hooks/use-typed-selector"
import { useActions } from "../hooks/use-actions"

import CellListItem from "./cell-list-item"
import AddCell from "./add-cell"

import "./cell-list.css"

const CellList: React.FC = () => {
  // getting cells types from useTypedSelector hook
  // and merging order with data
  const cells = useTypedSelector(({ cells: { order, data } }) => {
    return order.map((id) => {
      return data[id]
    })
  })

  const { fetchCells } = useActions()

  useEffect(() => {
    fetchCells()
  }, [])

  const renderedCells = cells.map((cell) => (
    <Fragment key={cell.id}>
      <CellListItem cell={cell} />
      <AddCell previousCellId={cell.id} />
    </Fragment>
  ))

  return (
    <div className="cell-list">
      <AddCell forceVisible={cells.length === 0} previousCellId={null} />
      {renderedCells}
    </div>
  )
}

export default CellList
