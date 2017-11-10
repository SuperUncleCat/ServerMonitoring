//action types
const INIT_STATE = 'INIT_STATE'
const ADD_STATE = 'ADD_STATE'
const DELETE_STATE = 'DELETE_STATE'
const EDIT_STATE = 'EDIT_STATE'

//reducer
export default function(state, action) {
    if (!state) {
        state = {
            data: []
        }
    }
    switch (action.type) {
    case INIT_STATE:
        return {
            data: action.data
        }
    case ADD_STATE:
        return {
            data: [...state.data, action.data]
        }
    case EDIT_STATE:
        (state, action) => {
            let data = Object.assign([...state.data], {
                [action.index]: action.data
            })
            data.sort((x, y) => x.priority - y.priority)
            return {
                data
            }
        }
    /*return {
        servers: [...state.servers.slice(0, action.index), Object.assign({}, state.servers[action.index], {
            done: true
        }), ...state.servers.slice(action.index + 1)]
        servers: Object.assign([...state.servers], {
            [index]: action.data
        })
        servers: Object.assign({}, state[action.index], action.data)
    }*/
    case DELETE_STATE:
        return {
            data: [
                ...state.data.slice(0, action.index),
                ...state.data.slice(action.index + 1)
            ]
        }
    default:
        return state
    }
}

// action creators
export const initState = (data) => {
    return {
        type: INIT_STATE,
        data
    }
}

export const addState = (data) => {
    return {
        type: ADD_STATE,
        data
    }
}

export const deleteState = (index) => {
    return {
        type: DELETE_STATE,
        index
    }
}

export const editState = (index, data) => {
    return {
        type: EDIT_STATE,
        index,
        data
    }
}