import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import serversReducer from '../reducers/reducer'

const createStoreWithMiddleware = applyMiddleware(
    thunk
)(createStore)

export default function configureStore(initialState) {
    const store = createStoreWithMiddleware(serversReducer, initialState,
        typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : f => f)

    if (module.hot) {
        module.hot.accept('../reducers/reducer', () => {
            const nextReducer = require('../reducers/reducer')
            store.replaceReducer(nextReducer)
        })
    }

    return store
}