import React, { useEffect, useCallback } from "react";

import { Input, Label, Select } from "@windmill/react-ui";

const NetworkOptions = [
  { label: "TCP", value: "tcp", idx: 0 },
  { label: "UDP", value: "udp", idx: 1 },
  { label: "TCP & UDP", value: "tcp,udp", idx: 2 },
];

const DokodemoDoorInboundEditor = ({
  forwardRule,
  protocol,
  settings,
  setSettings,
  setValid,
}) => {
  const validAddress = useCallback(() => settings.address && settings.address.length > 0, [
    settings,
  ]);
  const validPort = useCallback(() => settings.port && parseInt(settings.port) > 0 && parseInt(settings.port) < 65536, [settings]);

  const validInbound = useCallback(() => validAddress() && validPort(), [
    validAddress,
    validPort,
  ]);

  useEffect(() => {
    if (protocol === "dokodemo-door") {
      setValid(() => validInbound);
    }
  }, [protocol, setValid, validInbound]);
  useEffect(() => {
    if (
      forwardRule &&
      forwardRule.config && 
      forwardRule.config.inbound &&
      forwardRule.config.inbound.protocol === "dokodemo-door" &&
      forwardRule.config.inbound.settings
    )
      setSettings(forwardRule.config.inbound.settings);
    else
      setSettings({
        address: "",
        port: 0,
        network: "tcp",
        followRedirect: false,
      });
  }, [forwardRule, protocol, setSettings]);

  return (
    <div className="">
      <Label className="mt-4">
        <div className="flex flex-row justify-between items-center mt-1">
          <div className="w-1/3">
            <span>远端IP地址</span>
          </div>
          <div className="w-2/3">
            <Input
              className="mt-1"
              placeholder="1.1.1.1"
              value={settings.address}
              valid={validAddress()}
              onChange={(e) =>
                setSettings({ ...settings, address: e.target.value })
              }
            />
          </div>
        </div>
      </Label>
      <Label className="mt-1">
        <div className="flex flex-row justify-between items-center mt-1">
          <div className="w-1/3">
            <span>远端端口</span>
          </div>
          <div className="w-2/3">
            <Input
              className="mt-1"
              placeholder="8888"
              value={settings.port}
              valid={validPort()}
              onChange={(e) => e.target.value ? setSettings({ ...settings, port: parseInt(e.target.value) }) : setSettings({ ...settings, port: "" })
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
                  key={`v2ray_dokodemo_door_network_${option.idx}`}
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
            <span>followRedirect</span>
          </div>
          <div className="w-2/3">
            <Input
              type="checkbox"
              checked={settings.followRedirect}
              onChange={() =>
                setSettings({
                  ...settings,
                  followRedirect: !settings.followRedirect,
                })
              }
            />
          </div>
        </div>
      </Label>
    </div>
  );
};

export default DokodemoDoorInboundEditor;
