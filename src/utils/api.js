import axios from 'axios'

import { store } from '../redux/store'
import { BACKEND_URL } from "../config";


export const apiRequest = request => axios({...request, url: `${BACKEND_URL}/api${request.url}`});
export const v1Request = request => axios({...request, url: `${BACKEND_URL}/api/v1${request.url}`});
export const v1AuthRequest = request => axios({
  ...request,
  url: `${BACKEND_URL}/api/v1${request.url}`,
  headers: {...request.headers, Authorization: `Bearer ${store.getState().auth.token}`}
});
