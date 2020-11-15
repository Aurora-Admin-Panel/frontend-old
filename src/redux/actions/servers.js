import {
  serversGet,
  serverGet,
  serverCreate,
  serverEdit,
  serverDelete,
} from "../apis/servers";
import { handleResponse } from "./utils";
import { ADD_SERVERS, ADD_SERVER, REMOVE_SERVER } from "../actionTypes";

export const getServers = () => {
  return (dispatch) => {
    serversGet().then((response) => {
      const data = handleResponse(dispatch, response);
      if (data) {
        dispatch({
          type: ADD_SERVERS,
          payload: data,
        });
      }
    });
  };
};

export const getServer = (server_id) => {
  return (dispatch) => {
    serverGet(server_id).then((response) => {
      const data = handleResponse(dispatch, response);
      if (data) {
        dispatch({
          type: ADD_SERVER,
          payload: data,
        });
      }
    });
  };
};

export const createServer = (data) => {
  return (dispatch) => {
    serverCreate(data).then((response) => {
      const data = handleResponse(dispatch, response);
      if (data) {
        dispatch({
          type: ADD_SERVER,
          payload: data,
        });
      }
    });
  };
};

export const editServer = (server_id, data) => {
  return (dispatch) => {
    serverEdit(server_id, data).then((response) => {
      const data = handleResponse(dispatch, response);
      if (data) {
        dispatch({
          type: ADD_SERVER,
          payload: data,
        });
      }
    });
  };
};

export const deleteServer = (server_id) => {
  return (dispatch) => {
    serverDelete(server_id).then((response) => {
      const data = handleResponse(dispatch, response);
      if (data) {
        dispatch({
          type: REMOVE_SERVER,
          payload: data,
        });
      }
    });
  };
};
