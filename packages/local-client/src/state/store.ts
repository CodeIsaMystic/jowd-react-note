import { createStore, applyMiddleware } from "redux"
import thunk from "redux-thunk"
import reducers from "./reducers"
import { persistMiddleware } from "./middlewares/persist-middleware"
// importing action.type to our quick tests
// import { ActionType } from "./action-types"

export const store = createStore(
  reducers,
  {},
  applyMiddleware(persistMiddleware, thunk)
)

/**
 * HOW TO TEST A STORE WITH REDUX
 * WITHOUT USING A TESTING FRAMEWORK
 */
/*
store.dispatch({
  type: ActionType.INSERT_CELL_AFTER,
  payload: {
    id: null,
    type: "code",
  },
})

store.dispatch({
  type: ActionType.INSERT_CELL_AFTER,
  payload: {
    id: null,
    type: "text",
  },
})
store.dispatch({
  type: ActionType.INSERT_CELL_AFTER,
  payload: {
    id: null,
    type: "code",
  },
})

store.dispatch({
  type: ActionType.INSERT_CELL_AFTER,
  payload: {
    id: null,
    type: "text",
  },
})
*/
/*
const id = store.getState().cells.order[0]
console.log(store.getState())
*/
