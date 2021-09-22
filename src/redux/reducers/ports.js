import {
  ADD_SERVER_PORTS,
  LOAD_SERVER_PORTS,
  DELETE_SERVER_PORTS,
  ADD_SERVER_PORT,
  DELETE_SERVER_PORT,
  ADD_SERVER_PORT_USAGE,
  ADD_SERVER_PORT_USERS,
  ADD_SERVER_PORT_USER,
  DELETE_SERVER_PORT_USER,
  ADD_SERVER_PORT_FORWARD_RULE,
  DELETE_SERVER_PORT_FORWARD_RULE,
  GET_TLS_PROVIDER_PORT,
} from "../actionTypes";

const initialState = {
  ports: {
    ports: {},
    loading: true
  },
  current: {
    port: {},
    loading: true
  },
  tlsProvider: {
    port: {},
    loading: true
  }
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_SERVER_PORTS: {
      return {
        ...state,
        ports: {
          ports: action.payload,
          loading: false
        },
      };
    }
    case LOAD_SERVER_PORTS: {
      return {
        ...state,
        ports: {
          ...state.ports,
          loading: true
        }
      }
    }
    case DELETE_SERVER_PORTS: {
      return {
        ...state,
        ports: {},
      };
    }
    case ADD_SERVER_PORT_FORWARD_RULE: {
      const idx = state.ports.ports.items.findIndex(p => p.id === action.payload.port_id)
      if (idx > -1) {
        return {
          ...state,
          ports: {
            ...state.ports,
            ports: {
              ...state.ports.ports,
              items: [
                ...state.ports.ports.items.slice(0, idx),
                {
                  ...state.ports.ports.items[idx],
                  forward_rule: {
                    ...action.payload,
                    count: !state.ports.ports.items[idx].forward_rule || isNaN(state.ports.ports.items[idx].forward_rule.count)
                      ? 0 : state.ports.ports.items[idx].forward_rule.count + 1
                  }
                },
                ...state.ports.ports.items.slice(idx + 1)
              ]
            }
          }
        }
      }
      return { ...state }
    }
    case DELETE_SERVER_PORT_FORWARD_RULE: {
      const idx = state.ports.ports.items.findIndex(p => p.id === action.payload.port_id)
      if (idx > -1) {
        return {
          ...state,
          ports: {
            ...state.ports,
            ports: {
              ...state.ports.ports,
              items: [
                ...state.ports.ports.items.slice(0, idx),
                {
                  ...state.ports.ports.items[idx],
                  forward_rule: null
                },
                ...state.ports.ports.items.slice(idx + 1)
              ]
            }
          }
        }
      }
      return { ...state }
    }
    case ADD_SERVER_PORT_USERS: {
      const idx = state.ports.ports.items.findIndex(p => p.id === action.payload.port_id)
      if (idx > -1) {
        return {
          ...state,
          ports: {
            ...state.ports,
            ports: {
              ...state.ports.ports,
              items: [
                ...state.ports.ports.items.slice(0, idx),
                {
                  ...state.ports.ports.items[idx],
                  allowed_users: action.payload
                },
                ...state.ports.ports.items.slice(idx + 1)
              ]
            }
          }
        }
      }
      return { ...state }
    }
    case ADD_SERVER_PORT_USER: {
      const idx = state.ports.ports.items.findIndex(p => p.id === action.payload.port_id)
      if (idx > -1) {
        return {
          ...state,
          ports: {
            ...state.ports,
            ports: {
              ...state.ports.ports,
              items: [
                ...state.ports.ports.items.slice(0, idx),
                {
                  ...state.ports.ports.items[idx],
                  allowed_users: state.ports.ports.items[idx].allowed_users.concat(action.payload)
                },
                ...state.ports.ports.items.slice(idx + 1)
              ]
            }
          }
        }
      }
      return { ...state }
    }
    case DELETE_SERVER_PORT_USER: {
      const idx = state.ports.ports.items.findIndex(p => p.id === action.payload.port_id)
      if (idx > -1) {
        return {
          ...state,
          ports: {
            ...state.ports,
            ports: {
              ...state.ports.ports,
              items: [
                ...state.ports.ports.items.slice(0, idx),
                {
                  ...state.ports.ports.items[idx],
                  allowed_users: state.ports.ports.items[idx].allowed_users.filter(u => u.user_id !== action.payload.user_id)
                },
                ...state.ports.ports.items.slice(idx + 1)
              ]
            }
          }
        }
      }
      return { ...state }
    }
    case ADD_SERVER_PORT_USAGE: {
      const idx = state.ports.ports.items.findIndex(p => p.id === action.payload.port_id)
      if (idx > -1) {
        return {
          ...state,
          ports: {
            ...state.ports,
            ports: {
              ...state.ports.ports,
              items: [
                ...state.ports.ports.items.slice(0, idx),
                {
                  ...state.ports.ports.items[idx],
                  usage: action.payload
                },
                ...state.ports.ports.items.slice(idx + 1)
              ]
            }
          }
        }
      }
      return { ...state }
    }
    case ADD_SERVER_PORT: {
      return {
        ...state,
        ports: {
          ...state.ports,
          [action.payload.id]: action.payload,
        },
      };
    }
    case DELETE_SERVER_PORT: {
      if (!state.ports[action.payload.id]) {
        return { ...state };
      }
      return {
        ...state,
        ports: {
          ...state.ports,
          [action.payload.id]: null,
        },
      };
    }
    case GET_TLS_PROVIDER_PORT: {
      return {
        ...state,
        tlsProvider: {
          port: action.payload,
          loading: false
        }
      }
    }
    default:
      return state;
  }
}
