import qs from 'querystring'
import { apiRequest  } from "../../utils/api";

export const logIn = data => apiRequest({
  method: "post",
  url: '/token',
  data: qs.encode(data),
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
});

export const register = data => apiRequest({
  method: "post",
  url: '/signup',
  data: qs.encode(data),
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})