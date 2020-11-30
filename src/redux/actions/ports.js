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
} from "../apis/ports";
import {
  ADD_SERVER_PORTS,
  DELETE_SERVER_PORTS,
  ADD_SERVER_PORT,
  DELETE_SERVER_PORT,
  ADD_SERVER_PORT_USAGE,
  ADD_SERVER_PORT_USERS,
  ADD_SERVER_PORT_USER,
  DELETE_SERVER_PORT_USER,
  ADD_SERVER_PORT_FORWARD_RULE,
  DELETE_SERVER_PORT_FORWARD_RULE,
} from "../actionTypes";

export const createServerPort = (server_id, data) => {
  return (dispatch) => {
    serverPortCreate(server_id, data)
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

export const deleteServerPort = (server_id, port_id) => {
  return (dispatch) => {
    serverPortDelete(server_id, port_id)
      .then((response) => {
        const data = response.data;
        if (data) {
          dispatch({
            type: DELETE_SERVER_PORT,
            payload: data,
          });
        }
      })
      .catch((error) => {
        handleError(dispatch, error);
      });
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

export const editServerPort = (server_id, port_id, data) => {
  return (dispatch) => {
    serverPortEdit(server_id, port_id, data)
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
    dispatch({
      type: DELETE_SERVER_PORTS,
    });
  };
};

export const getServerPorts = (server_id) => {
  return (dispatch) => {
    serverPortsGet(server_id)
      .then((response) => {
        const data = response.data;
        if (data) {
          dispatch({
            type: ADD_SERVER_PORTS,
            payload: data,
          });
          for (const port of data) {
              if (port.forward_rule && (port.forward_rule.status === "running" || port.forward_rule.status === "starting")) {
                setTimeout(
                  () => dispatch(getServerPortForwardRule(port.server_id, port.id)),
                  2000
                );
              }
          }
        }
      })
      .catch((error) => handleError(dispatch, error));
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