import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";

import { Input, Label, Select } from "@windmill/react-ui";

import { createForwardRule, editForwardRule } from "../../redux/actions/ports";

const TypeOptions = [
  { label: "TCP", value: "TCP" },
  { label: "UDP", value: "UDP" },
];
const ClientTypeOptions = [
  { label: "服务端模式", value: "server" },
  { label: "客户端模式", value: "client" },
];
const ProtocolOptions = [
  { label: "ws", value: "ws" },
  { label: "wss", value: "wss" },
];
const Templates = [
  { label: "不使用模版", value: 0 },
  { label: "ws服务端", value: 1 },
  { label: "ws客户端", value: 2 },
  { label: "wss服务端", value: 3 },
  { label: "wss客户端", value: 4 },
];

const WstunnelRuleEditor = ({
  serverId,
  port,
  method,
  forwardRule,
  setValidRuleForm,
  setSubmitRuleForm,
}) => {
  const dispatch = useDispatch();
  const [template, setTemplate] = useState(0);
  const [forwardType, setForwardType] = useState("TCP");
  const [protocol, setProtocol] = useState("ws");
  const [clientType, setClientType] = useState("server");
  const [proxyPort, setProxyPort] = useState(0);
  const [remoteAddress, setRemoteAddress] = useState("");
  const [remotePort, setRemotePort] = useState(0);
  const validRemoteAddress = useCallback(
    () => !remoteAddress || remoteAddress.length > 0,
    [remoteAddress]
  );
  const validRemotePort = useCallback(
    () =>
      !remotePort ||
      (parseInt(remotePort, 10) > 0 && parseInt(remotePort, 10) < 65536),
    [remotePort]
  );
  const validProxyPort = useCallback(() => proxyPort > 0, [proxyPort]);

  const validRuleForm = useCallback(
    () => (clientType === "client" ? validRemoteAddress() && validRemotePort() : true) && validProxyPort(),
    [clientType, validRemoteAddress, validRemotePort, validProxyPort]
  );
  const submitRuleForm = useCallback(() => {
    const data = {
      method,
      config: {
        forward_type: forwardType,
        protocol: protocol,
        client_type: clientType,
        proxy_port: proxyPort,
        remote_address: remoteAddress,
        remote_port: remotePort,
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
    port.id,
    method,
    forwardType,
    protocol,
    clientType,
    proxyPort,
    remoteAddress,
    remotePort,
    forwardRule,
  ]);
  const handleTemplate = useCallback((t) => {
    setTemplate(t);
    switch (t) {
      case "1":
        setClientType("server");
        setProtocol("ws");
        setProxyPort("ss/ssr/v2等协议的监听端口");
        break;
      case "2":
        setClientType("client");
        setProtocol("ws");
        setProxyPort("ss/ssr/v2等协议的监听端口");
        setRemoteAddress("ws隧道服务器IP，如1.1.1.1");
        setRemotePort("ws隧道服务器端口，如8888");
        break;
      case "3":
        setClientType("server");
        setProtocol("wss");
        setProxyPort("ss/ssr/v2等协议的监听端口");
        break;
      case "4":
        setClientType("client");
        setProtocol("wss");
        setProxyPort("ss/ssr/v2等协议的监听端口");
        setRemoteAddress("wss隧道服务器IP，如1.1.1.1");
        setRemotePort("wss隧道服务器端口，如8888");
        break;
      default:
        break;
    }
  }, []);

  useEffect(() => {
    if (forwardRule && forwardRule.config.forward_type)
      setForwardType(forwardRule.config.forward_type);
    else setForwardType("TCP");
    if (forwardRule && forwardRule.config.protocol)
      setProtocol(forwardRule.config.protocol);
    else setProtocol("ws");
    if (forwardRule && forwardRule.config.client_type)
      setClientType(forwardRule.config.client_type);
    else setClientType("server");
    if (forwardRule && forwardRule.config.proxy_port)
      setProxyPort(forwardRule.config.proxy_port);
    else setProxyPort(0);
    if (forwardRule && forwardRule.config.remote_address)
      setRemoteAddress(forwardRule.config.remote_address);
    else setRemoteAddress("");
    if (forwardRule && forwardRule.config.remote_port)
      setRemotePort(forwardRule.config.remote_port);
    else setRemotePort(0);
  }, [
    forwardRule,
    setForwardType,
    setProtocol,
    setClientType,
    setProxyPort,
    setRemoteAddress,
    setRemotePort,
  ]);

  useEffect(() => {
    if (method === "wstunnel") {
      setValidRuleForm(() => validRuleForm);
      setSubmitRuleForm(() => submitRuleForm);
    }
  }, [
    method,
    setValidRuleForm,
    setSubmitRuleForm,
    validRuleForm,
    submitRuleForm,
  ]);

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
            {Templates.map((option) => (
              <option
                value={option.value}
                key={`wstunnel_template_${option.value}`}
              >
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      </Label>
      <Label className="mt-4">
        <div className="flex flex-row justify-between items-center mt-1">
          <span className="w-1/2">端口模式</span>
          <Select
            className="w-1/2"
            value={clientType}
            onChange={(e) => setClientType(e.target.value)}
          >
            {ClientTypeOptions.map((option) => (
              <option
                value={option.value}
                key={`wstunnel_client_type_${option.value}`}
              >
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      </Label>
      <Label className="mt-1">
        <div className="flex flex-row">
          <span className="w-1/2">转发类型</span>
          <span className="w-1/2">隧道协议</span>
        </div>
        <div className="mt-1 flex flex-row items-center">
          <div className="flex w-1/2">
            <Select
              value={forwardType}
              onChange={(e) => setForwardType(e.target.value)}
            >
              {TypeOptions.map((option) => (
                <option
                  value={option.value}
                  key={`wstunnel_forward_type_${option.value}`}
                >
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex w-1/2">
            <Select
              value={protocol}
              onChange={(e) => setProtocol(e.target.value)}
            >
              {ProtocolOptions.map((option) => (
                <option
                  value={option.value}
                  key={`wstunnel_protocol_${option.value}`}
                >
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </Label>
      <Label className="mt-1">
        <span>落地代理端口</span>
        <Input
          className="mt-1"
          placeholder="ss/ssr/v2等协议的监听端口"
          value={proxyPort}
          valid={validProxyPort()}
          onChange={(e) => setProxyPort(e.target.value)}
        />
      </Label>

      {clientType === "client" ? (
        <>
          <Label className="mt-1">
            <span>ws隧道服务端IP</span>
            <Input
              className="mt-1"
              placeholder="1.1.1.1"
              value={remoteAddress}
              valid={validRemoteAddress()}
              onChange={(e) => setRemoteAddress(e.target.value)}
            />
          </Label>
          <Label className="mt-1">
            <span>ws隧道服务端端口</span>
            <Input
              className="mt-1"
              placeholder="8888"
              value={remotePort}
              valid={validRemotePort()}
              onChange={(e) => setRemotePort(e.target.value)}
            />
          </Label>
        </>
      ) : null}
    </>
  );
};

export default WstunnelRuleEditor;
