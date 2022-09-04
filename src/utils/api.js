import axios from 'axios'
import { store } from '../redux/store'
import { DEV_HOST } from '../config/config'

const host = process.env.NODE_ENV !== 'production' ? DEV_HOST : ''

export const apiRequest = request => axios({
    ...request,
    url: `${host}/api${request.url}`,
});

export const v1Request = request => axios({
    ...request,
    url: `${host}/api/v1${request.url}`
});

export const v1AuthRequest = request => axios({
  ...request,
  url: `${host}/api/v1${request.url}`,
  headers: {...request.headers, Authorization: `Bearer ${store.getState().auth.token}`}
});

export const v2AuthRequest = request => axios({
  ...request,
  url: `${host}/api/v2${request.url}`,
  headers: {...request.headers, Authorization: `Bearer ${store.getState().auth.token}`}
});
