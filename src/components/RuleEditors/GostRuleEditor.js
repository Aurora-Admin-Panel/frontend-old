import React, { useEffect, useCallback, useState } from "react";
import { useDispatch } from "react-redux";

import { Input, Label, Select } from "@windmill/react-ui";

import { PlusIcon, MinusIcon } from "../../icons";
import { createForwardRule, editForwardRule } from "../../redux/actions/ports";

const GostTemplates = [
  { label: "不使用模版", value: 0 },
  { label: "直接端口转发（明文）", value: 1 },
  { label: "tls 隧道客户端（入口）", value: 2 },
  { label: "tls 隧道服务端（出口）", value: 3 },
  { label: "ws 隧道客户端（入口）", value: 4 },
  { label: "ws 隧道服务端（出口）", value: 5 },
  { label: "wss 隧道客户端（入口）", value: 6 },
  { label: "wss 隧道服务端（出口）", value: 7 },
  { label: "kcp 隧道客户端（入口）", value: 8 },
  { label: "kcp 隧道服务端（出口）", value: 9 },
  { label: "quic 隧道客户端（入口）", value: 10 },
  { label: "quic 隧道服务端（出口）", value: 11 },
  { label: "ssh 隧道客户端（入口）", value: 12 },
  { label: "ssh 隧道服务端（出口）", value: 13 },
];

const GostRuleEditor = ({
  serverId,
  port,
  method,
  forwardRule,
  setValidRuleForm,
  setSubmitRuleForm,
}) => {
  const dispatch = useDispatch();
  const [serveNodes, setServeNodes] = useState([]);
  const [chainNodes, setChainNodes] = useState([]);
  const [retries, setRetries] = useState(0)
  const [template, setTemplate] = useState(0);
  const validServeNode = (n) => n.length > 0;
  const validChainNode = (n) => n.length > 0;
  const validRuleForm = useCallback(
    () =>
      serveNodes.length > 0 &&
      serveNodes.every((n) => validServeNode(n)) &&
      chainNodes.every((n) => validChainNode(n)),
    [chainNodes, serveNodes]
  );
  const submitRuleForm = useCallback(() => {
    const data = {
      method,
      config: {
        Retries: retries,
        ServeNodes: serveNodes,
        ChainNodes: chainNodes,
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
    retries,
    serveNodes,
    chainNodes,
    forwardRule,
    method,
  ]);
  const handleTemplate = (t) => {
    setTemplate(t);
    switch (t) {
      case "1":
        setServeNodes([
          `tcp://:${port.external_num ? port.external_num : port.num}/落地IP:落地端口`,
          `udp://:${port.external_num ? port.external_num : port.num}/落地IP:落地端口`,
        ]);
        setChainNodes([]);
        break;
      case "2":
        setServeNodes([
          `tcp://:${port.external_num ? port.external_num : port.num}`,
          `udp://:${port.external_num ? port.external_num : port.num}`,
        ]);
        setChainNodes([`relay+tls://隧道服务端IP:服务端端口`]);
        break;
      case "3":
        setServeNodes([`relay+tls://:${port.external_num ? port.external_num : port.num}/落地IP:落地端口`]);
        setChainNodes([]);
        break;
      case "4":
        setServeNodes([
          `tcp://:${port.external_num ? port.external_num : port.num}`,
          `udp://:${port.external_num ? port.external_num : port.num}`,
        ]);
        setChainNodes([`relay+ws://隧道服务端IP:服务端端口`]);
        break;
      case "5":
        setServeNodes([`relay+ws://:${port.external_num ? port.external_num : port.num}/落地IP:落地端口`]);
        setChainNodes([]);
        break;
      case "6":
        setServeNodes([
          `tcp://:${port.external_num ? port.external_num : port.num}`,
          `udp://:${port.external_num ? port.external_num : port.num}`,
        ]);
        setChainNodes([`relay+wss://隧道服务端IP:服务端端口`]);
        break;
      case "7":
        setServeNodes([`relay+wss://:${port.external_num ? port.external_num : port.num}/落地IP:落地端口`]);
        setChainNodes([]);
        break;
      case "8":
        setServeNodes([
          `tcp://:${port.external_num ? port.external_num : port.num}`,
          `udp://:${port.external_num ? port.external_num : port.num}`,
        ]);
        setChainNodes([`relay+kcp://隧道服务端IP:服务端端口`]);
        break;
      case "9":
        setServeNodes([`relay+kcp://:${port.external_num ? port.external_num : port.num}/落地IP:落地端口`]);
        setChainNodes([]);
        break;
      case "10":
        setServeNodes([
          `tcp://:${port.external_num ? port.external_num : port.num}`,
          `udp://:${port.external_num ? port.external_num : port.num}`,
        ]);
        setChainNodes([`relay+quic://隧道服务端IP:服务端端口`]);
        break;
      case "11":
        setServeNodes([`relay+quic://:${port.external_num ? port.external_num : port.num}/落地IP:落地端口`]);
        setChainNodes([]);
        break;
      case "12":
        setServeNodes([
          `tcp://:${port.external_num ? port.external_num : port.num}`,
          `udp://:${port.external_num ? port.external_num : port.num}`,
        ]);
        setChainNodes([`relay+ssh://隧道服务端IP:服务端端口`]);
        break;
      case "13":
        setServeNodes([`relay+ssh://:${port.external_num ? port.external_num : port.num}/落地IP:落地端口`]);
        setChainNodes([]);
        break;
      default:
        setServeNodes([]);
        setChainNodes([]);
    }
  };

  useEffect(() => {
    if (method === "gost") {
      setValidRuleForm(() => validRuleForm);
      setSubmitRuleForm(() => submitRuleForm);
    }
  }, [
    method,
    serveNodes,
    chainNodes,
    setValidRuleForm,
    setSubmitRuleForm,
    validRuleForm,
    submitRuleForm,
  ]);

  useEffect(() => {
    if (forwardRule) {
      if (forwardRule.config.Retries) setRetries(forwardRule.config.Retries);
      else setRetries(0);
      if (forwardRule.config.ServeNodes)
        setServeNodes(forwardRule.config.ServeNodes);
      else setServeNodes([]);
      if (forwardRule.config.ChainNodes)
        setChainNodes(forwardRule.config.ChainNodes);
      else setChainNodes([]);
    } else {
      setRetries(0);
      setServeNodes([]);
      setChainNodes([]);
    }
  }, [forwardRule, setRetries, setServeNodes, setChainNodes]);

  return (
    <>
      <Label className="mt-4">
        <div className="flex flex-row justify-between items-center mt-1">
        <span className="w-1/2">配置模版</span>
        <Select
          className="w-1/2"
          value={template}
          onChange={(e) => handleTemplate(e.target.value)}
        >
          {GostTemplates.map((option) => (
            <option value={option.value} key={`gost_template_${option.value}`}>
              {option.label}
            </option>
          ))}
        </Select>

        </div>
      </Label>
      <Label className="mt-4 flex flex-row justify-between items-center">
        <div className="flex flex-auto">
          <span>重试次数</span>
        </div>
        <div className="flex flex-3 items-center">
          <button
            className="mr-3 h-5 w-5 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-500 border border-transparent rounded active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-red"
            onClick={(e) =>
              e.preventDefault() && retries > 0
                ? setRetries(retries - 1)
                : setRetries(0)
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
        <span>本地服务配置(-L)</span>
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
                  serveNodes.map((v, i) => (i === idx ? e.target.value : v))
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
        <span>转发服务配置(-F)</span>
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
                  chainNodes.map((v, i) => (i === idx ? e.target.value : v))
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
  );
};

export default GostRuleEditor;
