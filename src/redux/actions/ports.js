import {
  serverPortsGet,
  serverPortGet,
  serverPortForwardRuleGet,
  serverPortForwardRuleCreate,
  serverPortForwardRuleEdit,
  serverPortForwardRuleDelete,
} from "../apis/ports";
import { ADD_SERVER_PORTS, ADD_SERVER_PORT_FORWARD_RULE, DELETE_SERVER_PORT_FORWARD_RULE } from "../actionTypes";

export const getServerPortForwardRule = (server_id, port_id) => {
  return (dispatch) => {
    serverPortForwardRuleGet(server_id, port_id).then((response) => {
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
            1000
          );
        }
      }
    });
  };
};

export const getServerPorts = (server_id) => {
  return (dispatch) => {
    serverPortsGet(server_id).then((response) => {
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
        type: ADD_SERVER_PORTS,
        payload: data,
      });
      for (const port of data) {
        dispatch(getServerPortForwardRule(server_id, port.id));
      }
    });
  };
};

export const createForwardRule = (server_id, port_id, data) => {
  return (dispatch) => {
    serverPortForwardRuleCreate(server_id, port_id, data).then((response) => {
      if (response.status === 500) {
        throw new Error("Internal server error");
      }
      if (response.status === 404) {
          return 
      }
      const data = response.data;
      if (response.status > 400 && response.status < 500) {
        if (data.detail) {
          throw data.detail;
        }
        throw data;
      }
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
      if (response.status === 500) {
        throw new Error("Internal server error");
      }
      if (response.status === 404) {
          return 
      }
      const data = response.data;
      if (response.status > 400 && response.status < 500) {
        if (data.detail) {
          throw data.detail;
        }
        throw data;
      }
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
      if (response.status === 500) {
        throw new Error("Internal server error");
      }
      if (response.status === 404) {
          return 
      }
      const data = response.data;
      if (response.status > 400 && response.status < 500) {
        if (data.detail) {
          throw data.detail;
        }
        throw data;
      }
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
