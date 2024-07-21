import React from 'react'
import ReactDOM from 'react-dom/client'

// import { createStore, combineReducers } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'

import App from './App'
import noteReducer from './reducers/noteReducer'
import filterReducer from './reducers/filterReducer'

// the state of the store now looks like:
// {
//   notes: [
//     { content: 'reducer defines how redux store works', important: true, id: 1},
//     { content: 'state of store can contain any data', important: false, id: 2}
//   ],
//   filter: 'IMPORTANT'
// }

// got rid of in 6.10
// const reducer = combineReducers({
//   notes: noteReducer,
//   filter: filterReducer
// })

// const store = createStore(reducer)

// IT BECOMES:
const store = configureStore({
  reducer: {
    notes: noteReducer,
    filter: filterReducer
  }
})

// console.log(store.getState())

// store.subscribe(() => console.log(store.getState()))
// store.dispatch(filterChange('IMPORTANT'))
// store.dispatch(createNote('combineReducers forms one reducer from many simple reducers'))

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <Provider store={store}>
//     <div />
//   </Provider>
// )

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)