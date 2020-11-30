import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Input,
  Dropdown,
  DropdownItem,
} from "@windmill/react-ui";

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
  const users = useSelector((state) => state.users.users);
  const [searchText, setSearchText] = useState("");
  const addUser = (user_id) => {
    if (addingType === "port") {
        dispatch(createServerPortUser(serverId, portId, { user_id }))
    } else {
        dispatch(createServerUser(serverId, { user_id }))
    }
    setIsAdding(false)
  }

  useEffect(() => {
    if (isAdding) dispatch(getUsers());
  }, [isAdding, dispatch]);

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
            onChange={(e) => setSearchText(e.target.value)}
          />
        </DropdownItem>
        {Object.keys(users)
          .filter(
            (user_id) =>
              !allowedUsers.find(
                (u) => parseInt(u.user_id) === parseInt(user_id)
              ) &&
              (searchText === "" || users[user_id].email.includes(searchText))
          )
          .slice(0, 10)
          .map((user_id) => (
            <DropdownItem
              key={`server_port_user_add_${user_id}`}
              onClick={() => addUser(user_id)}
            >
                {users[user_id].email}
            </DropdownItem>
          ))}
      </Dropdown>
    </div>
  );
};

export default ServerPortUserAdd;
