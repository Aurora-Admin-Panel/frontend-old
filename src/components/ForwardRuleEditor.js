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

import { PlusIcon, MinusIcon } from "../icons";
import {
  createForwardRule,
  editForwardRule,
  deleteForwardRule,
} from "../redux/actions/ports";

const TypeOptions = [
  { label: "TCP", value: "TCP" },
  { label: "UDP", value: "UDP" },
  { label: "TCP & UDP", value: "ALL" },
];
const MethodOptions = [
  { label: "iptables", value: "iptables" },
  { label: "gost", value: "gost" },
];

const ForwardRuleEditor = ({
  forwardRule,
  serverId,
  port,
  isModalOpen,
  setIsModalOpen,
}) => {
  const dispatch = useDispatch();
  const [type, setType] = useState("TCP");
  const [method, setMethod] = useState("iptables");
  const [remoteAddress, setRemoteAddress] = useState("");
  const [remotePort, setRemotePort] = useState(0);
  const [serveNodes, setServeNodes] = useState([]);
  const [chainNodes, setChainNodes] = useState([]);
  const [retries, setRetries] = useState(0);
  const [isDelete, setIsDelete] = useState(false);

  const validRemoteAddress = () => remoteAddress.length > 0;
  const validRemotePort = () =>
    parseInt(remotePort, 10) > 0 && parseInt(remotePort, 10) < 65536;
  const validServeNode = (n) => n.length > 0;
  const validChainNode = (n) => n.length > 0;
  const validForm = () =>
    isDelete ||
    (method === "iptables" && validRemoteAddress() && validRemotePort()) ||
    (method === "gost" &&
      serveNodes.length > 0 &&
      serveNodes.every((n) => validServeNode(n)) &&
      chainNodes.every((n) => validChainNode(n)));

  const submitForm = () => {
    if (isDelete) {
      dispatch(deleteForwardRule(serverId, port.id));
    } else {
      let data;
      if (method === "iptables") {
        data = {
          method,
          config: {
            type,
            remote_address: remoteAddress,
            remote_port: remotePort,
          },
        };
      } else if (method === "gost") {
        data = {
          method,
          config: {
            Retries: retries,
            ServeNodes: serveNodes,
            ChainNodes: chainNodes,
          },
        };
      }
      if (forwardRule) {
        dispatch(editForwardRule(serverId, port.id, data));
      } else {
        dispatch(createForwardRule(serverId, port.id, data));
      }
    }
    setIsModalOpen(false);
  };

  useEffect(() => {
    setIsDelete(false);
    if (forwardRule) {
      setMethod(forwardRule.method);
      if (forwardRule.config.type) setType(forwardRule.config.type);
      else setType("TCP");
      if (forwardRule.config.remote_address)
        setRemoteAddress(forwardRule.config.remote_address);
      else setRemoteAddress("");
      if (forwardRule.config.remote_port)
        setRemotePort(forwardRule.config.remote_port);
      else setRemotePort(0);
      if (forwardRule.config.Retries) setRetries(forwardRule.config.Retries);
      else setRetries(0);
      if (forwardRule.config.ServeNodes)
        setServeNodes(forwardRule.config.ServeNodes);
      else setServeNodes([]);
      if (forwardRule.config.ChainNodes)
        setChainNodes(forwardRule.config.ChainNodes);
      else setChainNodes([]);
    } else {
      setMethod("iptables");
      setType("TCP");
      setRemoteAddress("");
      setRemotePort(0);
      setServeNodes([]);
      setChainNodes([]);
    }
  }, [forwardRule]);

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalHeader>修改端口转发</ModalHeader>
        <ModalBody>
          <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
            <Label className="mt-4">
              <span>转发方式</span>
              <Select
                className="mt-1"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
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

            {method === "iptables" ? (
              <>
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
                <Label className="mt-4">
                  <span>远端地址</span>
                  <Input
                    className="mt-1"
                    placeholder="www.example.com"
                    value={remoteAddress}
                    valid={validRemoteAddress()}
                    onChange={(e) => setRemoteAddress(e.target.value)}
                  />
                </Label>
                <Label className="mt-4">
                  <span>远端端口</span>
                  <Input
                    className="mt-1"
                    placeholder={0}
                    value={remotePort}
                    valid={validRemotePort()}
                    onChange={(e) => setRemotePort(e.target.value)}
                  />
                </Label>
              </>
            ) : null}

            {method === "gost" ? (
              <>
                <Label className="mt-4 flex flex-row justify-between items-center">
                  <div className="flex flex-auto">
                    <span>重试次数</span>
                  </div>
                  <div className="flex flex-3 items-center">
                    <button
                      className="mr-3 h-5 w-5 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-500 border border-transparent rounded active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-red"
                      onClick={() =>
                        retries > 0 ? setRetries(retries - 1) : setRetries(0)
                      }
                    >
                      <MinusIcon />
                    </button>
                    <span className="w-3 h-6 text-sm text-black dark:text-gray-300">
                      {retries}
                    </span>
                    <button
                      className="ml-3 h-5 w-5 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-green-400 border border-transparent rounded active:bg-green-600 hover:bg-green-700 focus:outline-none focus:shadow-outline-green"
                      onClick={() =>
                        retries < 5 ? setRetries(retries + 1) : setRetries(5)
                      }
                    >
                      <PlusIcon />
                    </button>
                  </div>
                </Label>
                <Label className="mt-4 flex flex-row justify-between items-center">
                  <span>本地服务配置</span>
                  <button
                    className="w-5 h-5 px-1 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-green-400 border border-transparent rounded active:bg-green-600 hover:bg-green-600 focus:outline-none focus:shadow-outline-green"
                    onClick={() => setServeNodes(serveNodes.concat([""]))}
                  >
                    <PlusIcon />
                  </button>
                </Label>
                {serveNodes.map((node, idx) => (
                  <Label className="mt-4" key={`gost_serve_nodes_${idx}`}>
                    <div className="relative text-gray-500 focus-within:text-purple-600 dark:focus-within:text-purple-400">
                      <div className="absolute inset-y-0 flex items-center ml-3 pointer-events-none">
                        {idx + 1}
                      </div>
                      <Input
                        className="block w-full pl-8 pr-5 mt-1 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
                        placeholder="tcp://:8888"
                        value={node}
                        valid={validServeNode(node)}
                        onChange={(e) => {
                          setServeNodes(
                            serveNodes.map((v, i) =>
                              i === idx ? e.target.value : v
                            )
                          );
                        }}
                      />
                      <button
                        className="absolute inset-y-0 right-0 w-5 px-1 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-500 border border-transparent rounded-r active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-red"
                        onClick={() =>
                          setServeNodes(serveNodes.filter((_, i) => i !== idx))
                        }
                      >
                        <MinusIcon />
                      </button>
                    </div>
                  </Label>
                ))}
                <Label className="mt-4 flex flex-row justify-between items-center">
                  <span>转发服务配置</span>
                  <button
                    className="w-5 h-5 px-1 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-green-400 border border-transparent rounded active:bg-green-600 hover:bg-green-600 focus:outline-none focus:shadow-outline-green"
                    onClick={() => setChainNodes(chainNodes.concat([""]))}
                  >
                    <PlusIcon />
                  </button>
                </Label>
                {chainNodes.map((node, idx) => (
                  <Label className="mt-4" key={`gost_serve_nodes_${idx}`}>
                    <div className="relative text-gray-500 focus-within:text-purple-600 dark:focus-within:text-purple-400">
                      <div className="absolute inset-y-0 flex items-center ml-3 pointer-events-none">
                        {idx + 1}
                      </div>
                      <Input
                        className="block w-full pl-8 pr-5 mt-1 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
                        placeholder="relay+tls://www.example.com:8888"
                        value={node}
                        valid={validChainNode(node)}
                        onChange={(e) => {
                          setChainNodes(
                            chainNodes.map((v, i) =>
                              i === idx ? e.target.value : v
                            )
                          );
                        }}
                      />
                      <button
                        className="absolute inset-y-0 right-0 w-5 px-1 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-500 border border-transparent rounded-r active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-red"
                        onClick={() =>
                          setChainNodes(chainNodes.filter((_, i) => i !== idx))
                        }
                      >
                        <MinusIcon />
                      </button>
                    </div>
                  </Label>
                ))}
              </>
            ) : null}

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
            <Button onClick={submitForm} disabled={!validForm()}>
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
            <Button
              block
              size="large"
              onClick={submitForm}
              disabled={!validForm()}
            >
              {forwardRule ? "修改" : "添加"}
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ForwardRuleEditor;
