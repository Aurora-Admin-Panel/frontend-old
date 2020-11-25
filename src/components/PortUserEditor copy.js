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
  Select,
} from "@windmill/react-ui";
import { Minus, Check, X, Pencil } from "phosphor-react";

import {
  getServerPortUsers,
  editServerPortUser,
  createServerPortUser,
  deleteServerPortUser,
} from "../redux/actions/ports";
import ServerPortUserAdd from "../components/Buttons/ServerPortUserAdd";
import { getUsers } from "../redux/actions/users";

const SpeedLimitOptions = [
  { label: "KB", value: 1000 },
  { label: "MB", value: 1000000 },
  { label: "GB", value: 1000000000 },
  { label: "TB", value: 1000000000000 },
];

const setFormattedQuota = (quota, setQuota, setScalar) => {
  if (!quota) {
    setQuota("");
    setScalar(1000)
    return;
  }
  quota = parseInt(quota, 10);
  if (quota % 1000000000000 === 0) {
    setQuota(quota / 1000000000000);
    setScalar(1000000000000);
  } else if (quota % 1000000000 === 0) {
    setQuota(quota / 1000000000);
    setScalar(1000000000);
  } else if (quota % 1000000 === 0) {
    setQuota(quota / 1000000);
    setScalar(1000000);
  } else {
    setQuota(quota / 1000);
    setScalar(1000);
  }
};

const formatQuota = (quota) => {
  if (!quota) return "限流：∞";
  if (quota % 1000000000000 === 0) {
    return `限流：${quota / 1000000000000} TB`
  } else if (quota % 1000000000 === 0) {
    return `限流：${quota / 1000000000} GB`
  } else if (quota % 1000000 === 0) {
    return `限流：${quota / 1000000} MB`
  } else {
    return `限流：${quota / 1000} KB`
  }
}

const PortUserEditor = ({ portId, serverId, isModalOpen, setIsModalOpen }) => {
  const port = useSelector((state) => state.ports.ports[portId]);
  const [quota, setQuota] = useState("");
  const [quotaScalar, setQuotaScalar] = useState(1000);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState({});
  const dispatch = useDispatch();
  const validQuota = () => !quota || quota.length > 0;
  const submitForm = (user_id) => {
    if (!quota) return;
    const data = {
      config: {
        quota: quota * quotaScalar
      }
    }
    dispatch(editServerPortUser(serverId, portId, user_id, data));
  }

  useEffect(() => {
    setIsAdding(false);
    if (isModalOpen && portId) dispatch(getServerPortUsers(portId, port.id));
    if (isModalOpen) dispatch(getUsers());
  }, [isModalOpen]);

  return (
    isModalOpen && (
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
                        {isEditing[user.user_id] ? (
                          <>
                            <div className="w-20">
                              <Input
                                placeholder={"限流"}
                                value={quota}
                                valid={validQuota}
                                onChange={(e) => setQuota(e.target.value)}
                              />
                            </div>
                            <div className="w-20">
                              <Select
                                className="flex"
                                value={quotaScalar}
                                onChange={(e) => setQuotaScalar(e.target.value)}
                              >
                                {SpeedLimitOptions.map((option) => (
                                  <option
                                    value={option.value}
                                    key={`port_user_usage_options_${option.value}`}
                                  >
                                    {option.label}
                                  </option>
                                ))}
                              </Select>
                            </div>
                          </>
                        ) : (
                          <span>{formatQuota(user.config.quota)}</span>
                        )}

                        {!isEditing[user.user_id] ? (
                          <Button
                            icon={Pencil}
                            layout="link"
                            aria-label="Edit"
                            onClick={(e) => {
                              e.preventDefault();
                              setIsEditing({ [user.user_id]: true });
                              setFormattedQuota(user.config.quota, setQuota, setQuotaScalar);
                            }}
                          />
                        ) : null}
                      </div>
                      {isEditing[user.user_id] ? (
                        <div className="mt-1 flex flex-row w-full justify-end">
                          <Button
                            layout="outline"
                            aria-label="delete"
                            onClick={() =>
                              dispatch(
                                deleteServerPortUser(
                                  serverId,
                                  portId,
                                  user.user_id
                                )
                              )
                            }
                          >
                            删除
                          </Button>
                          <Button
                            icon={X}
                            layout="link"
                            aria-label="Cancel"
                            onClick={(e) => {
                              e.preventDefault();
                              setIsEditing({});
                            }}
                          />
                          <Button icon={Check} layout="link" aria-label="OK" 
                            onClick={e => {e.preventDefault();submitForm(user.user_id);setIsEditing({})}} />
                        </div>
                      ) : null}
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
  );
};

export default PortUserEditor;
