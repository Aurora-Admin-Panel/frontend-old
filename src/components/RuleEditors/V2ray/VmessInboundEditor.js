import React, { useEffect, useCallback } from "react";
import { v4 as uuidv4, validate as uuidValidate } from "uuid";

import { ArrowClockwise } from "phosphor-react";
import { Input, Label, Select, Button, HelperText } from "@windmill/react-ui";

const NetworkOptions = [
  { label: "TCP", value: "tcp" },
  { label: "KCP", value: "kcp" },
  { label: "Websocket", value: "ws" },
];

const VmessInboundEditor = ({
  forwardRule,
  protocol,
  settings,
  setSettings,
  streamSettings,
  setStreamSettings,
  sniffing,
  setSniffing,
  setValid,
}) => {
  const handIdChange = (e, idx) => {
    e.preventDefault();
    if (e.type === "change") settings.clients[idx]["id"] = e.target.value;
    else if (e.type === "click") settings.clients[idx]["id"] = uuidv4();
    setSettings({ ...settings });
  };
  const handleAlterIdChange = (e, idx) => {
    e.preventDefault();
    settings.clients[idx].alterId = e.target.value;
    setSettings({ ...settings });
  };
  const handleEmailChange = (e, idx) => {
    e.preventDefault();
    settings.clients[idx].email = e.target.value;
    setSettings({ ...settings });
  };

  const validInbound = useCallback(
    () =>
      settings.clients &&
      settings.clients.length > 0 &&
      settings.clients.every((c) => uuidValidate(c.id)),
    [settings]
  );

  useEffect(() => {
    if (protocol === "vmess") {
      setValid(() => validInbound);
    }
  }, [protocol, setValid, validInbound]);
  useEffect(() => {
    if (
      forwardRule &&
      forwardRule.config &&
      forwardRule.config.inbound &&
      forwardRule.config.inbound.settings &&
      forwardRule.config.inbound.protocol === "vmess"
    )
      setSettings(forwardRule.config.inbound.settings);
    else
      setSettings({
        clients: [
          {
            id: uuidv4(),
            alterId: 64,
          },
        ],
      });
    if (
      forwardRule &&
      forwardRule.config &&
      forwardRule.config.inbound &&
      forwardRule.config.inbound.protocol === "vmess" &&
      forwardRule.config.inbound.streamSettings
    )
      setStreamSettings(forwardRule.config.inbound.streamSettings);
    else setStreamSettings({});
    if (
      forwardRule &&
      forwardRule.config &&
      forwardRule.config.inbound &&
      forwardRule.config.inbound.protocol === "vmess" &&
      forwardRule.config.inbound.sniffing
    )
      setSniffing(forwardRule.config.inbound.sniffing);
    else setSniffing({ enabled: false });
  }, [forwardRule, protocol, setSettings, setStreamSettings, setSniffing]);

  return (
    <div>
      {settings.clients
        ? settings.clients.map((client, idx) => (
            <div className="flex flex-col mt-4" key={`vmess_client_${idx}`}>
              {/* <h3 className="text-lg">用户</h3> */}
              <div
                className="flex flex-col justify-start"
                key={`inbound_protocol_clients_${idx}`}
              >
                <div className="relative mb-1">
                  <Input
                    className="pr-6"
                    value={client.id}
                    valid={uuidValidate(client.id)}
                    onChange={(e) => handIdChange(e, idx)}
                  />
                  <button className="hidden" />
                  <button
                    className="absolute inset-y-0 right-0 mr-2"
                    onClick={(e) => handIdChange(e, idx)}
                  >
                    <ArrowClockwise weight="bold" />
                  </button>
                </div>
                <div className="flex flex-row items-center space-x-2">
                  <div className="w-1/3">
                    <HelperText className="ml-1">alterId</HelperText>
                  </div>
                  <div className="w-2/3">
                    <HelperText className="ml-1">email</HelperText>
                  </div>
                </div>
                <div className="flex flex-row items-center space-x-2">
                  <div className="w-1/3">
                    <Input
                      value={client.alterId}
                      onChange={(e) => handleAlterIdChange(e, idx)}
                    />
                  </div>
                  <div className="w-2/3">
                    <Input
                      value={client.email}
                      placeholder="可为空"
                      onChange={(e) => handleEmailChange(e, idx)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))
        : null}
      {settings.network ? (
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
                  key={`v2ray_vmess_network_${option.idx}`}
                >
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </Label>
      ): null }
    </div>
  );
};

export default VmessInboundEditor;
