import React, { useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";

import { HelperText } from "@windmill/react-ui";

import { createForwardRule, editForwardRule } from "../../redux/actions/ports";

const NodeExporterRuleEditor = ({
  serverId,
  portId,
  method,
  forwardRule,
  setValidRuleForm,
  setSubmitRuleForm,
}) => {
  const dispatch = useDispatch();
  const validRuleForm = useCallback(() => true, []);
  const submitRuleForm = useCallback(() => {
    const data = {
      method,
      config: {},
    };
    if (forwardRule) {
      dispatch(editForwardRule(serverId, portId, data));
    } else {
      dispatch(createForwardRule(serverId, portId, data));
    }
  }, [dispatch, serverId, portId, method, forwardRule]);

  useEffect(() => {
    if (method === "node_exporter") {
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
      <HelperText className="mt-4">
        配合
        <button
          className="text-blue-500"
          onClick={() => window.location = "https://leishi.io/blog/posts/2020-08/Making-A-Traffic-Panel-Using-Grafana-And-Promethus/#安装promethus-node-exporter"}>
          流量监控面板
        </button>
        使用，端口功能设置为node_exporter的话无需再安装node exporter，直接安装Prometheus和Grafana即可使用。
        <br />
        <span className="font-bold">请注意在修改prometheus.yml时，端口应为此端口而不再是9100。</span>
      </HelperText>
    </>
  );
};

export default NodeExporterRuleEditor;
