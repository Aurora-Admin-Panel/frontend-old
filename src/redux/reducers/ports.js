import {
  ADD_SERVER_PORTS,
  DELETE_SERVER_PORTS,
  ADD_SERVER_PORT,
  DELETE_SERVER_PORT,
  ADD_SERVER_PORT_USERS,
  ADD_SERVER_PORT_USER,
  DELETE_SERVER_PORT_USER,
  ADD_SERVER_PORT_FORWARD_RULE,
  DELETE_SERVER_PORT_FORWARD_RULE,
} from "../actionTypes";

const initialState = {
  ports: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_SERVER_PORTS: {
      const ports = {};
      for (const port of action.payload) {
        ports[port.id] = port;
      }
      return {
        ...state,
        ports: ports,
      };
    }
    case DELETE_SERVER_PORTS: {
      return {
        ...state,
        ports: {}
      }
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
      return {
        ...state,
        ports: {
          ...state.ports,
          [action.payload.id]: null,
        },
      };
    }
    case ADD_SERVER_PORT_USERS: {
      return {
        ...state,
        ports: {
          ...state.ports,
          [action.payload.port_id]: {
            ...state.ports[action.payload.port_id],
            allowed_users: action.payload
          }
        }
      }
    }
    case ADD_SERVER_PORT_USER: {
      return {
        ...state,
        ports: {
          ...state.ports,
          [action.payload.port_id]: {
            ...state.ports[action.payload.port_id],
            allowed_users: state.ports[action.payload.port_id].allowed_users.concat(action.payload)
          }
        }
      }
    }
    case DELETE_SERVER_PORT_USER: {
      return {
        ...state,
        ports: {
          ...state.ports,
          [action.payload.port_id]: {
            ...state.ports[action.payload.port_id],
            allowed_users: state.ports[action.payload.port_id].allowed_users.filter(u => parseInt(u.user_id) !== parseInt(action.payload.user_id))
          }
        }
      }
    }
    case ADD_SERVER_PORT_FORWARD_RULE: {
      return {
        ...state,
        ports: {
          ...state.ports,
          [action.payload.port_id]: {
            ...state.ports[action.payload.port_id],
            forward_rule: action.payload,
          },
        },
      };
    }
    case DELETE_SERVER_PORT_FORWARD_RULE: {
        return {
          ...state,
          ports: {
            ...state.ports,
            [action.payload.port_id]: {
              ...state.ports[action.payload.port_id],
              forward_rule: null
            },
          },
        };
      }
    default:
      return state;
  }
}
