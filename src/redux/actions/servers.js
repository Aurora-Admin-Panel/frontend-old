import {
  serversGet,
  serverGet,
  serverCreate,
  serverEdit,
  serverDelete,
  serverUsersGet,
  serverUserEdit,
  serverUserCreate,
  serverUserDelete,
} from "../apis/servers";
import { handleError } from "./utils";
import {
  ADD_SERVERS,
  ADD_SERVER,
  REMOVE_SERVER,
  ADD_SERVER_USERS,
  ADD_SERVER_USER,
  DELETE_SERVER_USER,
} from "../actionTypes";


export const getServer = (server_id) => {
  return (dispatch) => {
    serverGet(server_id)
      .then((response) => {
        const data = response.data;
        if (data) {
          dispatch({
            type: ADD_SERVER,
            payload: data,
          });
          if (!data.config.facts) {
            setTimeout(
              () => dispatch(getServer(server_id)),
              2000
            );
          }
        }
      })
      .catch((error) => handleError(dispatch, error));
  };
};

export const getServers = () => {
  return (dispatch) => {
    serversGet()
      .then((response) => {
        const data = response.data;
        if (data) {
          dispatch({
            type: ADD_SERVERS,
            payload: data,
          });
          for (const server of data) {
            if (!server.config.facts) {
              setTimeout(
                () => dispatch(getServer(server.id)),
                2000
              );
            }
          }
        }
      })
      .catch((error) => handleError(dispatch, error));
  };
};

export const createServer = (data) => {
  return (dispatch) => {
    serverCreate(data)
      .then((response) => {
        const data = response.data;
        if (data) {
          dispatch({
            type: ADD_SERVER,
            payload: data,
          });
          if (!data.config.facts) {
            setTimeout(
              () => dispatch(getServer(data.id)),
              2000
            );
          }
        }
      })
      .catch((error) => handleError(dispatch, error));
  };
};

export const editServer = (server_id, data) => {
  return (dispatch) => {
    serverEdit(server_id, data)
      .then((response) => {
        const data = response.data;
        if (data) {
          dispatch({
            type: ADD_SERVER,
            payload: data,
          });
          if (!data.config.facts) {
            setTimeout(
              () => dispatch(getServer(server_id)),
              2000
            );
          }
        }
      })
      .catch((error) => handleError(dispatch, error));
  };
};

export const deleteServer = (server_id) => {
  return (dispatch) => {
    serverDelete(server_id)
      .then((response) => {
        const data = response.data;
        if (data) {
          dispatch({
            type: REMOVE_SERVER,
            payload: data,
          });
        }
      })
      .catch((error) => handleError(dispatch, error));
  };
};

export const getServerUsers = (server_id) => {
  return dispatch => {
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
    serverUserCreate(server_id, data).then(response => {
      const data = response.data;
      if (data) {
        dispatch({
          type: ADD_SERVER_USER,
          payload: data,
        })
      }
    }).catch(error => handleError(dispatch, error))
  }
}

export const editServerUser = (server_id, user_id, data) => {
  return dispatch => {
    serverUserEdit(server_id, user_id, data).then(response => {
      const data = response.data;
      if (data) {
        dispatch({
          type: ADD_SERVER_USER,
          payload: data,
        })
      }
    }).catch(error => handleError(dispatch, error))
  }
}

export const deleteServerUser = (server_id, user_id) => {
  return dispatch => {
    serverUserDelete(server_id, user_id).then(response => {
      const data = response.data;
      if (data) {
        dispatch({
          type: DELETE_SERVER_USER,
          payload: data,
        })
      }
    }).catch(error => handleError(dispatch, error))
  }
}