import { combineReducers } from "redux"
import cellsReducer from "./cellsReducer"
import bundlesReducer from "./bundlesReducer"

const reducers = combineReducers({
  cells: cellsReducer,
  bundles: bundlesReducer,
})

export default reducers

/* Describe the overall object of State inside of our Redux Store  */
export type RootState = ReturnType<typeof reducers>
