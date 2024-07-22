import ReactDOM from 'react-dom/client'
// import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import App from './App'

import anecdoteService from './services/anecdotes'

import store from './store'
import { setAnecdotes } from './reducers/anecdoteReducer'
// store.subscribe(() => console.log(store.getState()))

anecdoteService.getAll().then(anecdotes =>
  store.dispatch(setAnecdotes(anecdotes))
)


ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)