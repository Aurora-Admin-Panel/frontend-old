import React, { useEffect, useCallback, useState } from "react";
import { useDispatch } from "react-redux";

import { Input, Label, Select } from "@windmill/react-ui";

import { PlusIcon, MinusIcon } from "../../icons";
import { createForwardRule, editForwardRule } from "../../redux/actions/ports";

const ModeOptions = [{ label: "TCP", value: "tcp" }];
const SendProxyOptions = [
  { label: "无", value: "" },
  { label: "V1", value: "send-proxy" },
  { label: "V2", value: "send-proxy-v2" },
];
const BalanceModeOptions = [
  { label: "轮询", value: "roundrobin" },
  { label: "最小连接数优先", value: "leastconn" },
  { label: "源IP地址匹配", value: "source" },
  { label: "顺序优先", value: "first" },
];

const HaproxyRuleEditor = ({
  serverId,
  port,
  method,
  forwardRule,
  setValidRuleForm,
  setSubmitRuleForm,
}) => {
  const dispatch = useDispatch();
  const [mode, setMode] = useState("tcp");
  const [maxConn, setMaxConn] = useState(20480);
  const [sendProxy, setSendProxy] = useState("");
  const [backendNodes, setBackendNodes] = useState([]);
  const [balanceMode, setBalanceMode] = useState("roundrobin");
  const validBackendNode = (n) => n.length > 0;
  const validRuleForm = useCallback(
    () =>
      maxConn > 0 &&
      backendNodes.length > 0 &&
      backendNodes.every((n) => validBackendNode(n)),
    [maxConn, backendNodes]
  );
  const submitRuleForm = useCallback(() => {
    const data = {
      method,
      config: {
        mode: mode,
        maxconn: maxConn,
        send_proxy: sendProxy,
        balance_mode: balanceMode,
        backend_nodes: backendNodes,
      },
    };
    if (forwardRule) {
      dispatch(editForwardRule(serverId, port.id, data));
    } else {
      dispatch(createForwardRule(serverId, port.id, data));
    }
  }, [
    dispatch,
    serverId,
    port,
    mode,
    maxConn,
    sendProxy,
    balanceMode,
    backendNodes,
    forwardRule,
    method,
  ]);

  useEffect(() => {
    if (method === "haproxy") {
      setValidRuleForm(() => validRuleForm);
      setSubmitRuleForm(() => submitRuleForm);
    }
  }, [
    method,
    backendNodes,
    setValidRuleForm,
    setSubmitRuleForm,
    validRuleForm,
    submitRuleForm,
  ]);

  useEffect(() => {
    if (forwardRule) {
      if (forwardRule.config.mode) setMode(forwardRule.config.mode);
      else setMode("tcp");
      if (forwardRule.config.maxconn) setMaxConn(forwardRule.config.maxconn);
      else setMaxConn(20480);
      if (forwardRule.config.balance_mode)
        setBalanceMode(forwardRule.config.balance_mode);
      else setBalanceMode("roundrobin");
      if (forwardRule.config.send_proxy)
        setSendProxy(forwardRule.config.send_proxy);
      else setSendProxy("");
      if (forwardRule.config.backend_nodes)
        setBackendNodes(forwardRule.config.backend_nodes);
      else setBackendNodes([]);
    } else {
      setMode("tcp");
      setMaxConn(20480);
      setSendProxy("");
      setBalanceMode("roundrobin");
      setBackendNodes([]);
    }
  }, [forwardRule, setMode, setMaxConn, setBalanceMode, setBackendNodes]);

  return (
    <>
      <Label className="mt-4">
        <div className="flex flex-row justify-between items-center mt-1">
          <span className="w-1/2">转发类型</span>
          <Select
            className="w-1/2"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            {ModeOptions.map((option) => (
              <option value={option.value} key={`haproxy_mode_${option.value}`}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      </Label>
      <Label className="mt-4">
        <div className="flex flex-row justify-between items-center mt-1">
          <span className="w-1/2">负载均衡模式</span>
          <Select
            className="w-1/2"
            value={balanceMode}
            onChange={(e) => setBalanceMode(e.target.value)}
          >
            {BalanceModeOptions.map((option) => (
              <option
                value={option.value}
                key={`haproxy_balance_mode_${option.value}`}
              >
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      </Label>
      <Label className="mt-4">
        <div className="flex flex-row justify-between items-center mt-1">
          <span className="w-1/2">最大连接数</span>
          <Input
            className="w-1/2"
            value={maxConn}
            placeholder="20480"
            onChange={(e) => setMaxConn(e.target.value)}
          />
        </div>
      </Label>
      <Label className="mt-4">
        <div className="flex flex-row justify-between items-center mt-1">
          <span className="w-1/2">Proxy Protocol 版本</span>
          <Select
            className="w-1/2"
            value={sendProxy}
            onChange={(e) => setSendProxy(e.target.value)}
          >
            {SendProxyOptions.map((option) => (
              <option
                value={option.value}
                key={`haproxy_send_proxy_${option.value}`}
              >
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      </Label>

      <Label className="mt-4 flex flex-row justify-between items-center">
        <span>目标地址端口</span>
        <button
          className="w-5 h-5 px-1 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-green-400 border border-transparent rounded active:bg-green-600 hover:bg-green-600 focus:outline-none focus:shadow-outline-green"
          onClick={() => setBackendNodes(backendNodes.concat([""]))}
        >
          <PlusIcon />
        </button>
      </Label>
      {backendNodes.map((node, idx) => (
        <Label className="mt-4" key={`gost_serve_nodes_${idx}`}>
          <div className="relative text-gray-500 focus-within:text-purple-600 dark:focus-within:text-purple-400">
            <div className="absolute inset-y-0 flex items-center ml-3 pointer-events-none">
              {idx + 1}
            </div>
            <Input
              className="block w-full pl-8 pr-5 mt-1 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
              placeholder="www.example.com:8888"
              value={node}
              valid={validBackendNode(node)}
              onChange={(e) => {
                setBackendNodes(
                  backendNodes.map((v, i) => (i === idx ? e.target.value : v))
                );
              }}
            />
            <button
              className="absolute inset-y-0 right-0 w-5 px-1 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-500 border border-transparent rounded-r active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-red"
              onClick={() =>
                setBackendNodes(backendNodes.filter((_, i) => i !== idx))
              }
            >
              <MinusIcon />
            </button>
          </div>
        </Label>
      ))}
    </>
  );
};

export default HaproxyRuleEditor;
