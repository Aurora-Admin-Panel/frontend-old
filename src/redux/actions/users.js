import { handleError } from "./utils";
import { usersGet, userGet, userEdit, userDelete } from "../apis/users";
import { ADD_USERS, ADD_USER, DELETE_USER } from "../actionTypes";

export const getUsers = () => {
  return (dispatch) => {
    usersGet().then((response) => {
      const data = response.data
      if (data) {
        dispatch({
          type: ADD_USERS,
          payload: data,
        });
      }
    }).catch(error => handleError(dispatch, error))
  };
};

export const getUser = (user_id) => {
  return (dispatch) => {
    userGet(user_id).then((response) => {
      const data = response.data
      if (data) {
        dispatch({
          type: ADD_USER,
          payload: data,
        });
      }
    }).catch(error => handleError(dispatch, error))
  };
};

export const editUser = (user_id, data) => {
  return (dispatch) => {
    userEdit(user_id, data).then((response) => {
      const data = response.data
      if (data) {
        dispatch({
          type: ADD_USER,
          payload: data,
        });
      }
    }).catch(error => handleError(dispatch, error))
  };
};

export const deleteUser = (user_id) => {
  return (dispatch) => {
    userDelete(user_id).then((response) => {
      const data = response.data
      if (data) {
        dispatch({
          type: DELETE_USER,
          payload: data,
        });
      }
    }).catch(error => handleError(dispatch, error))
  };
};
