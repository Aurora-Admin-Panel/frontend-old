import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";

import { Input, Label, Select } from "@windmill/react-ui";

import { createForwardRule, editForwardRule } from "../../redux/actions/ports";

const CommandOptions = [
  { label: "TCP - 普通端口转发", value: "tcp" },
  { label: "WS - 入口", value: "ws-in" },
  { label: "WS - 出口", value: "ws-out" },
  { label: "WSS - 入口", value: "wss-in" },
  { label: "WSS - 出口", value: "wss-out" },
];

const RealmRuleEditor = ({
  serverId,
  portId,
  method,
  forwardRule,
  setValidRuleForm,
  setSubmitRuleForm,
}) => {
  const dispatch = useDispatch();
  const [command, setCommand] = useState("tcp");
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
        command,
        remote_address: remoteAddress,
        remote_port: remotePort,
      },
    };
    if (forwardRule) {
      dispatch(editForwardRule(serverId, portId, data));
    } else {
      dispatch(createForwardRule(serverId, portId, data));
    }
  }, [
    dispatch,
    serverId,
    portId,
    method,
    command,
    remoteAddress,
    remotePort,
    forwardRule,
  ]);

  useEffect(() => {
    if (forwardRule) {
      if (forwardRule.config.command) setCommand(forwardRule.config.command);
      else setCommand("tcp");
      if (forwardRule.config.remote_address)
        setRemoteAddress(forwardRule.config.remote_address);
      else setRemoteAddress("");
      if (forwardRule.config.remote_port)
        setRemotePort(forwardRule.config.remote_port);
      else setRemotePort(0);
    } else {
      setCommand("tcp");
      setRemoteAddress("");
      setRemotePort(0);
    }
  }, [forwardRule, setCommand, setRemoteAddress, setRemotePort]);

  useEffect(() => {
    if (method === "realm") {
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
        <span>传输协议</span>
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
        <Label className="mt-4">
          <span>{command.endsWith("in") ? "出口" : "落地"}地址</span>
          <Input
            className="mt-1"
            placeholder="1.1.1.1"
            value={remoteAddress}
            valid={validRemoteAddress()}
            onChange={(e) => setRemoteAddress(e.target.value)}
          />
        </Label>
        <Label className="mt-4">
          <span>{command.endsWith("in") ? "出口" : "落地"}端口</span>
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

export default RealmRuleEditor;
