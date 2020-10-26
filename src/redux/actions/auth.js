import decodeJwt from "jwt-decode";

import { logIn, register } from "../apis/auth";
import { LOG_IN, LOG_OUT } from "../actionTypes";

export const isAuthenticated = () => {
  const permissions = localStorage.getItem("permissions");
  if (!permissions) {
    return false;
  }
  return permissions === "user" || permissions === "admin";
};

export const login = (email, password) => {
  return (dispatch) => {
    // Assert email or password is not empty
    if (!(email.length > 0) || !(password.length > 0)) {
      throw new Error("Email or password was not provided");
    }
    logIn({ username: email, password: password }).then((response) => {
      if (response.status === 500) {
        throw new Error("Internal server error");
      }
      const data = response.data;
      if (response.status > 400 && response.status < 500) {
        if (data.detail) {
          throw data.detail;
        }
        throw data;
      }
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
      }
    });
  };
};

export const signUp = (email, password) => {
  return (dispatch) => {
    if (!(email.length > 0)) {
      throw new Error("Email was not provided");
    }
    if (!(password.length > 0)) {
      throw new Error("Password was not provided");
    }

    register({ username: email, password: password }).then((response) => {
      if (response.status === 500) {
        throw new Error("Internal server error");
      }
      const data = response.data;
      if (response.status > 400 && response.status < 500) {
        if (data.detail) {
          throw data.detail;
        }
        throw data;
      }
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
      }
    });
  };
};

export const logout = () => {
  return (dispatch) => {
    localStorage.removeItem("token");
    localStorage.removeItem("permissions");
    dispatch({
      type: LOG_OUT
    });
  };
};
