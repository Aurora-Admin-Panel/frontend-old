import { v1AuthRequest } from "../../utils/api";

export const serversGet = () => v1AuthRequest({
    method: "get",
    url: '/servers'
})

export const serverGet = (server_id) => v1AuthRequest({
    method: "get",
    url: `/servers/${server_id}`
})

export const serverCreate = data => v1AuthRequest({
    method: "post",
    url: `/servers`,
    data: data
})

export const serverEdit = (server_id, data) => v1AuthRequest({
    method: "put",
    url: `/servers/${server_id}`,
    data: data
})

export const serverDelete = (server_id) => v1AuthRequest({
    method: "delete",
    url: `/servers/${server_id}`,
})

export const serverConnect = (server_id, data) => v1AuthRequest({
    method: "post",
    url: `/servers/${server_id}/connect`,
    data: data
})

export const serverUsersGet = (server_id) => v1AuthRequest({
    method: "get",
    url: `/servers/${server_id}/users`
})

export const serverUserCreate = (server_id, data) => v1AuthRequest({
    method: "post",
    url: `/servers/${server_id}/users`,
    data: data
})

export const serverUserEdit = (server_id, user_id, data) => v1AuthRequest({
    method: "put",
    url: `/servers/${server_id}/users/${user_id}`,
    data: data
})

export const serverUserDelete = (server_id, user_id) => v1AuthRequest({
    method: "delete",
    url: `/servers/${server_id}/users/${user_id}`
})
