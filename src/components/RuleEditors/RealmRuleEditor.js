import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";

import { Input, Label } from "@windmill/react-ui";

import { createForwardRule, editForwardRule } from "../../redux/actions/ports";


const RealmRuleEditor = ({
  serverId,
  portId,
  method,
  forwardRule,
  setValidRuleForm,
  setSubmitRuleForm,
}) => {
  const dispatch = useDispatch();
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
    remoteAddress,
    remotePort,
    forwardRule,
  ]);

  useEffect(() => {
    if (forwardRule) {
      if (forwardRule.config.remote_address)
        setRemoteAddress(forwardRule.config.remote_address);
      else setRemoteAddress("");
      if (forwardRule.config.remote_port)
        setRemotePort(forwardRule.config.remote_port);
      else setRemotePort(0);
    } else {
      setRemoteAddress("");
      setRemotePort(0);
    }
  }, [forwardRule, setRemoteAddress, setRemotePort]);

  useEffect(() => {
    if (method === "realm") {
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

export default RealmRuleEditor;
