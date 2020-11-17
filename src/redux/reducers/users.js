import { ADD_USERS, ADD_USER, DELETE_USER, ADD_ME, DELETE_ME } from "../actionTypes";

const initialState = {
  users: {},
  me: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_USERS: {
      const users = {};
      for (const user of action.payload) {
        users[user.id] = user;
      }
      return {
        ...state,
        users: users,
      };
    }
    case ADD_USER: {
      return {
        ...state,
        users: {
          ...state.users,
          [action.payload.id]: action.payload,
        },
      };
    }
    case DELETE_USER: {
      delete state.users[action.payload.id];
      return {
        ...state,
        users: {
          ...state.users,
        },
      };
    }
    case ADD_ME: {
      return {
        ...state,
        me: action.payload
      }
    }
    case DELETE_ME: {
      return {
        ...state,
        me: null
      }
    }
    default:
      return state;
  }
}
