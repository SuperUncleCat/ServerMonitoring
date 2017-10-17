import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import Main from './containers/Main'
import serversReducer from './reducers/reducer'
//const store = createStore(serversReducer, window.__REDUX_STATE__)
const store = createStore(
    serversReducer,
    window.devToolsExtension ? window.devToolsExtension() : undefined
);
ReactDOM.render(
    <Provider store={store}>
		<Main />
	</Provider>,
    document.getElementById('root')
)