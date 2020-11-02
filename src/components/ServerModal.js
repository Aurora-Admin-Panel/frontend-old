import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import {
  Input,
  Label,
  Select,
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

const TypeOptions = [
  { label: "TCP", value: "TCP" },
  { label: "UDP", value: "UDP" },
  { label: "TCP & UDP", value: "ALL" },
];
const MethodOptions = [{ label: "iptables", value: "iptables" }];

const ServerModal = ({ server, serverId, isModalOpen, setIsModalOpen }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [ansibleName, setAnsibleName] = useState(null);
  const [ansibleHost, setAnsibleHost] = useState(null);
  const [ansiblePort, setAnsiblePort] = useState(null);
  const [isDelete, setIsDelete] = useState(false);

  const submitForm = () => {
    if (isDelete) {
      dispatch(deleteForwardRule(serverId, portId));
    }
    const data = {
      method,
      config: {
        type,
        remote_address: remoteAddress,
        remote_port: remotePort,
      },
    };
    console.log(data);
    if (forwardRule) {
      dispatch(editForwardRule(serverId, portId, data));
    } else {
      dispatch(createForwardRule(serverId, portId, data));
    }
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (forwardRule) {
      setMethod(forwardRule.method);
      setType(forwardRule.config.type);
      setRemoteAddress(forwardRule.config.remote_address);
      setRemotePort(forwardRule.config.remote_port);
    }
  }, [forwardRule]);
  console.log(type);

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalHeader>修改端口转发</ModalHeader>
        <ModalBody>
          <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
            <Label className="mt-4">
              <span>转发类型</span>
              <Select
                className="mt-1"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                {TypeOptions.map((option) => (
                  <option
                    value={option.value}
                    key={`forward_rule_type_${option.value}`}
                  >
                    {option.label}
                  </option>
                ))}
              </Select>
            </Label>
            <Label>
              <span>转发方式</span>
              <Select
                className="mt-1"
                value={method}
                onChange={(e) => setType(e.target.value)}
              >
                {MethodOptions.map((option) => (
                  <option
                    value={option.value}
                    key={`forward_rule_method_${option.value}`}
                  >
                    {option.label}
                  </option>
                ))}
              </Select>
            </Label>

            <Label className="mt-4">
              <span>远端地址</span>
              <Input
                className="mt-1"
                placeholder="www.example.com"
                value={remoteAddress}
                onChange={(e) => setRemoteAddress(e.target.value)}
              />
            </Label>
            <Label className="mt-4">
              <span>远端端口</span>
              <Input
                className="mt-1"
                placeholder={0}
                value={remotePort}
                onChange={(e) => setRemotePort(e.target.value)}
              />
            </Label>
            {forwardRule ? (
              <Label className="mt-6">
                <Input
                  type="checkbox"
                  checked={isDelete}
                  onChange={() => setIsDelete(!isDelete)}
                />
                <span className="ml-2">我要删除这条转发规则</span>
              </Label>
            ) : null}
          </div>
        </ModalBody>
        <ModalFooter>
          {/* I don't like this approach. Consider passing a prop to ModalFooter
           * that if present, would duplicate the buttons in a way similar to this.
           * Or, maybe find some way to pass something like size="large md:regular"
           * to Button
           */}
          <div className="hidden sm:block">
            <Button layout="outline" onClick={() => setIsModalOpen(false)}>
              取消
            </Button>
          </div>
          <div className="hidden sm:block">
            <Button onClick={submitForm}>
              {forwardRule ? "修改" : "添加"}
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
            <Button block size="large" onClick={submitForm}>
              {forwardRule ? "修改" : "添加"}
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ForwardRuleEditor;
