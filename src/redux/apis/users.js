import { v1AuthRequest } from "../../utils/api";

export const getMe = () => v1AuthRequest({
    method: "get",
    url: '/users/me'
})

export const editMe = (user_id, data) => v1AuthRequest({
    method: "put",
    url: `/users/${user_id}`,
    data: data
})