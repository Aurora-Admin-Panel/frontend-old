import { combineReducers } from "redux";
import auth from "./auth";
import banner from "./banner";
import ports from "./ports";
import users from "./users";
import servers from "./servers";
import artifacts from "./artifacts";

export default combineReducers({ auth, servers, ports, users, banner, artifacts });
