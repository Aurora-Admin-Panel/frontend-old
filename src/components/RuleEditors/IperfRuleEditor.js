import React, { useEffect, useCallback, useState } from "react";
import { useDispatch } from "react-redux";

import { Label, Input } from "@windmill/react-ui";

import { createForwardRule, editForwardRule } from "../../redux/actions/ports";

const IperfRuleEditor = ({
  serverId,
  portId,
  method,
  forwardRule,
  setValidRuleForm,
  setSubmitRuleForm,
}) => {
  const dispatch = useDispatch();
  const [expireSecond, setExpireSecond] = useState("");

  const validExpireSecond = useCallback(
    () => expireSecond && expireSecond > 0,
    [expireSecond]
  );
  const validRuleForm = useCallback(() => validExpireSecond(), [
    validExpireSecond,
  ]);
  const submitRuleForm = useCallback(() => {
    const data = {
      method,
      config: {
        expire_second: parseInt(expireSecond),
      },
    };
    if (forwardRule) {
      dispatch(editForwardRule(serverId, portId, data));
    } else {
      dispatch(createForwardRule(serverId, portId, data));
    }
  }, [dispatch, serverId, portId, method, forwardRule, expireSecond]);

  useEffect(() => {
    if (method === "iperf") {
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
      forwardRule.config.expire_second) {
      setExpireSecond(forwardRule.config.expire_second);
      }
      else setExpireSecond("");
  }, [forwardRule, setExpireSecond]);

  return (
    <>
      <Label className="mt-4 flex flex-row justify-start items-center">
        <span className="w-1/3">有效时间</span>
        <div className="w-2/3">
          <Input
            type="number"
            placeholder="单位为秒，iperf将在设定的时间后关闭"
            value={expireSecond}
            valid={validExpireSecond()}
            onChange={(e) => setExpireSecond(e.target.value)}
          />
        </div>
      </Label>
    </>
  );
};

export default IperfRuleEditor;
