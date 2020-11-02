import { ADD_SERVERS, ADD_SERVER, REMOVE_SERVER } from "../actionTypes";

const initialState = {
  servers: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_SERVERS: {
      const servers = {};
      for (const server of action.payload) {
        servers[server.id] = server;
      }
      return {
        ...state,
        servers: servers,
      };
    }
    case ADD_SERVER: {
        return {
            ...state,
            servers: {
                ...state.servers,
                [action.payload.id]: action.payload
            }
        }
    }
    case REMOVE_SERVER: {
      delete state.servers[action.payload.id]
      return {
        ...state,
        servers: {
          ...state.servers
        }
      }
    }
    default:
      return state;
  }
}
