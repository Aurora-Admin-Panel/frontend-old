import { logout } from "./auth";
import { SHOW_BANNER, CLEAR_BANNER } from "../actionTypes";


export const handleError = (dispatch, error) => {
  if (error.response) {
    const response = error.response;
    if (response.status === 500) {
      dispatch({
        type: SHOW_BANNER,
        payload: { title: "Error", body: "Internal Server Error!" },
      });
    } else if (response.status === 401) {
      dispatch(logout())
    } else if (response.status >= 400 && response.status < 500) {
      const data = response.data;
      if (typeof data.detail === "string" || data.detail instanceof String) {
        dispatch({
          type: SHOW_BANNER,
          payload: { title: "Error", body: data.detail },
        });
      } else if (Array.isArray(data.detail)) {
        dispatch({
          type: SHOW_BANNER,
          payload: {
            title: data.detail[0].type,
            body: data.detail[0].msg,
          },
        });
      }
    } else {
      dispatch({
        type: SHOW_BANNER,
        payload: { title: "Error", body: JSON.stringify(response) },
      });
    }
  } else {
    dispatch({
      type: SHOW_BANNER,
      payload: { title: "Error", body: error.toString() },
    });
  }
  setTimeout(() => dispatch({ type: CLEAR_BANNER }), 3000);
};
