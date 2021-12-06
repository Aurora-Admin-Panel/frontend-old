import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";

import { Input, Label, Select } from "@windmill/react-ui";

import { createForwardRule, editForwardRule } from "../../redux/actions/ports";

const TypeOptions = [
  { label: "无协议", value: "raw" },
  { label: "ws隧道", value: "ws" },
  { label: "wss隧道", value: "wss" },
  { label: "mwss隧道", value: "mwss" },
];

const Templates = [
  { label: "不使用模版", value: 0 },
  { label: "端口转发", value: 1 },
  { label: "ws隧道入口端", value: 2 },
  { label: "ws隧道出口端", value: 3 },
  { label: "wss隧道入口端", value: 4 },
  { label: "wss隧道出口端", value: 5 },
  { label: "mwss隧道入口端", value: 6 },
  { label: "mwss隧道出口端", value: 7 },
];

const EhcoRuleEditor = ({
  serverId,
  port,
  method,
  forwardRule,
  setValidRuleForm,
  setSubmitRuleForm,
}) => {
  const dispatch = useDispatch();
  const [template, setTemplate] = useState(0);
  const [listenType, setListenType] = useState("raw");
  const [transportType, setTransportType] = useState("raw");
  const [remoteAddress, setRemoteAddress] = useState("");
  const [remotePort, setRemotePort] = useState(0);
  const validRemoteAddress = useCallback(() => remoteAddress.length > 0, [
    remoteAddress,
  ]);
  const validRemotePort = useCallback(
    () => parseInt(remotePort, 10) > 0 && parseInt(remotePort, 10) < 65536,
    [remotePort]
  );

  const validRuleForm = useCallback(
    () => validRemoteAddress() && validRemotePort(),
    [validRemoteAddress, validRemotePort]
  );
  const submitRuleForm = useCallback(() => {
    const data = {
      method,
      config: {
        listen_type: listenType,
        transport_type: transportType,
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
    listenType,
    transportType,
    remoteAddress,
    remotePort,
    forwardRule,
  ]);

  const handleTemplate = (t) => {
    setTemplate(t)
    switch (t) {
      case "1":
        setListenType("raw");
        setTransportType("raw");
        setRemoteAddress("远端IP，如1.1.1.1");
        setRemotePort("远端端口，如8888");
        break;
      case "2":
        setListenType("raw");
        setTransportType("ws");
        setRemoteAddress("ws隧道出口端IP，如1.1.1.1");
        setRemotePort("ws隧道出口端端口，如8888");
        break;
      case "3":
        setListenType("ws");
        setTransportType("raw");
        setRemoteAddress("127.0.0.1");
        setRemotePort("本地代理端口");
        break;
      case "4":
        setListenType("raw");
        setTransportType("wss");
        setRemoteAddress("wss隧道出口端IP，如1.1.1.1");
        setRemotePort("ws隧道出口端端口，如8888");
        break;
      case "5":
        setListenType("wss");
        setTransportType("raw");
        setRemoteAddress("127.0.0.1");
        setRemotePort("本地代理端口");
        break;
      case "6":
        setListenType("raw");
        setTransportType("mwss");
        setRemoteAddress("mwws隧道出口端IP，如1.1.1.1");
        setRemotePort("ws隧道出口端端口，如8888");
        break;
      case "7":
        setListenType("mwss");
        setTransportType("raw");
        setRemoteAddress("127.0.0.1");
        setRemotePort("本地代理端口");
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (forwardRule && forwardRule.config.listen_type)
      setListenType(forwardRule.config.listen_type);
    else setListenType("raw");
    if (forwardRule && forwardRule.config.transport_type)
      setTransportType(forwardRule.config.transport_type);
    else setTransportType("raw");
    if (forwardRule && forwardRule.config.remote_address)
      setRemoteAddress(forwardRule.config.remote_address);
    else setRemoteAddress("");
    if (forwardRule && forwardRule.config.remote_port)
      setRemotePort(forwardRule.config.remote_port);
    else setRemotePort(0);
  }, [
    forwardRule,
    setListenType,
    setTransportType,
    setRemoteAddress,
    setRemotePort,
  ]);

  useEffect(() => {
    if (method === "ehco") {
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
                key={`ehco_template_${option.value}`}
              >
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      </Label>
      <Label className="mt-4">
        <div className="flex flex-row">
          <span className="w-1/2">入站协议</span>
          <span className="w-1/2">出站协议</span>
        </div>
        <div className="mt-1 flex flex-row items-center">
          <div className="flex w-1/2">
            <Select
              value={listenType}
              onChange={(e) => setListenType(e.target.value)}
            >
              {TypeOptions.map((option) => (
                <option
                  value={option.value}
                  key={`listen_type_options_${option.value}`}
                >
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex w-1/2">
            <Select
              value={transportType}
              onChange={(e) => setTransportType(e.target.value)}
            >
              {TypeOptions.map((option) => (
                <option
                  value={option.value}
                  key={`transport_type_options_${option.value}`}
                >
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </Label>

      <Label className="mt-1">
        <span>远端IP(入口端)/127.0.0.1(出口端)</span>
        <Input
          className="mt-1"
          placeholder="1.1.1.1"
          value={remoteAddress}
          valid={validRemoteAddress()}
          onChange={(e) => setRemoteAddress(e.target.value)}
        />
      </Label>
      <Label className="mt-1">
        <span>远端隧道端口(入口端)/代理本地端口(出口端)</span>
        <Input
          className="mt-1"
          placeholder="8888"
          value={remotePort}
          valid={validRemotePort()}
          onChange={(e) => setRemotePort(e.target.value)}
        />
      </Label>
    </>
  );
};

export default EhcoRuleEditor;
