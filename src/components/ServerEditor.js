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

import {
  createServer,
  editServer,
  deleteServer,
} from "../redux/actions/servers";

const ServerEditor = ({ server, isModalOpen, setIsModalOpen }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [ansibleName, setAnsibleName] = useState("");
  const [ansibleHost, setAnsibleHost] = useState(null);
  const [ansiblePort, setAnsiblePort] = useState(null);
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
      };
      if (ansibleHost) data.ansible_host = ansibleHost;
      if (ansiblePort) data.ansible_port = ansiblePort;
      if (server) {
        dispatch(editServer(server.id, data));
      } else {
        dispatch(createServer(data));
      }
    }
    setIsModalOpen(false);
  };

  useEffect(() => {
    setIsDelete(false);
    if (server) {
      setName(server.name);
      setAddress(server.address);
      setAnsibleName(server.ansible_name);
      if (server.ansible_host) setAnsibleHost(server.ansible_host);
      if (server.ansible_port) setAnsiblePort(server.ansible_port);
    } else {
      setName("");
      setAddress("");
      setAnsibleName("");
      setAnsibleHost(null);
      setAnsiblePort(null);
    }
  }, [server]);

  return (
    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <ModalHeader>{server ? "修改" : "添加"}服务器</ModalHeader>
      <ModalBody>
        <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <Label className="mt-4">
            <span>名字</span>
            <Input
              className="mt-1"
              placeholder="上海CN2"
              value={name}
              valid={validName()}
              onChange={(e) => setName(e.target.value)}
            />
          </Label>
          <Label className="mt-4">
            <span>地址</span>
            <Input
              className="mt-1"
              placeholder={"www.example.com"}
              value={address}
              valid={validAddress()}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Label>
          <Label className="mt-4">
            <span>Ansible别名</span>
            <Input
              className="mt-1"
              placeholder={"cn2"}
              value={ansibleName}
              valid={validAnsibleName()}
              onChange={(e) => setAnsibleName(e.target.value)}
            />
          </Label>
          <Label className="mt-4">
            <span>SSH地址</span>
            <Input
              className="mt-1"
              placeholder={"可为空，默认为服务器地址"}
              value={ansibleHost}
              valid={validAnsibleHost()}
              onChange={(e) => setAnsibleHost(e.target.value)}
            />
          </Label>
          <Label className="mt-4">
            <span>SSH端口</span>
            <Input
              className="mt-1"
              placeholder={"可为空，默认22"}
              value={ansiblePort}
              valid={validAnsiblePort()}
              onChange={(e) => setAnsiblePort(e.target.value)}
            />
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
        <div className="hidden sm:block">
          <Button layout="outline" onClick={() => setIsModalOpen(false)}>
            取消
          </Button>
        </div>
        <div className="hidden sm:block">
          <Button onClick={submitForm} disabled={!validForm()}>
            {server ? "修改" : "添加"}
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
        <div className="block w-full sm:hidden">
          <Button
            block
            size="large"
            onClick={submitForm}
            disabled={!validForm()}
          >
            {server ? "修改" : "添加"}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default ServerEditor;
