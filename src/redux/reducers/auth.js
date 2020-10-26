import {LOG_IN, LOG_OUT} from "../actionTypes";

const initialState = {
  token: '',
  permission: '',
  error: ''
}

export default function (state = initialState, action) {
  switch (action.type) {
    case LOG_IN: {
      const {token, permission} = action.payload
      return {
        ...state,
        token: token,
        permission: permission
      }
    }
    case LOG_OUT: {
      return {
        ...state,
        token: '',
        permission: ''
      }
    }
    default:
      return state
  }
}