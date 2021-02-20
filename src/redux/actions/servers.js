import {
  serverGet,
  serverConnect,
  serverCreate,
  serverEdit,
  serverConfigEdit,
  serverDelete,
  serverUsersGet,
  serverUserEdit,
  serverUserCreate,
  serverUserDelete,
  serverGetV2,
  serverGetDetailedV2,
  serversGetV2,
} from "../apis/servers";
import { handleError } from "./utils";
import {
  ADD_SERVER_USERS,
  ADD_SERVERS,
  LOAD_SERVERS,
  UPDATE_SERVER,
  ADD_CURRENT_SERVER,
  LOAD_CURRENT_SERVER,
  LOAD_SERVER_USERS,
} from "../actionTypes";
import { store } from '../store';


export const editServerConfig = (server_id, config) => {
  return (dispatch) => {
    serverConfigEdit(server_id, config)
      .then((response) => {
        const data = response.data;
        if (data) {
          dispatch({
            type: ADD_CURRENT_SERVER,
            payload: data,
          });
        }
      })
      .catch((error) => handleError(dispatch, error));
  };
};

export const getServer = (server_id) => {
  return (dispatch) => {
    serverGet(server_id)
      .then((response) => {
        const data = response.data;
        if (data) {
          dispatch({
            type: UPDATE_SERVER,
            payload: data,
          });
          if (!data.config.system) {
            setTimeout(() => dispatch(getServer(server_id)), 2000);
          }
        }
      })
      .catch((error) => handleError(dispatch, error));
  };
};

export const connectServer = (server_id, data) => {
  return (dispatch) => {
    serverConnect(server_id, data)
      .then((response) => {
        const data = response.data;
        if (data) {
          dispatch({
            type: UPDATE_SERVER,
            payload: data,
          });
          if (!data.config.system) {
            setTimeout(() => dispatch(getServer(server_id)), 2000);
          }
        }
      })
      .catch((error) => handleError(dispatch, error));
  };
};

export const getServerUsers = (server_id) => {
  return dispatch => {
    dispatch({ type: LOAD_SERVER_USERS });
    serverUsersGet(server_id).then(response => {
      const data = response.data;
      if (data) {
        dispatch({
          type: ADD_SERVER_USERS,
          payload: data,
        })
      }
    }).catch(error => handleError(dispatch, error))
  }
}

export const createServerUser = (server_id, data) => {
  return dispatch => {
    dispatch({ type: LOAD_SERVER_USERS });
    serverUserCreate(server_id, data).then(response => {
      const data = response.data;
      if (data) {
        dispatch(getServerUsers(server_id))
      }
    }).catch(error => handleError(dispatch, error))
  }
}

export const editServerUser = (server_id, user_id, data) => {
  return dispatch => {
    dispatch({ type: LOAD_SERVER_USERS });
    serverUserEdit(server_id, user_id, data).then(response => {
      const data = response.data;
      if (data) {
        dispatch(getServerUsers(server_id))
      }
    }).catch(error => handleError(dispatch, error))
  }
}

export const deleteServerUser = (server_id, user_id) => {
  return dispatch => {
    dispatch({ type: LOAD_SERVER_USERS });
    serverUserDelete(server_id, user_id).then(response => {
      const data = response.data;
      if (data) {
        dispatch(getServerUsers(server_id))
      }
    }).catch(error => handleError(dispatch, error))
  }
}

export const getServers = (page = null, size = null) => {
  return (dispatch) => {
    dispatch({ type: LOAD_SERVERS })
    const servers = store.getState().servers.servers.servers;
    if (page === null) {
      page = servers['page'] + 1 || 1
    }
    if (size === null) {
      size = servers['size'] || 20
    }
    serversGetV2(page, size)
      .then(response => {
        const data = response.data
        if (data) {
          dispatch({
            type: ADD_SERVERS,
            payload: data,
          });
        }
      })
      .catch((error) => handleError(dispatch, error))
  }
}

export const createServer = (data) => {
  return (dispatch) => {
    dispatch({ type: LOAD_SERVERS })
    serverCreate(data)
      .catch((error) => handleError(dispatch, error))
      .then(() => dispatch(getServers()))
  };
};

export const editServer = (server_id, data) => {
  return (dispatch) => {
    dispatch({ type: LOAD_SERVERS })
    serverEdit(server_id, data)
      .catch((error) => handleError(dispatch, error))
      .then(() => dispatch(getServers()))
  };
};

export const deleteServer = (server_id) => {
  return (dispatch) => {
    dispatch({ type: LOAD_SERVERS })
    serverDelete(server_id)
      .catch((error) => handleError(dispatch, error))
      .then(() => dispatch(getServers()))
  };
};

export const getCurrentServer = (server_id, detailed = false) => {
  return (dispatch) => {
    dispatch({ type: LOAD_CURRENT_SERVER })
    if (server_id > 0) {
      (detailed ? serverGetDetailedV2(server_id) : serverGetV2(server_id))
        .then((response) => {
          const data = response.data;
          if (data) {
            dispatch({
              type: ADD_CURRENT_SERVER,
              payload: data,
            });
          }
        })
        .catch((error) => handleError(dispatch, error));
    } else {
      dispatch({
        type: ADD_CURRENT_SERVER,
        payload: null,
      });
    }

  };
};