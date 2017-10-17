//action types
const INIT_SERVERS = 'INIT_SERVERS'
const ADD_SERVER = 'ADD_SERVER'
const DELETE_SERVER = 'DELETE_SERVER'
const EDIT_SERVER = 'EDIT_SERVER'

//reducer
export default function(state, action) {
    if (!state) {
        state = {
            servers: []
        }
    }
    switch (action.type) {
    case INIT_SERVERS:
        return {
            servers: action.servers
        }
    case ADD_SERVER:
        return {
            servers: [...state.servers, action.server]
        }
    case EDIT_SERVER:
        return {
            /*servers: [...state.servers.slice(0, action.index), Object.assign({}, state.servers[action.index], {
                done: true
            }), ...state.servers.slice(action.index + 1)]
            servers: Object.assign([...state.servers], {
                [index]: action.data
            })*/
            servers: Object.assign({}, state[action.index], action.data)
        }
    case DELETE_SERVER:
        return {
            servers: [
                ...state.servers.slice(0, action.index),
                ...state.servers.slice(action.index + 1)
            ]
        }
    default:
        return state
    }
}

// action creators
export const initServers = (servers) => {
    return {
        type: INIT_SERVERS,
        servers
    }
}

export const addServer = (server) => {
    return {
        type: ADD_SERVER,
        server
    }
}

export const deleteServer = (index) => {
    return {
        type: DELETE_SERVER,
        index
    }
}

export const editServer = (index, data) => {
    return {
        type: EDIT_SERVER,
        index,
        data
    }
}