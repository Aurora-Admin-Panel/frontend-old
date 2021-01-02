import React, { useEffect, useCallback } from "react";
import { v4 as uuidv4, validate as uuidValidate } from "uuid";

import { ArrowClockwise } from "phosphor-react";
import { Input, Label, Select, HelperText } from "@windmill/react-ui";

const NetworkOptions = [
  { label: "tcp", value: "tcp" },
  { label: "kcp", value: "kcp" },
  { label: "ws", value: "ws" },
  // { label: "http", value: "http" },
  { label: "http2", value: "h2" },
  // { label: "domainsocket", value: "domainsocket" },
  { label: "quic", value: "quic" },
];
const StreamHeaderOptions = [
  { label: "不伪装", value: "none" },
  { label: "srtp - 伪装成 SRTP 数据包", value: "srtp" },
  { label: "utp - 伪装成 uTP 数据包", value: "utp" },
  { label: "wechat-video - 伪装成微信视频通话", value: "wechat-video" },
  { label: "dtls - 伪装成 DTLS 1.2 数据包", value: "dtls" },
  { label: "wireguard - 伪装成 WireGuard 数据包", value: "wireguard" },
]
const SecurityOptions = [
  { label: "none", value: "none" },
  { label: "aes-128-gcm", value: "aes-128-gcm" },
  { label: "chacha20-poly1305", value: "chacha20-poly1305" },
]

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
    settings.clients[idx].alterId = parseInt(e.target.value);
    setSettings({ ...settings });
  };
  const handleEmailChange = (e, idx) => {
    e.preventDefault();
    settings.clients[idx].email = e.target.value;
    setSettings({ ...settings });
  };
  const handleNetWorkChange = (e) => {
    e.preventDefault();
    switch (e.target.value) {
      case "tcp":
        setStreamSettings({
          network: "tcp",
          security: "none",
          tcpSettings: {
            acceptProxyProtocol: false,
            header: {
              type: "none",
            },
          },
        });
        break;
      case "ws":
        setStreamSettings({
          network: "ws",
          security: "none",
          wsSettings: {
            acceptProxyProtocol: false,
            path: `/${Math.random().toString(36).substring(7)}`,
            headers: {
              Host: "",
            },
          },
        });
        break;
      case "kcp":
        setStreamSettings({
          network: "kcp",
          security: "none",
          kcpSettings: {
            mtu: 1350,
            tti: 20,
            uplinkCapacity: 5,
            downlinkCapacity: 20,
            congestion: false,
            readBufferSize: 1,
            writeBufferSize: 1,
            header: {
              type: "none"
            },
            seed: "Password"
          },
        });
        break;
      case "http":
        setStreamSettings({
          network: "http",
          security: "none",
          httpSettings: {
            host: [
              ""
            ],
            path: "/"
          }
        })
        break;
      case "h2":
        setStreamSettings({
          network: "h2",
          security: "none",
          httpSettings: {
            host: [
              ""
            ],
            path: `/${Math.random().toString(36).substring(7)}`,
          }
        })
        break;
      case "quic":
        setStreamSettings({
          network: "quic",
          security: "none",
          quicSettings: {
            security: "none",
            key: "",
            header: {
              "type": "none"
            }
          }
        })
        break;
      case "domainsocket":
        setStreamSettings({
          network: "domainsocket",
          security: "none",
          dsSettings: {
            path: "/path/to/ds/file",
            abstract: false,
            padding: false
          }
        })
        break;
      default:
        break;
    }
  };

  const validSettings = useCallback(
    () =>
      settings.clients &&
      settings.clients.length > 0 &&
      settings.clients.every((c) => uuidValidate(c.id)),
    [settings]
  );
  const validStreamSettings = useCallback(
    () => {
      switch (streamSettings.network) {
        case "tcp":
          return !!streamSettings.tcpSettings;
        case "ws":
          return !!streamSettings.wsSettings && streamSettings.wsSettings.path && streamSettings.wsSettings.path.length > 0 && streamSettings.wsSettings.headers.Host.length > 0;
        case "kcp":
          return !!streamSettings.kcpSettings;
        case "quic":
          return !!streamSettings.quicSettings && (streamSettings.quicSettings.security === "none" ? true : streamSettings.quicSettings.key.length > 0)
        case "h2":
          return !!streamSettings.httpSettings && streamSettings.httpSettings.host && streamSettings.httpSettings.host.length > 0 && streamSettings.httpSettings.host[0].length > 0;
        default:
          return false;
      }
    }, [streamSettings])
  const validInbound = useCallback(() => validSettings() && validStreamSettings(), [validSettings, validStreamSettings])

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
    const defautStreamSettings = {
      network: "tcp",
      security: "none",
      tcpSettings: {
        acceptProxyProtocol: false,
        header: {
          type: "none",
        },
      },
    };
    if (
      forwardRule &&
      forwardRule.config &&
      forwardRule.config.inbound &&
      forwardRule.config.inbound.protocol === "vmess" &&
      forwardRule.config.inbound.streamSettings
    )
      setStreamSettings({
        ...defautStreamSettings,
        ...forwardRule.config.inbound.streamSettings,
      });
    else setStreamSettings(defautStreamSettings);
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
                    type="number"
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
      <Label className="mt-1">
        <div className="flex flex-row justify-between items-center mt-1">
          <div className="w-1/3">
            <span>sniffing</span>
          </div>
          <div className="w-2/3">
            <Input
              type="checkbox"
              checked={sniffing.enabled}
              onChange={() =>
                setSniffing(sniffing.enabled ? { enabled: false } : { enabled: true, destOverride: ["http", "tls"] })
              }
            />
          </div>
        </div>
      </Label>
      <Label className="mt-4">
        <div className="flex flex-row justify-between items-center mt-1">
          <div className="w-1/3">
            <span>传输方式</span>
          </div>
          <div className="w-2/3">
            <Select
              className="w-1/2"
              value={streamSettings.network}
              onChange={(e) => handleNetWorkChange(e)}
            >
              {NetworkOptions.map((option) => (
                <option
                  value={option.value}
                  key={`v2ray_vmess_network_${option.value}`}
                >
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </Label>
      {streamSettings.network === "tcp" && streamSettings.tcpSettings ? (
        <>
          <Label className="mt-1">
            <div className="flex flex-row justify-between items-center mt-1">
              <div className="w-1/3">
                <span>acceptProxyProtocol</span>
              </div>
              <div className="w-2/3">
                <Input
                  type="checkbox"
                  checked={streamSettings.tcpSettings.acceptProxyProtocol}
                  onChange={() =>
                    setStreamSettings({
                      ...streamSettings,
                      tcpSettings: {
                        ...streamSettings.tcpSettings,
                        acceptProxyProtocol: !streamSettings.tcpSettings
                          .acceptProxyProtocol,
                      },
                    })
                  }
                />
              </div>
            </div>
          </Label>
        </>
      ) : null}
      {streamSettings.network === "ws" && streamSettings.wsSettings ? (
        <>
          <Label className="mt-1">
            <div className="flex flex-row justify-between items-center mt-1">
              <div className="w-1/3">
                <span>acceptProxyProtocol</span>
              </div>
              <div className="w-2/3">
                <Input
                  type="checkbox"
                  checked={streamSettings.wsSettings.acceptProxyProtocol}
                  onChange={() =>
                    setStreamSettings({
                      ...streamSettings,
                      wsSettings: {
                        ...streamSettings.wsSettings,
                        acceptProxyProtocol: !streamSettings.wsSettings
                          .acceptProxyProtocol,
                      },
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
                  className="mt-1"
                  placeholder="/ray"
                  value={streamSettings.wsSettings.path}
                  valid={streamSettings.wsSettings.path && streamSettings.wsSettings.path.length>0 && streamSettings.wsSettings.path.startsWith('/')}
                  onChange={(e) => setStreamSettings({
                    ...streamSettings,
                    wsSettings: {
                      ...streamSettings.wsSettings,
                      path: e.target.value,
                    },
                  })}
                />
              </div>
            </div>
          </Label>
          <Label className="mt-1">
            <div className="flex flex-row justify-between items-center mt-1">
              <div className="w-1/3">
                <span>Host</span>
              </div>
              <div className="w-2/3">
                <Input
                  className="mt-1"
                  placeholder=""
                  value={streamSettings.wsSettings.headers.Host}
                  valid={streamSettings.wsSettings.headers && streamSettings.wsSettings.headers.Host.length>0}
                  onChange={(e) => setStreamSettings({
                    ...streamSettings,
                    wsSettings: {
                      ...streamSettings.wsSettings,
                      headers: {
                        ...streamSettings.wsSettings.headers,
                        Host: e.target.value,
                      }
                    },
                  })}
                />
              </div>
            </div>
          </Label>
        </>
      ) : null}
      {streamSettings.network === "kcp" && streamSettings.kcpSettings ? (
        <>
          <Label className="mt-1">
            <div className="flex flex-row justify-between items-center mt-1">
              <div className="w-1/3">
                <span>seed</span>
              </div>
              <div className="w-2/3">
                <Input
                  className="mt-1"
                  placeholder="Password"
                  value={streamSettings.kcpSettings.seed}
                  onChange={(e) => setStreamSettings({
                    ...streamSettings,
                    kcpSettings: {
                      ...streamSettings.kcpSettings,
                      seed: e.target.value,
                    },
                  })}
                />
              </div>
            </div>
          </Label>
          <Label className="mt-1">
            <div className="flex flex-row justify-between items-center mt-1">
              <div className="w-1/3">
                <span>伪装头部</span>
              </div>
              <div className="w-2/3">
                <Select
                  className="w-1/2"
                  value={streamSettings.kcpSettings.header.type}
                  onChange={(e) => setStreamSettings({
                    ...streamSettings,
                    kcpSettings: {
                      ...streamSettings.kcpSettings,
                      header: {
                        type: e.target.value,
                      }
                    },
                  })}
                >
                  {StreamHeaderOptions.map((option) => (
                    <option
                      value={option.value}
                      key={`v2ray_vmess_kcp_header_${option.value}`}
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
                <span>congestion</span>
              </div>
              <div className="w-2/3">
                <Input
                  type="checkbox"
                  checked={streamSettings.kcpSettings.congestion}
                  onChange={() =>
                    setStreamSettings({
                      ...streamSettings,
                      kcpSettings: {
                        ...streamSettings.kcpSettings,
                        congestion: !streamSettings.kcpSettings
                          .congestion,
                      },
                    })
                  }
                />
              </div>
            </div>
          </Label>
          <Label className="mt-1">
            <div className="flex flex-row justify-between items-center mt-1">
              <div className="w-1/2">
                <span>uplinkCapacity</span>
              </div>
              <div className="w-1/2">
                <span>downlinkCapacity</span>
              </div>
            </div>
            <div className="flex flex-row justify-between items-center mt-1">
              <div className="w-1/2">
                <Input
                  type="number"
                  placeholder="上行链路容量"
                  value={streamSettings.kcpSettings.uplinkCapacity}
                  onChange={(e) => setStreamSettings({
                    ...streamSettings,
                    kcpSettings: {
                      ...streamSettings.kcpSettings,
                      uplinkCapacity: parseInt(e.target.value),
                    },
                  })}
                />
              </div>
              <div className="w-1/2">
                <Input
                  type="number"
                  placeholder="下行链路容量"
                  value={streamSettings.kcpSettings.downlinkCapacity}
                  onChange={(e) => setStreamSettings({
                    ...streamSettings,
                    kcpSettings: {
                      ...streamSettings.kcpSettings,
                      downlinkCapacity: parseInt(e.target.value),
                    },
                  })}
                />
              </div>
            </div>
          </Label>
          <Label className="mt-1">
            <div className="flex flex-row justify-between items-center mt-1">
              <div className="w-1/4">
                <span>mtu</span>
              </div>
              <div className="w-1/4">
                <span>tti</span>
              </div>
              <div className="w-1/4">
                <span>readBufferSize</span>
              </div>
              <div className="w-1/4">
                <span>writeBufferSize</span>
              </div>
            </div>
            <div className="flex flex-row justify-between items-center mt-1">
              <div className="w-1/4">
                <Input
                  type="number"
                  placeholder="576~1460"
                  value={streamSettings.kcpSettings.mtu}
                  onChange={(e) => setStreamSettings({
                    ...streamSettings,
                    kcpSettings: {
                      ...streamSettings.kcpSettings,
                      mtu: parseInt(e.target.value),
                    },
                  })}
                />
              </div>
              <div className="w-1/4">
                <Input
                  type="number"
                  placeholder="10~100"
                  value={streamSettings.kcpSettings.tti}
                  onChange={(e) => setStreamSettings({
                    ...streamSettings,
                    kcpSettings: {
                      ...streamSettings.kcpSettings,
                      tti: parseInt(e.target.value),
                    },
                  })}
                />
              </div>
              <div className="w-1/4">
                <Input
                  type="number"
                  placeholder="单个连接的读取缓冲区大小"
                  value={streamSettings.kcpSettings.readBufferSize}
                  onChange={(e) => setStreamSettings({
                    ...streamSettings,
                    kcpSettings: {
                      ...streamSettings.kcpSettings,
                      readBufferSize: parseInt(e.target.value),
                    },
                  })}
                />
              </div>
              <div className="w-1/4">
                <Input
                  type="number"
                  placeholder="单个连接的写入缓冲区大小"
                  value={streamSettings.kcpSettings.writeBufferSize}
                  onChange={(e) => setStreamSettings({
                    ...streamSettings,
                    kcpSettings: {
                      ...streamSettings.kcpSettings,
                      writeBufferSize: parseInt(e.target.value),
                    },
                  })}
                />
              </div>
            </div>
          </Label>
        </>
      ) : null}
      {streamSettings.network === "h2" && streamSettings.httpSettings ? (
        <>
          <Label className="mt-1">
            <div className="flex flex-row justify-between items-center mt-1">
              <div className="w-1/3">
                <span>path</span>
              </div>
              <div className="w-2/3">
                <Input
                  className="mt-1"
                  placeholder="/ray"
                  value={streamSettings.httpSettings.path}
                  onChange={(e) => setStreamSettings({
                    ...streamSettings,
                    httpSettings: {
                      ...streamSettings.httpSettings,
                      path: e.target.value,
                    },
                  })}
                />
              </div>
            </div>
          </Label>
          <Label className="mt-1">
            <div className="flex flex-row justify-between items-center mt-1">
              <div className="w-1/3">
                <span>host</span>
              </div>
              <div className="w-2/3">
                <Input
                  className="mt-1"
                  placeholder="服务器域名"
                  valid={streamSettings.httpSettings.host && streamSettings.httpSettings.host.length > 0 && streamSettings.httpSettings.host[0].length > 0}
                  value={streamSettings.httpSettings.host[0]}
                  onChange={(e) => setStreamSettings({
                    ...streamSettings,
                    httpSettings: {
                      ...streamSettings.httpSettings,
                      host: [
                        e.target.value,
                      ]
                    },
                  })}
                />
              </div>
            </div>
          </Label>
        </>
      ) : null}
      {streamSettings.network === "quic" && streamSettings.quicSettings ? (
        <>
          <Label className="mt-4">
            <div className="flex flex-row justify-between items-center mt-1">
              <div className="w-1/3">
                <span>伪装头部</span>
              </div>
              <div className="w-2/3">
                <Select
                  className="w-1/2"
                  value={streamSettings.quicSettings.header.type}
                  onChange={(e) => setStreamSettings({
                    ...streamSettings,
                    quicSettings: {
                      ...streamSettings.quicSettings,
                      header: {
                        type: e.target.value,
                      }
                    },
                  })}
                >
                  {StreamHeaderOptions.map((option) => (
                    <option
                      value={option.value}
                      key={`v2ray_vmess_quic_header_${option.value}`}
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
                <span>security</span>
              </div>
              <div className="w-2/3">
                <Select
                  className="w-1/2"
                  value={streamSettings.quicSettings.security}
                  onChange={(e) => setStreamSettings({
                    ...streamSettings,
                    quicSettings: {
                      ...streamSettings.quicSettings,
                      security: e.target.value
                    },
                  })}
                >
                  {SecurityOptions.map((option) => (
                    <option
                      value={option.value}
                      key={`v2ray_vmess_quic_security_${option.value}`}
                    >
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </Label>
        </>
      ) : null}
      {streamSettings.network === "quic" && streamSettings.quicSettings && streamSettings.quicSettings.security !== 'none' ? (
        <Label className="mt-1">
          <div className="flex flex-row justify-between items-center mt-1">
            <div className="w-1/3">
              <span>key</span>
            </div>
            <div className="w-2/3">
              <Input
                className="mt-1"
                valid={streamSettings.quicSettings.key && streamSettings.quicSettings.key.length > 0}
                value={streamSettings.quicSettings.key}
                onChange={(e) => setStreamSettings({
                  ...streamSettings,
                  quicSettings: {
                    ...streamSettings.quicSettings,
                    key: e.target.value,
                  },
                })}
              />
            </div>
          </div>
        </Label>
      ) : null}
    </div>
  );
};

export default VmessInboundEditor;
