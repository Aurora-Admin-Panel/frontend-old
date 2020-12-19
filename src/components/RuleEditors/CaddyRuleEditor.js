import React, { useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";

import { HelperText } from "@windmill/react-ui";

import { createForwardRule, editForwardRule } from "../../redux/actions/ports";

const CaddyRuleEditor = ({
  serverId,
  port,
  method,
  forwardRule,
  setValidRuleForm,
  setSubmitRuleForm,
}) => {
  const dispatch = useDispatch();
  const validRuleForm = useCallback(
    () => (port.external_num ? port.external_num === 443 : port.num === 443),
    [port]
  );
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
  }, [dispatch, serverId, port, method, forwardRule]);

  useEffect(() => {
    if (method === "caddy") {
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
    <div className="flex flex-col">
      <HelperText className="mt-4">
        配合Vmess/Vless/Trojan使用，请分配此端口给用户即可开启代理的TLS功能
      </HelperText>
      {!validRuleForm() ? (
        <HelperText className="mt-4 text-red-600">Caddy仅可在443端口使用</HelperText>
      ) : null}
    </div>
  );
};

export default CaddyRuleEditor;
