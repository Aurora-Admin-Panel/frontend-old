import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";

import { Input, Label, Select } from "@windmill/react-ui";

import { createForwardRule, editForwardRule } from "../../redux/actions/ports";

const TypeOptions = [
  { label: "TCP", value: "TCP" },
  { label: "UDP", value: "UDP" },
  { label: "TCP & UDP", value: "ALL" },
];

const SocatRuleEditor = ({
  serverId,
  portId,
  method,
  forwardRule,
  setValidRuleForm,
  setSubmitRuleForm,
}) => {
  const dispatch = useDispatch();
  const [type, setType] = useState("TCP");
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
        type,
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
    type,
    remoteAddress,
    remotePort,
    forwardRule,
  ]);

  useEffect(() => {
    if (forwardRule) {
      if (forwardRule.config.type) setType(forwardRule.config.type);
      else setType("TCP");
      if (forwardRule.config.remote_address)
        setRemoteAddress(forwardRule.config.remote_address);
      else setRemoteAddress("");
      if (forwardRule.config.remote_port)
        setRemotePort(forwardRule.config.remote_port);
      else setRemotePort(0);
    } else {
      setType("TCP");
      setRemoteAddress("");
      setRemotePort(0);
    }
  }, [forwardRule, setRemoteAddress, setRemotePort, setType]);

  useEffect(() => {
    if (method === "socat") {
      setValidRuleForm(() => validRuleForm);
      setSubmitRuleForm(() => submitRuleForm);
    }
  }, [
    method,
    remoteAddress,
    remotePort,
    setValidRuleForm,
    setSubmitRuleForm,
    validRuleForm,
    submitRuleForm,
  ]);

  return (
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
  );
};

export default SocatRuleEditor;
