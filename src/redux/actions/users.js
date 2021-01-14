import { handleError } from "./utils";
import { showBanner } from "./banner";
import {
  usersGet,
  userGet,
  userEdit,
  userDelete,
  meGet,
  meEdit,
  userCreate,
  userServersGet,
} from "../apis/users";
import {
  ADD_USERS,
  ADD_USER,
  DELETE_USER,
  ADD_ME,
  DELETE_ME,
  ADD_USER_SERVERS,
  DELETE_USER_SERVERS,
} from "../actionTypes";

export const getUsers = () => {
  return (dispatch) => {
    usersGet()
      .then((response) => {
        const data = response.data;
        if (data) {
          dispatch({
            type: ADD_USERS,
            payload: data,
          });
        }
      })
      .catch((error) => handleError(dispatch, error));
  };
};

export const getUser = (user_id) => {
  return (dispatch) => {
    userGet(user_id)
      .then((response) => {
        const data = response.data;
        if (data) {
          dispatch({
            type: ADD_USER,
            payload: data,
          });
        }
      })
      .catch((error) => handleError(dispatch, error));
  };
};

export const createUser = (data) => {
  return (dispatch) => {
    userCreate(data)
      .then((response) => {
        const data = response.data;
        if (data) {
          dispatch({
            type: ADD_USER,
            payload: data,
          });
        }
      })
      .catch((error) => handleError(dispatch, error));
  };
};

export const editUser = (user_id, data) => {
  return (dispatch) => {
    userEdit(user_id, data)
      .then((response) => {
        const data = response.data;
        if (data) {
          dispatch({
            type: ADD_USER,
            payload: data,
          });
        }
      })
      .catch((error) => handleError(dispatch, error));
  };
};

export const deleteUser = (user_id, data) => {
  return (dispatch) => {
    userDelete(user_id, data)
      .then((response) => {
        const data = response.data;
        if (data) {
          dispatch({
            type: DELETE_USER,
            payload: data,
          });
        }
      })
      .catch((error) => handleError(dispatch, error));
  };
};

export const getMe = () => {
  return (dispatch) => {
    meGet()
      .then((response) => {
        const data = response.data;
        if (data) {
          dispatch({
            type: ADD_ME,
            payload: data,
          });
        }
      })
      .catch((error) => handleError(dispatch, error));
  };
};

export const editMe = (data) => {
  return (dispatch) => {
    meEdit(data)
      .then((response) => {
        const data = response.data;
        if (data) {
          dispatch(showBanner("用户修改", "修改成功", "success"));
          dispatch({
            type: ADD_ME,
            payload: data,
          });
        }
      })
      .catch((error) => handleError(dispatch, error));
  };
};

export const deleteMe = () => {
  return (dispatch) => {
    dispatch({
      type: DELETE_ME,
    });
  };
};

export const getUserServers = (user_id) => {
  return (dispatch) => {
    userServersGet(user_id)
      .then((response) => {
        const data = response.data;
        if (data) {
          dispatch({
            type: ADD_USER_SERVERS,
            payload: data,
          });
        }
      })
      .catch((error) => handleError(dispatch, error));
  };
};

export const deleteUserServers = () => {
  return (dispatch) => {
    dispatch({
      type: DELETE_USER_SERVERS,
    });
  };
};
