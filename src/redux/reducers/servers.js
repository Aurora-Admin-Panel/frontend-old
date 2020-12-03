import {
  ADD_SERVERS,
  ADD_SERVER,
  REMOVE_SERVER,
  ADD_SERVER_USER,
  ADD_SERVER_USERS,
  DELETE_SERVER_USER,
} from "../actionTypes";

const initialState = {
  servers: {},
  server_users: [],
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
          [action.payload.id]: action.payload,
        },
      };
    }
    case REMOVE_SERVER: {
      delete state.servers[action.payload.id];
      return {
        ...state,
        servers: {
          ...state.servers,
        },
      };
    }
    case ADD_SERVER_USERS: {
      if (!action.payload || action.payload.length <= 0) return { ...state };
      const server_id = action.payload[0].server_id
      return {
        ...state,
        servers: {
          ...state.servers,
          [server_id]: {
            ...state.servers[server_id],
            allowed_users: action.payload,
          },
        },
      };
    }
    case ADD_SERVER_USER: {
      if (
        !state.servers[action.payload.server_id] ||
        !state.servers[action.payload.server_id].allowed_users.find(
          (su) => su.user_id === action.payload.user_id
        )
      ){
        return { ...state };
      }
      const index = state.servers[
        action.payload.server_id
      ].allowed_users.findIndex(su => su.user_id===action.payload.user_id)
      state.servers[
        action.payload.server_id
      ].allowed_users[index] = action.payload
      // TODO: Handle add server user.
      return {
        ...state,
        servers: {
          ...state.servers,
          [action.payload.server_id]: {
            ...state.servers[action.payload.server_id],
            allowed_users: state.servers[
              action.payload.server_id
            ].allowed_users
          },
        },
      };
    }
    case DELETE_SERVER_USER: {
      if (!state.servers[action.payload.server_id]) return;
      return {
        ...state,
        servers: {
          ...state.servers,
          [action.payload.server_id]: {
            ...state.servers[action.payload.server_id],
            allowed_users: state.servers[
              action.payload.server_id
            ].allowed_users.filter(
              (su) => action.payload.user_id !== su.user_id
            ),
          },
        },
      };
    }
    default:
      return state;
  }
}
