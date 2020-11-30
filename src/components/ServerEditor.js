import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import {
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@windmill/react-ui";
import { At } from "phosphor-react";

import { TwoDotIcon } from "../icons";
import {
  createServer,
  editServer,
  deleteServer,
} from "../redux/actions/servers";

const ServerEditor = ({ server, isModalOpen, setIsModalOpen }) => {
  const dispatch = useDispatch();
  const [lastServer, setLastServer] = useState(null);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [ansibleName, setAnsibleName] = useState("");
  const [ansibleHost, setAnsibleHost] = useState("");
  const [ansiblePort, setAnsiblePort] = useState(22);
  const [sshUser, setSshUser] = useState("root");
  const [sshPassword, setSshPassword] = useState("");
  const [sshPasswordNeeded, setSshPasswordNeeded] = useState(false);
  const [sudoPassword, setSudoPassword] = useState("");
  const [sudoPasswordNeeded, setSudoPasswordNeeded] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  const validName = () => name.length > 0;
  const validAddress = () => address.length > 0;
  const validAnsibleName = () => ansibleName.length > 0;
  const validAnsibleHost = () => !ansibleHost || ansibleHost.length > 0;
  const validAnsiblePort = () =>
    !ansiblePort ||
    (parseInt(ansiblePort) > 0 && parseInt(ansiblePort) < 65536);

  const validForm = () =>
    isDelete ||
    (validName() &&
      validAddress() &&
      validAnsibleName() &&
      validAnsibleHost() &&
      validAnsiblePort());

  const submitForm = () => {
    if (isDelete) {
      dispatch(deleteServer(server.id));
    } else {
      const data = {
        name,
        address,
        ansible_name: ansibleName,
        ansible_user: sshUser,
      };
      if (ansibleHost) data.ansible_host = ansibleHost;
      if (ansiblePort) data.ansible_port = ansiblePort;
      if (!sshPasswordNeeded) {
        data.ssh_password = null;
      } else if (sshPassword) {
        data.ssh_password = sshPassword;
      }
      if (!sudoPasswordNeeded) {
        data.sudo_password = null;
      } else if (sudoPassword) {
        data.sudo_password = sudoPassword;
      }

      if (server) {
        dispatch(editServer(server.id, data));
      } else {
        dispatch(createServer(data));
      }
    }
    setIsModalOpen(false);
    setName("");
    setAddress("");
    setAnsibleName("");
    setAnsibleHost("");
    setAnsiblePort(22);
    setSshUser("root");
    setSshPasswordNeeded(false);
    setSudoPasswordNeeded(false);
  };

  useEffect(() => {
    setIsDelete(false);
    setSshPassword("");
    setSudoPassword("");
    if (server) {
      setName(server.name);
      setAddress(server.address);
      setAnsibleName(server.ansible_name);
      setSshUser(server.ansible_user);
      if (server.ansible_host) setAnsibleHost(server.ansible_host);
      else setAnsibleHost("");
      if (server.ansible_port) setAnsiblePort(server.ansible_port);
      else setAnsiblePort("");
    } else if (lastServer) {
      setName("");
      setAddress("");
      setAnsibleName("");
      setAnsibleHost("");
      setAnsiblePort(22);
      setSshUser("root");
    }
    setLastServer(server);
  }, [isModalOpen, server]);

  return (
    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <ModalHeader>{server ? "修改" : "添加"}服务器</ModalHeader>
      <ModalBody>
        <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <Label className="mt-1">
            <span>名字</span>
            <Input
              className="mt-1"
              placeholder="上海CN2"
              value={name}
              valid={validName()}
              onChange={(e) => setName(e.target.value)}
            />
          </Label>
          <Label className="mt-1">
            <span>地址</span>
            <Input
              className="mt-1"
              placeholder={"www.example.com"}
              value={address}
              valid={validAddress()}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Label>
          <Label className="mt-1">
            <span>Ansible别名</span>
            <Input
              className="mt-1"
              placeholder={"cn2"}
              value={ansibleName}
              valid={validAnsibleName()}
              onChange={(e) => setAnsibleName(e.target.value)}
            />
          </Label>
          <Label className="mt-1 flex flex-col">
            <span>SSH连接信息</span>
            <div className="mt-1 flex flex-row items-center">
              <div className="flex flex-auto">
                <Input
                  placeholder={"默认root"}
                  value={sshUser}
                  valid={() => sshUser.length > 0}
                  onChange={(e) => setSshUser(e.target.value)}
                />
              </div>
              <At size={24} />
              <div className="flex flex-auto">
                <Input
                  placeholder={"默认为服务器地址"}
                  value={ansibleHost}
                  valid={validAnsibleHost()}
                  onChange={(e) => setAnsibleHost(e.target.value)}
                />
              </div>
              <TwoDotIcon />
              <div className="flex flex-auto">
                <Input
                  placeholder={"默认22"}
                  value={ansiblePort}
                  valid={validAnsiblePort()}
                  onChange={(e) => setAnsiblePort(e.target.value)}
                />
              </div>
            </div>
          </Label>
          <Label className="mt-1">
            <div className="flex flex-row justify-between items-center">
              <span>SSH密码</span>
              <div>
                <Input
                  type="checkbox"
                  className="mr-1"
                  checked={!sshPasswordNeeded}
                  onChange={() => setSshPasswordNeeded(!sshPasswordNeeded)}
                />
                <span>不需要SSH密码</span>
              </div>
            </div>
            {sshPasswordNeeded ? (
              <Input
                className="mt-1"
                placeholder={"可为空，默认使用ssh key"}
                value={sshPassword}
                valid={() => !sshPassword || sshPassword.length >= 6}
                onChange={(e) => setSshPassword(e.target.value)}
              />
            ) : (
              <Input className="mt-1" disabled={true} />
            )}
          </Label>
          <Label className="mt-1">
            <div className="flex flex-row justify-between items-center">
              <span>SUDO密码</span>
              <div>
                <Input
                  type="checkbox"
                  className="mr-1"
                  checked={!sudoPasswordNeeded}
                  onChange={() => setSudoPasswordNeeded(!sudoPasswordNeeded)}
                />
                <span>不需要SUDO密码</span>
              </div>
            </div>
            {sudoPasswordNeeded ? (
              <Input
                className="mt-1"
                placeholder={"可为空，用户非root且需输sudo密码则需填写"}
                value={sudoPassword}
                valid={() => !sudoPassword || sudoPassword.length >= 6}
                onChange={(e) => setSudoPassword(e.target.value)}
              />
            ) : (
              <Input className="mt-1" disabled={true} />
            )}
          </Label>

          {server ? (
            <Label className="mt-6">
              <Input
                type="checkbox"
                checked={isDelete}
                onChange={() => setIsDelete(!isDelete)}
              />
              <span className="ml-2">我要删除这台服务器</span>
            </Label>
          ) : null}
        </div>
      </ModalBody>
      <ModalFooter>
        <div className="w-full flex flex-row justify-end space-x-2">
          <Button layout="outline" onClick={() => setIsModalOpen(false)}>
            取消
          </Button>
          <Button onClick={submitForm} disabled={!validForm()}>
            {server ? "修改" : "添加"}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default ServerEditor;
