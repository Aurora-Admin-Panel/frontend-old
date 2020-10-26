import { ADD_TODO, TOGGLE_TODO, SET_FILTER } from "../actionTypes";

let nextTodoId = 0;

export const addTodo = content => ({
    type: ADD_TODO,
    payload: {
        id: ++nextTodoId,
        content
    }
});

export const delayToDo = content => {
    return dispatch => {
        setTimeout(
            () => {
                dispatch({
                    type: ADD_TODO,
                    payload: {
                        id: ++nextTodoId,
                        content
                    }
                })
            }, 2000)
    }
}

export const toggleTodo = id => ({
    type: TOGGLE_TODO,
    payload: { id }
});

export const setFilter = filter => ({ type: SET_FILTER, payload: { filter } });
