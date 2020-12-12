import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";

import { Input, Label, Select } from "@windmill/react-ui";

import { createForwardRule, editForwardRule } from "../../redux/actions/ports";

const EncryptionOptions = [
  { label: "AEAD_AES_128_GCM", value: "AEAD_CHACHA20_POLY1305" },
  { label: "AEAD_AES_256_GCM", value: "AEAD_CHACHA20_POLY1305" },
  { label: "AEAD_CHACHA20_POLY1305", value: "AEAD_CHACHA20_POLY1305" },
  { label: "aes-128-cfb", value: "aes-128-cfb" },
  { label: "aes-192-cfb", value: "aes-192-cfb" },
  { label: "aes-256-cfb", value: "aes-256-cfb" },
  { label: "aes-128-ctr", value: "aes-128-ctr" },
  { label: "aes-192-ctr", value: "aes-192-ctr" },
  { label: "aes-256-ctr", value: "aes-256-ctr" },
  { label: "des-cfb", value: "des-cfb" },
  { label: "bf-cfb", value: "bf-cfb" },
  { label: "cast5-cfb", value: "cast5-cfb" },
  { label: "rc4-md5", value: "rc4-md5" },
  { label: "rc4-md5-6", value: "rc4-md5-6" },
  { label: "chacha20", value: "chacha20" },
  { label: "chacha20-ietf", value: "chacha20-ietf" },
  { label: "salsa20", value: "salsa20" },
];

const ShadowsocksRuleEditor = ({
  serverId,
  port,
  method,
  forwardRule,
  setValidRuleForm,
  setSubmitRuleForm,
}) => {
  const dispatch = useDispatch();
  const [encryption, setEncryption] = useState("AEAD_AES_128_GCM");
  const [password, setPassword] = useState("");

  const validPassword = useCallback(() => password.length > 0, [password]);
  const validRuleForm = useCallback(() => validPassword(), [validPassword]);
  const submitRuleForm = useCallback(() => {
    const data = {
      method,
      config: {
        encryption,
        password,
      },
    };
    if (forwardRule) {
      dispatch(editForwardRule(serverId, port.id, data));
    } else {
      dispatch(createForwardRule(serverId, port.id, data));
    }
  }, [dispatch, serverId, port.id, method, encryption, password, forwardRule]);

  useEffect(() => {
    if (forwardRule && forwardRule.config.encryption)
      setEncryption(forwardRule.config.encryption);
    else setEncryption("AEAD_AES_128_GCM");
    if (forwardRule && forwardRule.config.password)
      setPassword(forwardRule.config.password);
    else setPassword("");
  }, [forwardRule, setEncryption, setPassword]);

  useEffect(() => {
    if (method === "shadowsocks") {
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
          <span className="w-1/2">加密方式</span>
          <Select
            className="w-1/2"
            value={encryption}
            onChange={(e) => setEncryption(e.target.value)}
          >
            {EncryptionOptions.map((option) => (
              <option
                value={option.value}
                key={`shadowsocks_encryption_${option.value}`}
              >
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      </Label>
      <Label className="mt-1">
        <span>密码</span>
        <Input
          className="mt-1"
          placeholder="ss协议密码"
          value={password}
          valid={validPassword()}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Label>
    </>
  );
};

export default ShadowsocksRuleEditor;
