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
  LOAD_USERS,
  ADD_CURRENT_USER,
  LOAD_CURRENT_USER,
  ADD_ME,
  DELETE_ME,
  LOAD_USER_SERVERS,
  ADD_USER_SERVERS,
  DELETE_USER_SERVERS,
} from "../actionTypes";
import { store } from '../store';

export const getUsers = (page = null, size = null, query = null) => {
  return (dispatch) => {
    dispatch({ type: LOAD_USERS })
    const users = store.getState().users.users.users;
    if (page === null) {
      page = users['page']+1 || 1
    }
    if (size === null) {
      size = users['size'] || 20
    }
    usersGet(page, size, query)
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

export const getCurrentUser = (user_id) => {
  return (dispatch) => {
    dispatch({ type: LOAD_CURRENT_USER })
    userGet(user_id)
      .then((response) => {
        const data = response.data;
        if (data) {
          dispatch({
            type: ADD_CURRENT_USER,
            payload: data,
          });
        }
      })
      .catch((error) => handleError(dispatch, error));
  };
};

export const createUser = (data) => {
  return (dispatch) => {
    dispatch({ type: LOAD_USERS })
    userCreate(data)
      .catch((error) => handleError(dispatch, error))
      .then(() => dispatch(getUsers()))
  };
};

export const editUser = (user_id, data) => {
  return (dispatch) => {
    dispatch({ type: LOAD_USERS })
    userEdit(user_id, data)
      .catch((error) => handleError(dispatch, error))
      .then(() => dispatch(getUsers()))
  };
};

export const deleteUser = (user_id, data) => {
  return (dispatch) => {
    dispatch({ type: LOAD_USERS })
    userDelete(user_id, data)
      .catch((error) => handleError(dispatch, error))
      .then(() => dispatch(getUsers()))
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
    dispatch({ type: LOAD_USER_SERVERS })
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
