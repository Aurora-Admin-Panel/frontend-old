import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import {
  Button,
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  HelperText,
} from "@windmill/react-ui";

import { editServerUser, deleteServerUser } from "../redux/actions/servers";
import { formatQuota } from "../utils/formatter";
import { QuotaOptions, DueActionOptions, DateOptions } from "../utils/constants";



const ServerUserEditor = ({ serverUser, isModalOpen, setIsModalOpen }) => {
  const dispatch = useDispatch();
  // const [egressLimit, setEgressLimit] = useState("");
  // const [egressLimitScalar, setEgressLimitScalar] = useState(1);
  // const [ingressLimit, setIngressLimit] = useState("");
  // const [ingressLimitScalar, setIngressLimitScalar] = useState(1);
  const [validUntilDate, setValidUntilDate] = useState("");
  const [dueAction, setDueAction] = useState(0);
  const [quota, setQuota] = useState("");
  const [quotaScalar, setQuotaScalar] = useState(1000000000);
  const [quotaAction, setQuotaAction] = useState(0);
  const [isDelete, setIsDelete] = useState(false);

  // const validEgress = () => !egressLimit || egressLimit > 0;
  // const validIngress = () => !ingressLimit || ingressLimit > 0;
  const validValidUntilDate = () =>
    !validUntilDate ||
    (!isNaN(new Date(validUntilDate)) && new Date(validUntilDate) > Date.now());

  const validForm = () => isDelete || validValidUntilDate();

  const submitForm = () => {
    if (isDelete) {
      dispatch(deleteServerUser(serverUser.server_id, serverUser.user_id));
    } else {
      const data = {
        config: {},
      };
      if (validUntilDate) data.config.valid_until = Date.parse(validUntilDate);
      if (dueAction) data.config.due_action = parseInt(dueAction);
      if (quota) data.config.quota = quota * quotaScalar;
      if (quotaAction) data.config.quota_action = parseInt(quotaAction);
      dispatch(editServerUser(serverUser.server_id, serverUser.user_id, data));
    }
    setIsModalOpen(false);
  };

  useEffect(() => {
    setIsDelete(false);
    if (serverUser.config && serverUser.config.valid_until) {
      setValidUntilDate(
        new Date(serverUser.config.valid_until).toLocaleString(
          "zh-CN",
          DateOptions
        )
      );
    } else setValidUntilDate("");
    if (serverUser.config && serverUser.config.due_action) {
      setDueAction(serverUser.config.due_action);
    } else setDueAction(0);

    if (serverUser.config) {
      formatQuota(serverUser.config.quota, setQuota, setQuotaScalar);
    }
    if (serverUser.config && serverUser.config.quota_action) {
      setQuotaAction(serverUser.config.quota_action);
    } else {
      setQuotaAction(0);
    }
  }, [isModalOpen, serverUser]);

  return (
    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <ModalHeader>限制服务器用户</ModalHeader>
      <ModalBody>
        <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
          {/* <Label className="mt-4">
            <div className="flex flex-row">
              <span className="w-1/2">限制出站流量</span>
              <span className="w-1/2">限制入站流量</span>
            </div>
            <div className="mt-1 flex flex-row items-center">
              <div className="flex w-1/4">
                <Input
                  placeholder={"空则不限制"}
                  value={egressLimit}
                  valid={validEgress()}
                  onChange={(e) => setEgressLimit(e.target.value)}
                />
              </div>
              <div className="flex w-1/4">
                <Select
                  value={egressLimitScalar}
                  onChange={(e) => setEgressLimitScalar(e.target.value)}
                >
                  {SpeedLimitOptions.map((option) => (
                    <option
                      value={option.value}
                      key={`egress_limit_options_${option.value}`}
                    >
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="flex w-1/4">
                <Input
                  placeholder={"空则不限制"}
                  value={ingressLimit}
                  valid={validIngress()}
                  onChange={(e) => setIngressLimit(e.target.value)}
                />
              </div>
              <div className="flex w-1/4">
                <Select
                  value={ingressLimitScalar}
                  onChange={(e) => setIngressLimitScalar(e.target.value)}
                >
                  {SpeedLimitOptions.map((option) => (
                    <option
                      value={option.value}
                      key={`ingress_limit_options_${option.value}`}
                    >
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </Label> */}
          <Label className="mt-4">
            <div className="flex flex-row">
              <span className="w-1/2">转发到期时间</span>
              <span className="w-1/2">到期时动作</span>
            </div>
            <div className="mt-1 flex flex-row items-center">
              <div className="flex w-1/2">
                <Input
                  placeholder={"空则不限制"}
                  value={validUntilDate}
                  valid={validValidUntilDate()}
                  onChange={(e) => {
                    setValidUntilDate(e.target.value);
                  }}
                />
              </div>
              <div className="flex w-1/2">
                <Select
                  value={dueAction}
                  onChange={(e) => setDueAction(e.target.value)}
                >
                  {DueActionOptions.map((option) => (
                    <option
                      value={option.value}
                      key={`due_action_options_${option.value}`}
                    >
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            {isNaN(Date.parse(validUntilDate)) ? null : (
              <div className="flex flex-row items-center">
                <HelperText>{`转发将在${new Date(validUntilDate).toLocaleString(
                  "zh-CN",
                  DateOptions
                )}到期`}</HelperText>
              </div>
            )}
          </Label>
          <Label className="mt-4">
            <div className="flex flex-row">
              <span className="w-1/2">限制流量</span>
              <span className="w-1/2">流量超限时动作</span>
            </div>
            <div className="mt-1 flex flex-row items-center">
              <div className="flex w-1/4">
                <Input
                  placeholder={"空则不限制"}
                  value={quota}
                  valid={validValidUntilDate()}
                  onChange={(e) => {
                    setQuota(e.target.value);
                  }}
                />
              </div>
              <div className="flex w-1/4">
                <Select
                  value={quotaScalar}
                  onChange={(e) => setQuotaScalar(e.target.value)}
                >
                  {QuotaOptions.map((option) => (
                    <option
                      value={option.value}
                      key={`quota_options_${option.value}`}
                    >
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="flex w-1/2">
                <Select
                  value={quotaAction}
                  onChange={(e) => setQuotaAction(e.target.value)}
                >
                  {DueActionOptions.map((option) => (
                    <option
                      value={option.value}
                      key={`quota_action_options_${option.value}`}
                    >
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </Label>

          <Label className="mt-6">
            <Input
              type="checkbox"
              checked={isDelete}
              onChange={() => setIsDelete(!isDelete)}
            />
            <span className="ml-2">我要取消用户对这台服务器的权限</span>
          </Label>
        </div>
      </ModalBody>
      <ModalFooter>
        <div className="w-full flex flex-row justify-end space-x-2">
          <Button layout="outline" onClick={() => setIsModalOpen(false)}>
            取消
          </Button>
          <Button onClick={submitForm} disabled={!validForm()}>
            确认
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default ServerUserEditor;
