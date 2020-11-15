import axios from 'axios'

import { store } from '../redux/store'


export const apiRequest = request => axios({...request, url: `/api${request.url}`});
export const v1Request = request => axios({...request, url: `/api/v1${request.url}`});
export const v1AuthRequest = request => axios({
  ...request,
  url: `/api/v1${request.url}`,
  headers: {...request.headers, Authorization: `Bearer ${store.getState().auth.token}`}
});
