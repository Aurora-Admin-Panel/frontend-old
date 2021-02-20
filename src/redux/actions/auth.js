import decodeJwt from "jwt-decode";

import { handleError } from "./utils"
import { getMe } from "./users"; 
import { logIn, register } from "../apis/auth";
import { LOG_IN, LOG_OUT, DELETE_ME } from "../actionTypes";

export const isAuthenticated = () => {
  const permissions = localStorage.getItem("permissions");
  return !!permissions;
};

export const login = (email, password) => {
  return (dispatch) => {
    // Assert email or password is not empty
    if (!(email.length > 0) || !(password.length > 0)) {
      throw new Error("Email or password was not provided");
    }
    logIn({ username: email, password: password }).then((response) => {
      const data = response.data;
      console.log(data)
      if ("access_token" in data) {
        const decodedToken = decodeJwt(data["access_token"]);
        localStorage.setItem("token", data["access_token"]);
        localStorage.setItem("permissions", decodedToken.permissions);
        dispatch({
          type: LOG_IN,
          payload: {
            token: data["access_token"],
            permission: decodedToken.permissions,
          },
        });
        dispatch(getMe());
      }
    }).catch(error => handleError(dispatch, error))
  };
};

export const signUp = (email, password) => {
  return (dispatch) => {
    register({ username: email, password: password }).then((response) => {
      const data = response.data;
      if ("access_token" in data) {
        const decodedToken = decodeJwt(data["access_token"]);
        localStorage.setItem("token", data["access_token"]);
        localStorage.setItem("permissions", decodedToken.permissions);
        dispatch({
          type: LOG_IN,
          payload: {
            token: data["access_token"],
            permission: decodedToken.permissions,
          },
        });
        dispatch(getMe());
      }
    }).catch(error => handleError(dispatch, error))
  };
};

export const logout = () => {
  return (dispatch) => {
    localStorage.removeItem("token");
    localStorage.removeItem("permissions");
    dispatch({
      type: LOG_OUT
    });
    dispatch({
      type: DELETE_ME
    })
  };
};
