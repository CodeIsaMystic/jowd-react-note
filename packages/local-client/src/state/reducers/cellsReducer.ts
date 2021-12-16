import produce from "immer"
import { ActionType } from "../action-types"
import { Action } from "../actions"
import { Cell } from "../cell"

interface CellsState {
  loading: boolean
  error: string | null
  order: string[]
  data: {
    [key: string]: Cell
  }
}

const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {},
}
const reducer = produce((state: CellsState = initialState, action: Action) => {
  switch (action.type) {
    case ActionType.SAVE_CELLS_ERROR:
      state.error = action.payload

      return state

    case ActionType.FETCH_CELLS:
      state.loading = true
      state.error = null

      return state

    case ActionType.FETCH_CELLS_COMPLETE:
      state.order = action.payload.map((cell) => cell.id)
      state.data = action.payload.reduce((acc, cell) => {
        acc[cell.id] = cell

        return acc
      }, {} as CellsState["data"])
      return state

    case ActionType.FETCH_CELLS_ERROR:
      state.loading = false
      state.error = action.payload

      return state

    case ActionType.UPDATE_CELL:
      const { id, content } = action.payload

      state.data[id].content = content

      // Even if immer is doing all the job to setup
      // the new state and that we do not really need to return the state
      // We do return it because of typescript does not understand it
      // And will set each use cases by our Cell State could be undefined
      // A particular use case we don't want
      // In that in mind we force the return state...
      return state

    case ActionType.MOVE_CELL:
      // get the direction payload property
      const { direction } = action.payload
      // find the Cell index by id to be moved
      const index = state.order.findIndex((id) => id === action.payload.id)

      // handling direction moves by setting up new targetIndex variable
      // with logic set up moving items in the order [] array
      const targetIndex = direction === "up" ? index - 1 : index + 1

      // simple logic handling exception use cases
      // such as if is the first or last item in the array
      if (targetIndex < 0 || targetIndex > state.order.length - 1) {
        return state
      }

      // binding the targetIndex to the index
      state.order[index] = state.order[targetIndex]
      // then to the actual & new action.payload
      state.order[targetIndex] = action.payload.id

      return state

    case ActionType.DELETE_CELL:
      // deleting within the data {}
      delete state.data[action.payload]
      // handling delete action on the order []
      // maybe easier to treat it with the filter method
      // it wil create a brand new order Array
      // without the actual element to be deleted
      state.order = state.order.filter((id) => id !== action.payload)

      return state

    case ActionType.INSERT_CELL_AFTER:
      // setup a new Cell instance with default value
      const cell: Cell = {
        content: "",
        type: action.payload.type,
        id: randomId(),
      }

      // bind it
      state.data[cell.id] = cell

      // get the index to be ordered
      const foundIndex = state.order.findIndex((id) => id === action.payload.id)

      // if null unshift at the start of the order[] array
      // and splice it right after
      if (foundIndex < 0) {
        state.order.unshift(cell.id)
      } else {
        state.order.splice(foundIndex + 1, 0, cell.id)
      }

      return state

    default:
      return state
  }
}, initialState)

// Simple random function to get new id
// 36 as letter + numbers 27 + 9
const randomId = () => {
  return Math.random().toString(36).substr(2, 5)
}

export default reducer
