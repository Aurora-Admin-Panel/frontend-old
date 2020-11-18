import { SHOW_BANNER, CLEAR_BANNER } from "../actionTypes";

export const showBanner = (title="", body="", type='error') => {
  return (dispatch) => {
    dispatch({
      type: SHOW_BANNER,
      payload: { title, body, type },
    });
    setTimeout(() => dispatch({ type: CLEAR_BANNER }), 3000);
  };
};

export const clearBanner = () => {
  return (dispatch) => {
    dispatch({
      type: CLEAR_BANNER,
    });
  };
};
