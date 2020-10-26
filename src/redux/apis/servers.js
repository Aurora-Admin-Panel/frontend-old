import { v1AuthRequest } from "../../utils/api";

export const serversGet = () => v1AuthRequest({
    method: "get",
    url: '/servers'
})

export const serverGet = (server_id) => v1AuthRequest({
    method: "get",
    url: `/servers/${server_id}`
})
