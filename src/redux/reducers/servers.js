import {
  ADD_SERVER,
  REMOVE_SERVER,
  ADD_SERVER_USER,
  ADD_SERVER_USERS,
  DELETE_SERVER_USER,
  ADD_SERVERS,
  LOAD_SERVERS,
  UPDATE_SERVER,
  ADD_CURRENT_SERVER,
  LOAD_CURRENT_SERVER,
  LOAD_SERVER_USERS,
} from "../actionTypes";

const initialState = {
  servers: {
    servers: {},
    loading: true
  },
  current: {
    server: null,
    loading: true
  },
  users: {
    users: {},
    loading: true
  },
  connect: {}
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_SERVER: {
      return {
        ...state,
        servers: [action.payload].concat(state.servers),
      };
    }
    case REMOVE_SERVER: {
      return {
        ...state,
        servers: state.servers.filter(s => s.id !== action.payload.id),
      };
    }
    case ADD_SERVER_USERS: {
      return {
        ...state,
        users: {
          users: action.payload,
          loading: false
        }
      }
    }
    case LOAD_SERVER_USERS: {
      return {
        ...state,
        users: {
          ...state.users,
          loading: true
        }
      }
    }
    case ADD_SERVER_USER: {
      return {
        ...state,
        users: {
          ...state.users,
          users: [action.payload].concat(state.users)
        }
      };
    }
    case DELETE_SERVER_USER: {
      return {
        ...state,
        users: {
          ...state.users,
          users: state.users.filter(u => u.user_id !== action.payload.user_id)
        }
      };
    }
    case ADD_SERVERS: {
      return {
        ...state,
        servers: {
          servers: action.payload,
          loading: false
        }
      }
    }
    case LOAD_SERVERS: {
      return {
        ...state,
        servers: {
          ...state.servers,
          loading: true
        }
      }
    }
    case UPDATE_SERVER: {
      const idx = state.servers.servers.items.findIndex(s => s.id === action.payload.id)
      if (idx > -1)
        return {
          ...state,
          servers: {
            ...state.servers,
            servers: {
              ...state.servers.servers,
              items: [
                ...state.servers.servers.items.slice(0, idx),
                action.payload,
                ...state.servers.servers.items.slice(idx + 1)
              ]
            }
          }
        }
      return state
    }
    case ADD_CURRENT_SERVER: {
      return {
        ...state,
        current: {
          server: action.payload,
          loading: false
        }
      }
    }
    case LOAD_CURRENT_SERVER: {
      return {
        ...state,
        current: {
          server: null,
          loading: true
        }
      }
    }
    default:
      return state;
  }
}
