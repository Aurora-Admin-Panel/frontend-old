import {
  ADD_USERS,
  LOAD_USERS,
  ADD_CURRENT_USER,
  LOAD_CURRENT_USER,
  DELETE_USER,
  ADD_ME,
  DELETE_ME,
  LOAD_USER_SERVERS,
  ADD_USER_SERVERS,
  DELETE_USER_SERVERS,
} from "../actionTypes";

const initialState = {
  users: {
    users: {},
    loading: true
  },
  current: {
    user: {},
    loading: true
  },
  userServers: {
    userServers: [],
    loading: true
  },
  me: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_USERS: {
      return {
        ...state,
        users: {
          users: action.payload,
          loading: false
        }
      };
    }
    case LOAD_USERS: {
      return {
        ...state,
        users: {
          ...state.users,
          loading: true
        }
      }
    }
    case ADD_CURRENT_USER: {
      return {
        ...state,
        current: {
          user: action.payload,
          loading: false
        }
      };
    }
    case LOAD_CURRENT_USER: {
      return {
        ...state,
        current: {
          ...state.current,
          loading: true
        }
      }
    }
    case DELETE_USER: {
      return {
        ...state,
        users: state.users.filter(u => u.id !== action.payload.id)
      };
    }
    case ADD_ME: {
      return {
        ...state,
        me: action.payload,
      };
    }
    case DELETE_ME: {
      return {
        ...state,
        me: null,
      };
    }
    case LOAD_USER_SERVERS: {
      return {
        ...state,
        userServers: {
          ...state.userServers,
          loading: true
        }
      }
    }
    case ADD_USER_SERVERS: {
      return {
        ...state,
        userServers: {
          userServers: action.payload,
          loading: false
        }
      }
    }
    case DELETE_USER_SERVERS: {
      return {
        ...state,
        currentUserServers: [],
      };
    }
    default:
      return state;
  }
}
