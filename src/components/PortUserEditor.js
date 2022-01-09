import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Label,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@windmill/react-ui";
import Modal from '../components/Modals/Modal'

import {
  getServerPortUsers,
  deleteServerPortUser,
} from "../redux/actions/ports";
import ServerPortUserAdd from "../components/Buttons/ServerPortUserAdd";
import { getUsers } from "../redux/actions/users";


const PortUserEditor = ({ portId, serverId, isModalOpen, setIsModalOpen }) => {
  const port = useSelector((state) => state.ports.ports.ports.items ? state.ports.ports.ports.items.find(p => p.id === portId) : undefined);
  const [isAdding, setIsAdding] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsAdding(false);
    if (isModalOpen && serverId) dispatch(getServerPortUsers(serverId, portId));
    if (isModalOpen) dispatch(getUsers(1, 5));
  }, [isModalOpen, dispatch, portId, serverId]);

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
            <ServerPortUserAdd
              serverId={serverId}
              portId={portId}
              addingType="port"
              allowedUsers={port.allowed_users}
              isAdding={isAdding}
              setIsAdding={setIsAdding}
            />
          </Label>
          {port && port.allowed_users
            ? port.allowed_users.map((user, idx) => (
              <Label className="mt-4" key={`port_user_editor_users_${idx}`}>
                <div className="flex flex-row flex-wrap justify-start items-center">
                  <div className="flex w-1/2 items-center text-gray-500 focus-within:text-purple-600 dark:focus-within:text-purple-400">
                    <span className="flex flex-auto ml-2">
                      {user.user.email}
                    </span>
                  </div>
                  <div className="flex flex-row w-1/2 justify-end  items-center">
                    <Button className="hidden" />
                    <Button
                      layout="link"
                      aria-label="delete"
                      onClick={e => {
                        e.preventDefault();
                        dispatch(
                          deleteServerPortUser(
                            serverId,
                            portId,
                            user.user_id
                          )
                        )
                      }}
                    >
                      删除
                          </Button>
                  </div>
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
  )
};

export default PortUserEditor;
