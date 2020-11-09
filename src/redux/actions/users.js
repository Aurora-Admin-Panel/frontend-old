import { usersGet, userGet, userEdit, userDelete } from "../apis/users";
import { ADD_USERS, ADD_USER, DELETE_USER } from "../actionTypes";


export const getUsers = () => {
  return (dispatch) => {
    usersGet().then((response) => {
      if (response.status >= 300) {
        console.log(response);
        return;
      }
      const data = response.data;
      dispatch({
        type: ADD_USERS,
        payload: data,
      });
    });
  };
};

export const getUser = (user_id) => {
  return (dispatch) => {
    userGet(user_id).then((response) => {
      if (response.status >= 300) {
        console.log(response);
        return;
      }
      const data = response.data;
      dispatch({
        type: ADD_USER,
        payload: data,
      });
    });
  };
};

export const editUser = (user_id, data) => {
  return (dispatch) => {
    userEdit(user_id, data).then((response) => {
      if (response.status >= 300) {
        console.log(response);
        return;
      }
      const data = response.data;
      dispatch({
        type: ADD_USER,
        payload: data,
      });
    });
  };
};

export const deleteUser = (user_id) => {
  return (dispatch) => {
    userDelete(user_id).then((response) => {
      if (response.status >= 300) {
        console.log(response);
        return;
      }
      const data = response.data;
      dispatch({
        type: DELETE_USER,
        payload: data,
      });
    });
  };
};
