import React, { useEffect, useCallback } from "react";

import { Input, Label, Select } from "@windmill/react-ui";

const EncryptionOptions = [
  { label: "aes-128-gcm", value: "aes-128-gcm" },
  { label: "aes-256-gcm", value: "aes-256-gcm" },
  { label: "chacha20-poly1305", value: "chacha20-poly1305" },
  { label: "none", value: "none" },
];
const NetworkOptions = [
    { label: "TCP", value: "tcp", idx: 0 },
    { label: "UDP", value: "udp", idx: 1 },
    { label: "TCP & UDP", value: "tcp,udp", idx: 2 },
  ];

const ShadowsocksInboundEditor = ({
  forwardRule,
  protocol,
  settings,
  setSettings,
  setValid,
}) => {
  const validPassword = useCallback(
    () => settings.password && settings.password.length > 0,
    [settings]
  );
  const validEmail = useCallback(
    () => !settings.email || settings.email.length > 0,
    [settings]
  );

  const validInbound = useCallback(() => validPassword() && validEmail(), [
    validPassword,
    validEmail,
  ]);

  useEffect(() => {
    if (protocol === "shadowsocks") {
      setValid(() => validInbound);
    }
  }, [protocol, setValid, validInbound]);
  useEffect(() => {
    if (
      forwardRule &&
      forwardRule.config && 
      forwardRule.config.inbound &&
      forwardRule.config.inbound.protocol === "shadowsocks" &&
      forwardRule.config.inbound.settings
    )
      setSettings(forwardRule.config.inbound.settings);
    else
      setSettings({
        email: "",
        method: "aes-256-gcm",
        password: "",
        network: "tcp",
      });
  }, [forwardRule, protocol, setSettings]);

  return (
    <div className="">
      <Label className="mt-4">
        <div className="flex flex-row justify-between items-center mt-1">
          <div className="w-1/3">
            <span>加密方式</span>
          </div>
          <div className="w-2/3">
            <Select
              className="w-1/2"
              value={settings.method}
              onChange={(e) =>
                setSettings({ ...settings, method: e.target.value })
              }
            >
              {EncryptionOptions.map((option) => (
                <option
                  value={option.value}
                  key={`v2ray_shadowsocks_encryption_${option.value}`}
                >
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </Label>
      <Label className="mt-1">
        <div className="flex flex-row justify-between items-center mt-1">
          <div className="w-1/3">
            <span>密码</span>
          </div>
          <div className="w-2/3">
            <Input
              className="mt-1"
              placeholder="ss协议密码"
              value={settings.password}
              valid={validPassword()}
              onChange={(e) =>
                setSettings({ ...settings, password: e.target.value })
              }
            />
          </div>
        </div>
      </Label>
      <Label className="mt-1">
        <div className="flex flex-row justify-between items-center mt-1">
          <div className="w-1/3">
            <span>传输方式</span>
          </div>
          <div className="w-2/3">
            <Select
              className="w-1/2"
              value={settings.network}
              onChange={(e) =>
                setSettings({ ...settings, network: e.target.value })
              }
            >
              {NetworkOptions.map((option) => (
                <option
                  value={option.value}
                  key={`v2ray_shadowsocks_network_${option.idx}`}
                >
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </Label>
      <Label className="mt-1">
        <div className="flex flex-row justify-between items-center mt-1">
          <div className="w-1/3">
            <span>邮件</span>
          </div>
          <div className="w-2/3">
            <Input
              className="mt-1"
              placeholder="可为空，用于流量识别"
              value={settings.email}
              valid={validEmail()}
              onChange={(e) =>
                setSettings({ ...settings, email: e.target.value })
              }
            />
          </div>
        </div>
      </Label>
    </div>
  );
};

export default ShadowsocksInboundEditor;
