import { v1AuthRequest } from "../../utils/api";

export const meGet = () => v1AuthRequest({
    method: "get",
    url: '/users/me'
})
export const meEdit = (data) => v1AuthRequest({
    method: "put",
    url: '/users/me',
    data: data
})

export const usersGet = (user_id) => v1AuthRequest({
    method: "get",
    url: `/users`,
})

export const userCreate = (data) => v1AuthRequest({
    method: "post",
    url: `/users`,
    data: data
})

export const userGet = (user_id) => v1AuthRequest({
    method: "get",
    url: `/users/${user_id}`,
})

export const userEdit = (user_id, data) => v1AuthRequest({
    method: "put",
    url: `/users/${user_id}`,
    data: data
})

export const userDelete = (user_id) => v1AuthRequest({
    method: "delete",
    url: `/users/${user_id}`,
})