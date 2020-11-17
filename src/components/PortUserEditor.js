import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Transition,
} from "@windmill/react-ui";

import {
  getServerPortUsers,
  createServerPortUser,
  deleteServerPortUser,
} from "../redux/actions/ports";
import { getUsers } from "../redux/actions/users";
import { PlusIcon, MinusIcon } from "../icons";

const PortUserEditor = ({ portId, serverId, isModalOpen, setIsModalOpen }) => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  const port = useSelector((state) => state.ports.ports[portId]);
  const [searchText, setSearchText] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    dispatch(getUsers());
  }, []);

  useEffect(() => {
    setIsAdding(false);
    if (isModalOpen && portId) dispatch(getServerPortUsers(portId, port.id));
  }, [isModalOpen]);

  return isModalOpen && (
    <Modal
      className="w-full px-6 py-4 overflow-y-visible bg-white rounded-lg dark:bg-gray-800 sm:rounded-lg sm:m-4 sm:max-w-xl appear-done enter-done"
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
    >
      <ModalHeader>查看/添加用户</ModalHeader>
      <ModalBody>
        <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <Label className="mt-4 flex flex-row justify-end">
            <div className="relative">
              <button
                className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-1 py-1 rounded-md text-sm text-white bg-green-400 border border-transparent active:bg-green-600 hover:bg-green-700 focus:shadow-outline-green"
                onClick={() => {
                  setIsAdding(!isAdding);
                  setSearchText("");
                }}
              >
                <PlusIcon className="w-5 h-5" />
                添加用户
              </button>
              <Transition
                show={isAdding}
                enter="transition ease-in-out duration-150"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in-out duration-150"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="rounded shadow-xl my-2 absolute top-auto right-0">
                  <ul className="list-reset bg-white rounded">
                    <li className="p-2">
                      <Input
                        className="border-2 rounded h-8 w-full"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                      />
                    </li>
                    {Object.keys(users).map((user_id) => {
                      if (
                        !port.allowed_users.find(
                          (u) => parseInt(u.user_id) === parseInt(user_id)
                        ) &&
                        (searchText === "" ||
                          users[user_id].email.includes(searchText))
                      )
                        return (
                          <li
                            key={`port_user_editor_add_${user_id}`}
                            onClick={() =>
                              dispatch(
                                createServerPortUser(serverId, portId, {
                                  user_id,
                                })
                              )
                            }
                          >
                            <p className="p-2 block text-black hover:bg-green-100 cursor-pointer">
                              {users[user_id].email}
                            </p>
                          </li>
                        );
                      else return null;
                    })}
                  </ul>
                </div>
              </Transition>
            </div>
          </Label>
          {port && port.allowed_users
            ? port.allowed_users.map((user, idx) => (
                <Label className="mt-4" key={`port_user_editor_users_${idx}`}>
                  <div className="flex flew-row justify-between items-center text-gray-500 focus-within:text-purple-600 dark:focus-within:text-purple-400">
                    <span className="mt-1 flex flex-auto ml-2">
                      {user.user.email}
                    </span>
                    <button
                      className="flex w-auto h-5 px-1 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-500 border border-transparent rounded active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-red"
                      onClick={() =>
                        dispatch(
                          deleteServerPortUser(serverId, portId, user.user_id)
                        )
                      }
                    >
                      <MinusIcon className="w-5 h-5" />
                    </button>
                  </div>
                </Label>
              ))
            : null}
        </div>
      </ModalBody>
      <ModalFooter>
        <div className="hidden sm:block">
          <Button layout="outline" onClick={() => setIsModalOpen(false)}>
            取消
          </Button>
        </div>
        <div className="block w-full sm:hidden">
          <Button
            block
            size="large"
            layout="outline"
            onClick={() => setIsModalOpen(false)}
          >
            取消
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default PortUserEditor;
