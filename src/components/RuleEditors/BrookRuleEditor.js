import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";

import { Input, Label, Select } from "@windmill/react-ui";

import { createForwardRule, editForwardRule } from "../../redux/actions/ports";

const CommandOptions = [
  { label: "端口转发", value: "relay" },
  { label: "普通隧道客户端（入口）", value: "client" },
  { label: "普通隧道服务端（出口）", value: "server" },
  { label: "ws 隧道客户端（入口）", value: "wsclient" },
  { label: "ws 隧道服务端（出口）", value: "wsserver" },
];

const BrookRuleEditor = ({
  serverId,
  port,
  method,
  forwardRule,
  setValidRuleForm,
  setSubmitRuleForm,
}) => {
  const dispatch = useDispatch();
  const [command, setCommand] = useState("relay");
  const [remoteAddress, setRemoteAddress] = useState("");
  const [remotePort, setRemotePort] = useState(0);
  const [serverAddress, setServerAddress] = useState("");
  const [serverPort, setServerPort] = useState(0);
  const [password, setPassword] = useState("");
  const validRemoteAddress = useCallback(() => remoteAddress.length > 0, [
    remoteAddress,
  ]);
  const validRemotePort = useCallback(
    () => parseInt(remotePort, 10) > 0 && parseInt(remotePort, 10) < 65536,
    [remotePort]
  );
  const validServerAddress = useCallback(() => serverAddress.length > 0, [
    serverAddress,
  ]);
  const validServerPort = useCallback(
    () => parseInt(serverPort, 10) > 0 && parseInt(serverPort, 10) < 65536,
    [serverPort]
  );
  const validPassword = useCallback(() => password.length > 0, [password]);

  const validRuleForm = useCallback(
    () =>
      (command === "relay" || command === "client" || command === "wsclient"
        ? validRemoteAddress()
        : true) &&
      (command === "relay" || command === "client" || command === "wsclient"
        ? validRemotePort()
        : true) &&
      (command === "client" || command === "wsclient"
        ? validServerAddress()
        : true) &&
      (command === "client" || command === "wsclient"
        ? validServerPort()
        : true) &&
      command !== "relay"
        ? validPassword()
        : true,
    [command, validRemoteAddress, validRemotePort, validServerAddress, validServerPort, validPassword]
  );
  const submitRuleForm = useCallback(() => {
    const data = {
      method,
      config: {
        command,
        remote_address: remoteAddress,
        remote_port: remotePort,
        server_address: serverAddress,
        server_port: serverPort,
        password,
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
    command,
    remoteAddress,
    remotePort,
    serverAddress,
    serverPort,
    password,
    forwardRule,
  ]);

  useEffect(() => {
    if (forwardRule) {
      if (forwardRule.config.command) setCommand(forwardRule.config.command);
      else setCommand("relay");
      if (forwardRule.config.remote_address)
        setRemoteAddress(forwardRule.config.remote_address);
      else setRemoteAddress("");
      if (forwardRule.config.remote_port)
        setRemotePort(forwardRule.config.remote_port);
      else setRemotePort(0);
      if (forwardRule.config.server_address)
        setServerAddress(forwardRule.config.server_address);
      else setServerAddress("");
      if (forwardRule.config.server_port)
        setServerPort(forwardRule.config.server_port);
      else setServerPort(0);
      if (forwardRule.config.password) setPassword(forwardRule.config.password);
      else setPassword("");
    } else {
      setCommand("relay");
      setRemoteAddress("");
      setRemotePort(0);
      setServerAddress("");
      setServerPort(0);
      setPassword("");
    }
  }, [forwardRule, setCommand, setRemoteAddress, setRemotePort, setServerAddress, setServerPort, setPassword]);

  useEffect(() => {
    if (method === "brook") {
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
        <span>Brook命令</span>
        <Select
          className="mt-1"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
        >
          {CommandOptions.map((option) => (
            <option value={option.value} key={`brook_command_${option.value}`}>
              {option.label}
            </option>
          ))}
        </Select>
      </Label>
      {command === "relay" || command === "client" || command === "wsclient" ? (
        <Label className="mt-4">
          <span>目标地址</span>
          <Input
            className="mt-1"
            placeholder="1.1.1.1"
            value={remoteAddress}
            valid={validRemoteAddress()}
            onChange={(e) => setRemoteAddress(e.target.value)}
          />
        </Label>
      ) : null}
      {command === "relay" || command === "client" || command === "wsclient" ? (
        <Label className="mt-4">
          <span>目标端口</span>
          <Input
            className="mt-1"
            placeholder="8888"
            value={remotePort}
            valid={validRemotePort()}
            onChange={(e) => setRemotePort(e.target.value)}
          />
        </Label>
      ) : null}
      {command === "client" || command === "wsclient" ? (
        <Label className="mt-4">
          <span>Brook 服务端地址</span>
          <Input
            className="mt-1"
            placeholder="1.1.1.1"
            value={serverAddress}
            valid={validServerAddress()}
            onChange={(e) => setServerAddress(e.target.value)}
          />
        </Label>
      ) : null}
      {command === "client" || command === "wsclient" ? (
        <Label className="mt-4">
          <span>Brook 服务端端口</span>
          <Input
            className="mt-1"
            placeholder="8888"
            value={serverPort}
            valid={validServerPort()}
            onChange={(e) => setServerPort(e.target.value)}
          />
        </Label>
      ) : null}
      {command !== "relay" ? (
        <Label className="mt-4">
          <span>Brook密码</span>
          <Input
            className="mt-1"
            placeholder="123456"
            value={password}
            valid={validPassword()}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Label>
      ) : null}
    </>
  );
};

export default BrookRuleEditor;
