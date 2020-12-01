import React, { useEffect, useCallback } from "react";
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
  createForwardRule,
  editForwardRule,
  deleteForwardRule,
} from "../../redux/actions/ports";

const TypeOptions = [
  { label: "TCP", value: "TCP" },
  { label: "UDP", value: "UDP" },
  { label: "TCP & UDP", value: "ALL" },
];

const IptablesRuleEditor = ({
  serverId,
  portId,
  method,
  forwardRule,
  type,
  setType,
  remoteAddress,
  setRemoteAddress,
  remotePort,
  setRemotePort,
  setValidRuleForm,
  setSubmitRuleForm
}) => {
  const dispatch = useDispatch();
  const validRemoteAddress = () => remoteAddress.length > 0;
  const validRemotePort = () =>
    parseInt(remotePort, 10) > 0 && parseInt(remotePort, 10) < 65536;
  
  const validRuleForm = () => validRemoteAddress() && validRemotePort();
  const submitRuleForm = () => {
    const data = {
      method,
      config: {
        type,
        remote_address: remoteAddress,
        remote_port: remotePort
      }
    }
    if (forwardRule) {
      dispatch(editForwardRule(serverId, portId, data))
    } else {
      dispatch(createForwardRule(serverId, portId, data))
    }
  };

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
  }, [forwardRule]);

  useEffect(() => {
    if (method === 'iptables') {
      setValidRuleForm(() => validRuleForm)
      setSubmitRuleForm(() => submitRuleForm)
    }
  }, [method, remoteAddress, remotePort]);

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

export default IptablesRuleEditor;
