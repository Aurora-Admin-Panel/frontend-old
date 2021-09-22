import React, { useEffect, useCallback } from "react";

import { Input, Label, Select } from "@windmill/react-ui";

const ProtocolOptions = [
  { label: "websocket", value: "ws" },
  { label: "http2", value: "h2" },
]

const CaddyEditor = ({
  port,
  forwardRule,
  settings,
  setSettings,
  setValid,
}) => {
  const validSettings = useCallback(() =>
    settings.domain &&
    settings.domain.length > 0 &&
    settings.path &&
    settings.path.length > 0 &&
    settings.path[0] === '/',
    [settings]);

  console.log(port, forwardRule)  
  useEffect(() => {
    if (
      port &&
      port.forward_rule &&
      port.forward_rule.method === 'caddy') {
        setValid(() => validSettings);
      }
  }, [port, validSettings, setValid]);
  useEffect(() => {
    const defaultSettings = {
      domain: "", path: "", protocol: "ws"
    }
    if (
      port &&
      port.forward_rule &&
      port.forward_rule.method === 'caddy' &&
      forwardRule &&
      forwardRule.config &&
      parseInt(port.id) === parseInt(forwardRule.config.tls_provider) &&
      forwardRule.config.tls_settings
    ) {
      setSettings(forwardRule.config.tls_settings)
    } else {
      setSettings(defaultSettings)
    }
  }, [port, forwardRule, setSettings]);

  return (
    <div className="">
      <Label className="mt-4">
        <div className="flex flex-row justify-between items-center mt-1">
          <div className="w-1/3">
            <span>域名</span>
          </div>
          <div className="w-2/3">
            <Input
              valid={settings.domain && settings.domain.length > 0}
              value={settings.domain}
              placeholder="请确保与v2ray的host一致"
              onChange={(e) =>
                setSettings({
                  ...settings,
                  domain: e.target.value,
                })
              }
            />
          </div>
        </div>
      </Label>
      <Label className="mt-1">
        <div className="flex flex-row justify-between items-center mt-1">
          <div className="w-1/3">
            <span>path</span>
          </div>
          <div className="w-2/3">
            <Input
              valid={settings.path && settings.path.length > 0 && settings.path[0] === '/'}
              value={settings.path}
              placeholder="请确保与v2ray的path一致"
              onChange={(e) =>
                setSettings({
                  ...settings,
                  path: e.target.value,
                })
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
              value={settings.protocol}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  protocol: e.target.value,
                })
              }
            >
              {ProtocolOptions.map((option) => (
                <option
                  value={option.value}
                  key={`caddy_protocol_${option.value}`}
                >
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </Label>
    </div>
  );
};

export default CaddyEditor;
