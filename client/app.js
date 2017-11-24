import React from 'react'
import ReactDOM from 'react-dom'
import configureStore from './store/configureStore'
import { Provider } from 'react-redux'
//import Main from './containers/Main'
import serversReducer from './reducers/reducer'
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom'
//import AppRoot from './app-root'
import Nav from './containers/Nav'
//const store = createStore(serversReducer, window.__REDUX_STATE__)
const store = configureStore(window.__REDUX_STATE__)
import routes from './routes'
import { renderRoutes } from 'react-router-config'

/*ReactDOM.render(
    <Provider store={store}>
    	<BrowserRouter>
			<AppRoot />
		</BrowserRouter>
	</Provider>,
    document.getElementById('root')
)*/
ReactDOM.render(
    <Provider store={store}>
    	<BrowserRouter>
			{renderRoutes(routes)}
		</BrowserRouter>
	</Provider>,
    document.getElementById('root')
)