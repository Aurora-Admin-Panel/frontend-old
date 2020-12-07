import React, { useEffect, useCallback, useState } from "react";
import { useDispatch } from "react-redux";

import { Input, Label, Select, Button } from "@windmill/react-ui";

import { PlusIcon, MinusIcon } from "../../icons";
import { createForwardRule, editForwardRule } from "../../redux/actions/ports";

const V2rayTemplates = [
  { label: "不使用模版", value: 0 },
  { label: "relay+tls", value: 1 },
  { label: "relay+ws", value: 2 },
  { label: "relay+wss", value: 3 },
  { label: "ss隧道", value: 4 },
  { label: "端口转发", value: 5 },
];

const InboundProtocols = [
  { label: "vmess", value: "vmess" },
  { label: "shadowsocks", value: "shadowsocks" },
  { label: "dokodemo-door", value: "dokodemo-door" },
  { label: "http", value: "http" },
  { label: "socks", value: "socks" },
];
const OutboundProtocols = [
  { label: "freedom", value: "freedom" },
  { label: "blackhole", value: "blackhole" },
  { label: "vmess", value: "vmess" },
  { label: "shadowsocks", value: "shadowsocks" },
  { label: "http", value: "http" },
  { label: "socks", value: "socks" },
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
  const [tab, setTab] = useState({ inbound: true });
  const validRuleForm = useCallback(() => {}, []);
  const submitRuleForm = useCallback(() => {
    const data = {
      method,
      config: {},
    };
    if (forwardRule) {
      dispatch(editForwardRule(serverId, port.id, data));
    } else {
      dispatch(createForwardRule(serverId, port.id, data));
    }
  }, [dispatch, serverId, port, forwardRule, method]);
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
    if (forwardRule) {
    } else {
    }
  }, [forwardRule]);

  return (
    <>
      <Label className="mt-1">
        <div className="flex flex-row justify-between items-center mt-1">
          <span className="w-1/2">配置模版</span>
          <Select
            className="w-1/2"
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
      </Label>
      <Label className="mt-4">
        <div className="flex flex-row justify-start items-center space-x-2">
          <Button className="hidden" />
          <div className={`${tab.inbound ? "border-b-2" : ""}`}>
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
          <div className={`${tab.outbound ? "border-b-2" : ""}`}>
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
        </div>
      </Label>
      <Label className="mt-1">
        配置
      </Label>
      <Label className="mt-1">
        传输配置
      </Label>
    </>
  );
};

export default V2rayRuleEditor;
