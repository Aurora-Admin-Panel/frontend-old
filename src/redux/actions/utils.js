import { SHOW_ERROR } from "../actionTypes"


export const handleResponse = (dispatch, response) => {
    if (response.status === 500) {
        dispatch({ type: SHOW_ERROR, payload: { title: "Error", body: "Internal Server Error!" }})
        return null;
      }
      const data = response.data;
      if (response.status >= 400 && response.status < 500) {
        if (typeof data.detail === 'string' || data.detail instanceof String) {
            dispatch({ type: SHOW_ERROR, payload: { title: "Error", body: data.detail }})
        } else if (Array.isArray(data.detail)) {
            dispatch({ type: SHOW_ERROR, payload: { title: data.detail[0].type, body: data.detail[0].msg }})
        }
        dispatch({ type: SHOW_ERROR, payload: { title: "Error", body: data }})
        return null
      }
      return data.length > 0 ? data : null
}