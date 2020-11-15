import { handleResponse } from "./utils"
import {
  serverPortsGet,
  serverPortCreate,
  serverPortGet,
  serverPortEdit,
  serverPortDelete,
  serverPortUsersGet,
  serverPortUserCreate,
  serverPortUserDelete,
  serverPortForwardRuleGet,
  serverPortForwardRuleCreate,
  serverPortForwardRuleEdit,
  serverPortForwardRuleDelete,
} from "../apis/ports";
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


export const createServerPort = (server_id, data) => {
  return dispatch => {
    serverPortCreate(server_id, data).then(response => {
      const data = handleResponse(dispatch, response);
      if (data) {
        dispatch({
          type: ADD_SERVER_PORT,
          payload: data
        })
      }
    })
  }
}

export const deleteServerPort = (server_id, port_id) => {
  return dispatch => {
    serverPortDelete(server_id, port_id).then(response => {
      const data = handleResponse(dispatch, response);
      if (data) {
        dispatch({
          type: DELETE_SERVER_PORT,
          payload: data
        })
      }
    })
  }
}

export const getServerPort = (server_id, port_id) => {
  return dispatch => {
    serverPortGet(server_id, port_id).then(response => {
      const data = handleResponse(dispatch, response);
      if (data) {
        dispatch({
          type: ADD_SERVER_PORT,
          payload: data
        })
      }
    })
  }
}

export const editServerPort = (server_id, port_id, data) => {
  return dispatch => {
    serverPortEdit(server_id, port_id, data).then(response => {
      const data = handleResponse(dispatch, response);
      if (data) {
        dispatch({
          type: ADD_SERVER_PORT,
          payload: data
        })
      }
    })
  }
}

export const getServerPortUsers = (server_id, port_id) => {
  return dispatch => {
    serverPortUsersGet(server_id, port_id).then(response => {
      const data = handleResponse(dispatch, response)
      if (data) {
        dispatch({
          type: ADD_SERVER_PORT_USERS,
          payload: data
        })
      }
    })
  }
}

export const createServerPortUser = (server_id, port_id, data) => {
  return dispatch => {
    serverPortUserCreate(server_id, port_id, data).then(response => {
      const data = handleResponse(dispatch, response)
      if (data) {
        dispatch({
          type: ADD_SERVER_PORT_USER,
          payload: data
        })
      }
    })
  }
}

export const deleteServerPortUser = (server_id, port_id, user_id) => {
  return dispatch => {
    serverPortUserDelete(server_id, port_id, user_id).then(response => {
      const data = handleResponse(dispatch, response)
      if (data) {
        dispatch({
          type: DELETE_SERVER_PORT_USER,
          payload: data
        })
      }
    })
  }
}

export const getServerPortForwardRule = (server_id, port_id) => {
  return (dispatch) => {
    serverPortForwardRuleGet(server_id, port_id).then((response) => {
      const data = handleResponse(dispatch, response);
      if (data) {
        dispatch({
          type: ADD_SERVER_PORT_FORWARD_RULE,
          payload: {
            server_id: server_id,
            port_id: port_id,
            ...data,
          },
        });
        if (data.status === "running" || data.status === "starting") {
          setTimeout(
            () => dispatch(getServerPortForwardRule(server_id, port_id)),
            2000
          );
        }
      }
    });
  };
};

export const clearServerPorts = () => {
  return (dispatch) => {
    dispatch({
      type: DELETE_SERVER_PORTS,
    });
  };
};

export const getServerPorts = (server_id) => {
  return (dispatch) => {
    serverPortsGet(server_id).then((response) => {
      const data = handleResponse(dispatch, response);
      if (data) {
      dispatch({
        type: ADD_SERVER_PORTS,
        payload: data,
      });

      }
    });
  };
};

export const createForwardRule = (server_id, port_id, data) => {
  return (dispatch) => {
    serverPortForwardRuleCreate(server_id, port_id, data).then((response) => {
      const data = handleResponse(dispatch, response);
      if (data) {
        dispatch({
          type: ADD_SERVER_PORT_FORWARD_RULE,
          payload: {
            server_id: server_id,
            port_id: port_id,
            ...data,
          },
        });
        if (data.status === "running" || data.status === "starting") {
          setTimeout(
            () => dispatch(getServerPortForwardRule(server_id, port_id)),
            2000
          );
        }
      }
    });
  };
};
export const editForwardRule = (server_id, port_id, data) => {
  return (dispatch) => {
    serverPortForwardRuleEdit(server_id, port_id, data).then((response) => {
      const data = handleResponse(dispatch, response);
      if (data) {
        dispatch({
          type: ADD_SERVER_PORT_FORWARD_RULE,
          payload: {
            server_id: server_id,
            port_id: port_id,
            ...data,
          },
        });
        if (data.status === "running" || data.status === "starting") {
          setTimeout(
            () => dispatch(getServerPortForwardRule(server_id, port_id)),
            2000
          );
        }
      }
    });
  };
};
export const deleteForwardRule = (server_id, port_id) => {
  return (dispatch) => {
    serverPortForwardRuleDelete(server_id, port_id).then((response) => {
      const data = handleResponse(dispatch, response);
      if (data) {
        dispatch({
          type: DELETE_SERVER_PORT_FORWARD_RULE,
          payload: {
            server_id: server_id,
            port_id: port_id,
          },
        });
      }
    });
  };
};
