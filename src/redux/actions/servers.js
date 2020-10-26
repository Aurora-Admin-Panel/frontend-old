import { serversGet, serverGet } from "../apis/servers"
import { ADD_SERVERS, ADD_SERVER } from "../actionTypes"

export const getServers = () => {
    return dispatch => {
        serversGet()
            .then(response => {
                if (response.status === 500) {
                    throw new Error('Internal server error');
                  }
                const data = response.data
                if (response.status > 400 && response.status < 500) {
                    if (data.detail) {
                      throw data.detail;
                    }
                    throw data;
                  }
                  dispatch({
                      type: ADD_SERVERS,
                      payload: data
                  })
            })
    }
}

export const getServer = (server_id) => {
    return dispatch => {
        serverGet(server_id)
            .then(response => {
                if (response.status === 500) {
                    throw new Error('Internal server error');
                  }
                const data = response.data
                if (response.status > 400 && response.status < 500) {
                    if (data.detail) {
                      throw data.detail;
                    }
                    throw data;
                  }
                  dispatch({
                      type: ADD_SERVER,
                      payload: data
                  })
            })
    }
}