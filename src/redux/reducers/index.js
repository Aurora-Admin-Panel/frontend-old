import { combineReducers } from "redux";
import todos from "./todos";
import auth from "./auth";
import servers from "./servers";
import ports from "./ports"

export default combineReducers({ todos, auth, servers, ports });
