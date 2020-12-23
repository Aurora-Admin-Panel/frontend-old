import React, { useEffect, useCallback, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Label, Select, Button } from "@windmill/react-ui";

// import { PlusIcon, MinusIcon } from "../../icons";
import { createForwardRule, editForwardRule } from "../../redux/actions/ports";
import { ReverseProxies } from "../../utils/constants";
import CaddyEditor from "../ReverseProxy/CaddyEditor";
import VmessInboundEditor from "./V2ray/VmessInboundEditor";
import ShadowsocksInboundEditor from "./V2ray/ShadowsocksInboundEditor";
import DokodemoDoorInboundEditor from "./V2ray/DokodemoDoorInboundEditor";
import HttpInboundEditor from "./V2ray/HttpInboundEditor";
import SocksInboundEditor from "./V2ray/SocksInboundEditor";
import CustomInboundEditor from "./V2ray/CustomInboundEditor";
import CustomOutboundEditor from "./V2ray/CustomOutboundEditor";
import FreedomEditor from "./V2ray/FreedomEditor";
import BlackholeEditor from "./V2ray/BlockholeEditor";
import TlsEditor from "./V2ray/TlsEditor";


const V2rayTemplates = [
  { label: "暂无使用模版", value: 0 },
];

const InboundProtocols = [
  { label: "vmess", value: "vmess" },
  { label: "shadowsocks", value: "shadowsocks" },
  { label: "dokodemo-door", value: "dokodemo-door" },
  { label: "http", value: "http" },
  { label: "socks", value: "socks" },
  { label: "自定义", value: "custom" },
];
const OutboundProtocols = [
  { label: "freedom", value: "freedom" },
  { label: "blackhole", value: "blackhole" },
  { label: "自定义", value: "custom" },
  // { label: "vmess", value: "vmess" },
  // { label: "shadowsocks", value: "shadowsocks" },
  // { label: "http", value: "http" },
  // { label: "socks", value: "socks" },
];


const V2rayRuleEditor = ({
  serverId,
  port,
  method,
  forwardRule,
  setValidRuleForm,
  setSubmitRuleForm,
}) => {
  const dispatch = useDispatch();
  const [template, setTemplate] = useState(0);
  const [inboundProtocol, setInboundProtocol] = useState("vmess");
  const [inboundSettings, setInboundSettings] = useState({});
  const [inboundStreamSettings, setInboundStreamSettings] = useState({});
  const [inboundSniffing, setInboundSniffing] = useState({ enabled: false });
  const [customInbound, setCustomInbound] = useState("");
  const [validInbound, setValidInbound] = useState(() => () => false);

  const [outboundProtocol, setOutboundProtocol] = useState("freedom");
  // eslint-disable-next-line
  const [outboundSettings, setOutboundSettings] = useState({});
  // eslint-disable-next-line
  const [outboundStreamSettings, setOutboundStreamSettings] = useState({});
  const [customOutbound, setCustomOutbound] = useState("");
  const [validOutbound, setValidOutbound] = useState(() => () => false);

  const [tlsProvider, setTlsProvider] = useState("none");
  const [tlsSettings, setTlsSettings] = useState({});

  const ports = useSelector((state) => state.ports.ports);
  const tlsOptions = useMemo(() => [
    { label: "无", value: "none" },
    { label: "自定义证书(请勿使用,暂不支持)", value: "certificate" },
  ].concat(Object.entries(ports)
    .filter(([_, port]) =>
      port.forward_rule && ReverseProxies.find(m => m === port.forward_rule.method))
    .map(arr => ({
      label: `${arr[1].forward_rule.method} - ${arr[1].external_num ? arr[1].external_num : arr[1].num}`,
      value: arr[1].id
    }))), [ports]);
  const [validTls, setValidTls] = useState(() => () => true);
  const validTlsSettings = useCallback(() => tlsProvider === 'none' ? true : validTls(), [tlsProvider, validTls]);

  const [tab, setTab] = useState({ inbound: true });

  const validRuleForm = useCallback(
    () => validInbound() && validOutbound() && validTlsSettings(),
    [validInbound, validOutbound, validTlsSettings]
  );
  const submitRuleForm = useCallback(() => {
    const data = {
      method,
      config: {
        tls_provider: tlsProvider,
        tls_settings: tlsSettings,
      },
    };
    if (tlsProvider !== "none" && tlsProvider !== "certificate") data.config.reverse_proxy = parseInt(tlsProvider)
    if (inboundProtocol === "custom") {
      data.config.inbound = JSON.parse(customInbound);
      data.config.custom_inbound = true;
    } else {
      data.config.inbound = {
        protocol: inboundProtocol,
        settings: inboundSettings,
        streamSettings: inboundStreamSettings,
        sniffing: inboundSniffing,
      };
      data.config.custom_inbound = false;
    }
    if (outboundProtocol === "custom") {
      data.config.outbound = JSON.parse(customOutbound);
      data.config.custom_outbound = true;
    } else {
      data.config.outbound = {
        protocol: outboundProtocol,
        settings: outboundSettings,
        streamSettings: outboundStreamSettings,
      };
      data.config.custom_outbound = false;
    }
    if (forwardRule) {
      dispatch(editForwardRule(serverId, port.id, data));
    } else {
      dispatch(createForwardRule(serverId, port.id, data));
    }
  }, [
    dispatch,
    serverId,
    port,
    forwardRule,
    method,
    customInbound,
    customOutbound,
    inboundProtocol,
    inboundSettings,
    inboundStreamSettings,
    inboundSniffing,
    outboundProtocol,
    outboundSettings,
    outboundStreamSettings,
    tlsProvider,
    tlsSettings,
  ]);
  const handleTemplate = (t) => {
    setTemplate(t);
    switch (t) {
      case "1":
        break;
      case "2":
        break;
      case "3":
        break;
      case "4":
        break;
      case "5":
        break;
      default:
    }
  };

  useEffect(() => {
    if (method === "v2ray") {
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

  useEffect(() => {
    if (
      forwardRule &&
      forwardRule.config &&
      forwardRule.config.custom_inbound
    ) {
      setInboundProtocol("custom");
    } else if (
      forwardRule &&
      forwardRule.config &&
      forwardRule.config.inbound &&
      forwardRule.config.inbound.protocol &&
      InboundProtocols.find(
        (p) => p.value === forwardRule.config.inbound.protocol
      ) !== undefined
    ) {
      setInboundProtocol(forwardRule.config.inbound.protocol);
    } else setInboundProtocol("vmess");

    if (
      forwardRule &&
      forwardRule.config &&
      forwardRule.config.custom_outbound
    ) {
      setOutboundProtocol("custom");
    } else if (
      forwardRule &&
      forwardRule.config &&
      forwardRule.config.outbounds &&
      forwardRule.config.outbound.protocol &&
      OutboundProtocols.find(
        (p) => p.value === forwardRule.config.outbound.protocol
      ) !== undefined
    ) {
      setOutboundProtocol(forwardRule.config.outbound.protocol);
    } else setOutboundProtocol("freedom");

    if (
      forwardRule &&
      forwardRule.config &&
      forwardRule.config.tls_provider &&
      ports[parseInt(forwardRule.config.tls_provider)] && 
      ports[parseInt(forwardRule.config.tls_provider)].forward_rule
    ) {
      setTlsProvider(forwardRule.config.tls_provider);
    } else {
      setTlsProvider("none");
    }
    if (
      forwardRule &&
      forwardRule.config &&
      forwardRule.config.tls_settings
    ) {
      setTlsSettings(forwardRule.config.tls_settings)
    } else {
      setTlsSettings({});
    }
  }, [
    ports,
    forwardRule,
    setInboundProtocol,
    setOutboundProtocol,
    setCustomInbound,
    setCustomOutbound,
  ]);

  return (
    <>
      <Label className="mt-1">
        <div className="flex flex-row justify-between items-center mt-1">
          <div className="w-1/3">
            <span>配置模版</span>
          </div>
          <div className="w-2/3">
            <Select
              value={template}
              onChange={(e) => handleTemplate(e.target.value)}
            >
              {V2rayTemplates.map((option) => (
                <option
                  value={option.value}
                  key={`gost_template_${option.value}`}
                >
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </Label>
      <Label className="mt-4">
        <div className="flex flex-row justify-start items-center space-x-2">
          <Button className="hidden" />
          <div
            className={`${tab.inbound ? "border-b-2" : ""} ${!validInbound() ? "border-red-500 border-b-2 text-red-500" : ""
              }`}
          >
            <Button
              layout="link"
              onClick={(e) => {
                e.preventDefault();
                setTab({ inbound: true });
              }}
            >
              Inbound
            </Button>
          </div>
          <div
            className={`${tab.outbound ? "border-b-2" : ""} ${!validOutbound() ? "border-red-600 border-b-2" : ""
              }`}
          >
            <Button
              layout="link"
              onClick={(e) => {
                e.preventDefault();
                setTab({ outbound: true });
              }}
            >
              Outbound
            </Button>
          </div>
          <div
            className={`${tab.tls ? "border-b-2" : ""} ${!validTlsSettings() ? "border-red-600 border-b-2" : ""
              }`}
          >
            <Button
              layout="link"
              onClick={(e) => {
                e.preventDefault();
                setTab({ tls: true });
              }}
            >
              TLS
            </Button>
          </div>
        </div>
      </Label>
      <div className={`${tab.inbound ? "block" : "hidden"}`}>
        <Label className="mt-4">
          <div className="flex flex-row justify-between items-center mt-1">
            <div className="w-1/3">
              <span>协议</span>
            </div>
            <div className="w-2/3">
              <Select
                value={inboundProtocol}
                onChange={(e) => setInboundProtocol(e.target.value)}
              >
                {InboundProtocols.map((option) => (
                  <option
                    value={option.value}
                    key={`inbound_protocol_${option.value}`}
                  >
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </Label>
        <Label className="mt-1">
          {inboundProtocol === "vmess" ? (
            <VmessInboundEditor
              forwardRule={forwardRule}
              protocol={inboundProtocol}
              settings={inboundSettings}
              setSettings={setInboundSettings}
              streamSettings={inboundStreamSettings}
              setStreamSettings={setInboundStreamSettings}
              sniffing={inboundSniffing}
              setSniffing={setInboundSniffing}
              setValid={setValidInbound}
            />
          ) : null}
          {inboundProtocol === "shadowsocks" ? (
            <ShadowsocksInboundEditor
              forwardRule={forwardRule}
              protocol={inboundProtocol}
              settings={inboundSettings}
              setSettings={setInboundSettings}
              setValid={setValidInbound}
            />
          ) : null}
          {inboundProtocol === "dokodemo-door" ? (
            <DokodemoDoorInboundEditor
              forwardRule={forwardRule}
              protocol={inboundProtocol}
              settings={inboundSettings}
              setSettings={setInboundSettings}
              setValid={setValidInbound}
            />
          ) : null}
          {inboundProtocol === "http" ? (
            <HttpInboundEditor
              forwardRule={forwardRule}
              protocol={inboundProtocol}
              settings={inboundSettings}
              setSettings={setInboundSettings}
              setValid={setValidInbound}
            />
          ) : null}
          {inboundProtocol === "socks" ? (
            <SocksInboundEditor
              forwardRule={forwardRule}
              protocol={inboundProtocol}
              settings={inboundSettings}
              setSettings={setInboundSettings}
              setValid={setValidInbound}
            />
          ) : null}
          {inboundProtocol === "custom" ? (
            <CustomInboundEditor
              forwardRule={forwardRule}
              protocol={inboundProtocol}
              settings={customInbound}
              setSettings={setCustomInbound}
              setValid={setValidInbound}
            />
          ) : null}
        </Label>
      </div>
      <div className={`${tab.outbound ? "block" : "hidden"}`}>
        <Label className="mt-1">
          <div className="flex flex-row justify-between items-center mt-1">
            <span className="w-1/2">协议</span>
            <Select
              className="w-1/2"
              value={outboundProtocol}
              onChange={(e) => setOutboundProtocol(e.target.value)}
            >
              {OutboundProtocols.map((option) => (
                <option
                  value={option.value}
                  key={`outbound_protocol_${option.value}`}
                >
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </Label>
        <Label className="mt-1">
          {/* {outboundProtocol === "vmess" ? (
            <VmessEditor
              protocol={outboundProtocol}
              settings={inboundSettings}
              setSettings={setInboundSettings}
              setValid={setValidOutbound}
            />
          ) : null} */}
          {outboundProtocol === "freedom" ? (
            <FreedomEditor
              protocol={outboundProtocol}
              setValid={setValidOutbound}
            />
          ) : null}
          {outboundProtocol === "blackhole" ? (
            <BlackholeEditor
              protocol={outboundProtocol}
              setValid={setValidOutbound}
            />
          ) : null}
          {outboundProtocol === "custom" ? (
            <CustomOutboundEditor
              forwardRule={forwardRule}
              protocol={outboundProtocol}
              settings={customOutbound}
              setSettings={setCustomOutbound}
              setValid={setValidOutbound}
            />
          ) : null}
        </Label>
      </div>
      <div className={`${tab.tls ? "block" : "hidden"}`}>
        <Label className="mt-4">
          <div className="flex flex-row justify-between items-center mt-1">
            <div className="w-1/3">
              <span>TLS</span>
            </div>
            <div className="w-2/3">
              <Select
                value={tlsProvider}
                onChange={(e) => setTlsProvider(e.target.value)}
              >
                {tlsOptions.map((option) => (
                  <option
                    value={option.value}
                    key={`v2ray_tls_providers_${option.value}`}
                  >
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </Label>
        {tlsProvider !== "none" &&
          ports[parseInt(tlsProvider)] &&
          ports[parseInt(tlsProvider)].forward_rule &&
          ports[parseInt(tlsProvider)].forward_rule.method === "caddy" ?
          <CaddyEditor
            port={ports[tlsProvider]}
            forwardRule={forwardRule}
            settings={tlsSettings}
            setSettings={setTlsSettings}
            setValid={setValidTls}
          />: null}
        {tlsProvider === "certificate" ?
          <TlsEditor
            tlsProvider={tlsProvider}
            forwardRule={forwardRule}
            settings={tlsSettings}
            setSettings={setTlsSettings}
            setValid={setValidTls}
          />: null}
      </div>
    </>
  );
};

export default V2rayRuleEditor;
