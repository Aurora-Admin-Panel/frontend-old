import {
  serversGet,
  serverGet,
  serverCreate,
  serverEdit,
  serverDelete,
} from "../apis/servers";
import { ADD_SERVERS, ADD_SERVER, REMOVE_SERVER } from "../actionTypes";

export const getServers = () => {
  return (dispatch) => {
    serversGet().then((response) => {
      if (response.status === 500) {
        throw new Error("Internal server error");
      }
      const data = response.data;
      if (response.status > 400 && response.status < 500) {
        if (data.detail) {
          throw data.detail;
        }
        throw data;
      }
      dispatch({
        type: ADD_SERVERS,
        payload: data,
      });
    });
  };
};

export const getServer = (server_id) => {
  return (dispatch) => {
    serverGet(server_id).then((response) => {
      if (response.status === 500) {
        throw new Error("Internal server error");
      }
      const data = response.data;
      if (response.status > 400 && response.status < 500) {
        if (data.detail) {
          throw data.detail;
        }
        throw data;
      }
      dispatch({
        type: ADD_SERVER,
        payload: data,
      });
    });
  };
};

export const createServer = (data) => {
  return (dispatch) => {
    serverCreate(data).then((response) => {
      if (response.status === 500) {
        throw new Error("Internal server error");
      }
      const data = response.data;
      if (response.status > 400 && response.status < 500) {
        if (data.detail) {
          throw data.detail;
        }
        throw data;
      }
      dispatch({
        type: ADD_SERVER,
        payload: data,
      });
    });
  };
};

export const editServer = (server_id, data) => {
  return (dispatch) => {
    serverEdit(server_id, data).then((response) => {
      if (response.status === 500) {
        throw new Error("Internal server error");
      }
      const data = response.data;
      if (response.status > 400 && response.status < 500) {
        if (data.detail) {
          throw data.detail;
        }
        throw data;
      }
      dispatch({
        type: ADD_SERVER,
        payload: data,
      });
    });
  };
};

export const deleteServer = (server_id) => {
  return (dispatch) => {
    serverDelete(server_id).then((response) => {
      if (response.status === 500) {
        throw new Error("Internal server error");
      }
      const data = response.data;
      if (response.status > 400 && response.status < 500) {
        if (data.detail) {
          throw data.detail;
        }
        throw data;
      }
      dispatch({
        type: REMOVE_SERVER,
        payload: data,
      });
    });
  };
};