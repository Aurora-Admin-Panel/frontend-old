import { SHOW_ERROR, CLEAR_ERROR } from "../actionTypes";


export const handleError = (dispatch, error) => {
  console.log(error);
  if (error.response) {
    const response = error.response;
    if (response.status === 500) {
      dispatch({
        type: SHOW_ERROR,
        payload: { title: "Error", body: "Internal Server Error!" },
      });
    } else if (response.status >= 400 && response.status < 500) {
      const data = response.data;
      if (typeof data.detail === "string" || data.detail instanceof String) {
        dispatch({
          type: SHOW_ERROR,
          payload: { title: "Error", body: data.detail },
        });
      } else if (Array.isArray(data.detail)) {
        dispatch({
          type: SHOW_ERROR,
          payload: {
            title: data.detail[0].type,
            body: data.detail[0].msg,
          },
        });
      }
    } else {
      dispatch({
        type: SHOW_ERROR,
        payload: { title: "Error", body: JSON.stringify(response) },
      });
    }
  } else {
    dispatch({
      type: SHOW_ERROR,
      payload: { title: "Error", body: error.toString() },
    });
  }
  setTimeout(() => dispatch({ type: CLEAR_ERROR }), 3000);
};
