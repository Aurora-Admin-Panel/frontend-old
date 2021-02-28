import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Input,
  Dropdown,
  DropdownItem,
} from "@windmill/react-ui";

import FullScreenLoading from "../FullScreenLoading";
import { createServerUser } from "../../redux/actions/servers";
import { createServerPortUser } from "../../redux/actions/ports";
import { getUsers } from "../../redux/actions/users";
import { PlusIcon } from "../../icons";

const ServerPortUserAdd = ({
  serverId,
  portId,  
  addingType = "server",
  allowedUsers= [],
  isAdding,
  setIsAdding,
}) => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.users.users);
  const [searchText, setSearchText] = useState("");
  const addUser = (user_id) => {
    if (addingType === "port") {
        dispatch(createServerPortUser(serverId, portId, { user_id }))
    } else {
        dispatch(createServerUser(serverId, { user_id }))
    }
    setIsAdding(false)
  }
  const searchUsers = (e) => {
    setSearchText(e.target.value)
    dispatch(getUsers(1, 10, e.target.value))
  }

  return (
    <div className="relative">
      <button className="hidden" />
      <button
        className={
          addingType === "port"
            ? "align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-1 py-1 rounded-md text-sm text-white bg-green-400 border border-transparent active:bg-green-600 hover:bg-green-700 focus:shadow-outline-green"
            : "align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2 rounded-lg text-sm text-white bg-purple-600 border border-transparent active:bg-purple-600 hover:bg-purple-700 focus:shadow-outline-purple"
        }
        onClick={e => {
          e.preventDefault();
          setIsAdding(!isAdding);
          setSearchText("");
        }}
      >
        <PlusIcon className="w-5 h-5" />
        添加用户
      </button>
      <Dropdown
        align="right"
        isOpen={isAdding}
        onClose={() => setIsAdding(false)}
      >
        <DropdownItem>
          <Input
            autoFocus
            className="border-2 rounded h-8 w-full"
            value={searchText}
            onChange={(e) => searchUsers(e)}
          />
        </DropdownItem>
        {loading ? <FullScreenLoading />
          : users.items
          .filter(
            user => !allowedUsers.find((u) => parseInt(u.user_id) === parseInt(user.id)))
          .map((user) => (
            <DropdownItem
              className={user.is_ops ? "text-purple-700" : ""}
              key={`server_port_user_add_${user.id}`}
              onClick={() => addUser(user.id)}
            >
                {user.email}
            </DropdownItem>
          ))}
      </Dropdown>
    </div>
  );
};

export default ServerPortUserAdd;
