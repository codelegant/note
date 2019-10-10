import { useReducer } from 'react'
const has = Object.prototype.hasOwnProperty
export default initialState => {
  const reducer = (state, { propId, valueId }) => {
    if (!has.call(state, propId)) throw Error(`propId: ${propId} not exist.`)
    return {...state, [propId]: valueId}
  }
  const [state, dispatch] = useReducer(reducer, initialState)

  return [state, dispatch]
}