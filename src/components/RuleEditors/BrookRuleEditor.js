import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";

import { Input, Label, Select } from "@windmill/react-ui";

import { createForwardRule, editForwardRule } from "../../redux/actions/ports";

const CommandOptions = [
  { label: "端口转发", value: "relay" },
  { label: "server", value: "server" },
  { label: "client", value: "client" },
  { label: "wsserver", value: "wsserver" },
  { label: "wsclient", value: "wsclient" },
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
  const [password, setPassword] = useState("");
  const validRemoteAddress = useCallback(() => remoteAddress.length > 0, [
    remoteAddress,
  ]);
  const validRemotePort = useCallback(
    () => parseInt(remotePort, 10) > 0 && parseInt(remotePort, 10) < 65536,
    [remotePort]
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
      command !== "relay"
        ? validPassword()
        : true,
    [command, validRemoteAddress, validRemotePort, validPassword]
  );
  const submitRuleForm = useCallback(() => {
    const data = {
      method,
      config: {
        command,
        remote_address: remoteAddress,
        remote_port: remotePort,
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
      if (forwardRule.config.password) setPassword(forwardRule.config.password);
      else setPassword("");
    } else {
      setCommand("relay");
      setRemoteAddress("");
      setRemotePort(0);
      setPassword("");
    }
  }, [forwardRule, setCommand, setRemoteAddress, setRemotePort, setPassword]);

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
          <span>{command === "relay" ? "远端" : "Brook服务器"}IP</span>
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
          <span>{command === "relay" ? "远端" : "Brook服务器"}端口</span>
          <Input
            className="mt-1"
            placeholder="8888"
            value={remotePort}
            valid={validRemotePort()}
            onChange={(e) => setRemotePort(e.target.value)}
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
