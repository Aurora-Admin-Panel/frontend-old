import { SHOW_ERROR, CLEAR_ERROR } from "../actionTypes";

export const showError = (title, body) => {
  return (dispatch) => {
    dispatch({
      type: SHOW_ERROR,
      payload: { title, body },
    });
    setTimeout(() => dispatch({ type: CLEAR_ERROR }), 3000);
  };
};

export const clearError = () => {
  return (dispatch) => {
    dispatch({
      type: CLEAR_ERROR,
    });
  };
};
