import { handleError } from "./utils";
import { showBanner } from "./banner"
import {
  serverPortsGet,
  serverPortCreate,
  serverPortGet,
  serverPortEdit,
  serverPortDelete,
  serverPortUsageEdit,
  serverPortUsersGet,
  serverPortUserEdit,
  serverPortUserCreate,
  serverPortUserDelete,
  serverPortForwardRuleGet,
  serverPortForwardRuleCreate,
  serverPortForwardRuleEdit,
  serverPortForwardRuleDelete,
  serverPortForwardRuleArtifactsGet,
} from "../apis/ports";
import {
  ADD_ARTIFACTS,
  ADD_SERVER_PORTS,
  LOAD_SERVER_PORTS,
  DELETE_SERVER_PORTS,
  ADD_SERVER_PORT,
  ADD_SERVER_PORT_USAGE,
  ADD_SERVER_PORT_USERS,
  ADD_SERVER_PORT_USER,
  DELETE_SERVER_PORT_USER,
  ADD_SERVER_PORT_FORWARD_RULE,
  DELETE_SERVER_PORT_FORWARD_RULE,
  GET_TLS_PROVIDER_PORT,
} from "../actionTypes";
import { store } from "../store";

export const loadServerPorts = () => {
  return dispatch => {
    dispatch({ type: LOAD_SERVER_PORTS });
  }
}

export const getServerPorts = (server_id, page = null, size = null) => {
  return (dispatch) => {
    dispatch({ type: LOAD_SERVER_PORTS });
    const ports = store.getState().ports.ports.ports;
    if (page === null) {
      page = ports['page'] + 1 || 1
    }
    if (size === null) {
      size = ports['size'] || 10
    }
    serverPortsGet(server_id, page, size)
      .then((response) => {
        const data = response.data;
        if (data) {
          dispatch({
            type: ADD_SERVER_PORTS,
            payload: data,
          });
        }
      })
      .catch((error) => handleError(dispatch, error));
  };
};

export const createServerPort = (server_id, data) => {
  return async (dispatch) => {
    dispatch({ type: LOAD_SERVER_PORTS })
    return serverPortCreate(server_id, data)
      .catch((error) => handleError(dispatch, error))
  };
};

export const deleteServerPort = (server_id, port_id) => {
  return (dispatch) => {
    serverPortDelete(server_id, port_id)
      .catch((error) => handleError(dispatch, error))
      .then(() => dispatch(getServerPorts(server_id)))
  };
};

export const editServerPort = (server_id, port_id, data) => {
  return (dispatch) => {
    serverPortEdit(server_id, port_id, data)
      .catch((error) => handleError(dispatch, error))
      .then(() => dispatch(getServerPorts(server_id)))
  };
};

export const getServerPort = (server_id, port_id) => {
  return (dispatch) => {
    serverPortGet(server_id, port_id)
      .then((response) => {
        const data = response.data;
        if (data) {
          dispatch({
            type: ADD_SERVER_PORT,
            payload: data,
          });
        }
      })
      .catch((error) => handleError(dispatch, error));
  };
};

export const getTlsProviderPort = (server_id, port_id) => {
  return (dispatch) => {
    serverPortGet(server_id, port_id)
    .then((response) => {
      const data = response.data;
      if (data) {
        dispatch({
          type: GET_TLS_PROVIDER_PORT,
          payload: data,
        });
      }
    })
    .catch((error) => handleError(dispatch, error));
  }
}

export const getServerPortUsers = (server_id, port_id) => {
  return (dispatch) => {
    serverPortUsersGet(server_id, port_id)
      .then((response) => {
        const data = response.data;
        if (data) {
          dispatch({
            type: ADD_SERVER_PORT_USERS,
            payload: data,
          });
        }
      })
      .catch((error) => handleError(dispatch, error));
  };
};

export const createServerPortUser = (server_id, port_id, data) => {
  return (dispatch) => {
    serverPortUserCreate(server_id, port_id, data)
      .then((response) => {
        const data = response.data;
        if (data) {
          dispatch({
            type: ADD_SERVER_PORT_USER,
            payload: data,
          });
        }
      })
      .catch((error) => handleError(dispatch, error));
  };
};

export const editServerPortUser = (server_id, port_id, user_id, data) => {
  return (dispatch) => {
    serverPortUserEdit(server_id, port_id, user_id, data)
      .then((response) => {
        const data = response.data;
        if (data) {
          dispatch({
            type: ADD_SERVER_PORT_USER,
            payload: data,
          });
        }
      })
      .catch((error) => handleError(dispatch, error));
  };
};

export const deleteServerPortUser = (server_id, port_id, user_id) => {
  return (dispatch) => {
    serverPortUserDelete(server_id, port_id, user_id)
      .then((response) => {
        const data = response.data;
        if (data) {
          dispatch({
            type: DELETE_SERVER_PORT_USER,
            payload: data,
          });
        }
      })
      .catch((error) => handleError(dispatch, error));
  };
};

export const getServerPortForwardRule = (server_id, port_id) => {
  return (dispatch) => {
    serverPortForwardRuleGet(server_id, port_id)
      .then((response) => {
        const data = response.data;
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
      })
      .catch((error) => handleError(dispatch, error));
  };
};

export const clearServerPorts = () => {
  return (dispatch) => {
    dispatch({ type: DELETE_SERVER_PORTS, });
  };
};


export const createForwardRule = (server_id, port_id, data) => {
  return (dispatch) => {
    serverPortForwardRuleCreate(server_id, port_id, data)
      .then((response) => {
        const data = response.data;
        if (data) {
          dispatch(showBanner("转发添加成功", "正在生效中", "success"))
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
      })
      .catch((error) => handleError(dispatch, error));
  };
};
export const editForwardRule = (server_id, port_id, data) => {
  return (dispatch) => {
    serverPortForwardRuleEdit(server_id, port_id, data)
      .then((response) => {
        const data = response.data;
        if (data) {
          dispatch(showBanner("转发修改成功", "正在生效中", "success"))
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
      })
      .catch((error) => handleError(dispatch, error));
  };
};
export const deleteForwardRule = (server_id, port_id) => {
  return (dispatch) => {
    serverPortForwardRuleDelete(server_id, port_id)
      .then((response) => {
        const data = response.data;
        if (data) {
          dispatch(showBanner("转发删除成功", "正在生效中", "success"))
          dispatch({
            type: DELETE_SERVER_PORT_FORWARD_RULE,
            payload: {
              server_id: server_id,
              port_id: port_id,
            },
          });
        }
      })
      .catch((error) => handleError(dispatch, error));
  };
};
export const editServerPortUsage = (server_id, port_id, data) => {
  return dispatch => {
    serverPortUsageEdit(server_id, port_id, data).then(response => {
      const data = response.data;
      if (data) {
        dispatch(showBanner("重置流量成功", "流量已清零", "success"))
        dispatch({
          type: ADD_SERVER_PORT_USAGE,
          payload: data
        })
      }
    }).catch(error => handleError(dispatch, error))
  }
}

export const artifactsGet = (server_id, port_id) => {
  return dispatch => {
    serverPortForwardRuleArtifactsGet(server_id, port_id).then(response => {
      const data = response.data;
      if (data) {
        dispatch({
          type: ADD_ARTIFACTS,
          payload: {
            server_id, port_id,
            ...data
          }
        })
        if (data.stdout && !data.stdout.includes("PLAY RECAP")) {
          setTimeout(() => dispatch(artifactsGet(server_id, port_id)), 1000);
        }
      }
    }).catch(error => handleError(dispatch, error))
  }
}