import React, { useEffect, useState } from "react";
import { useDispatch  } from "react-redux";

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

import AuthSelector from "../components/AuthSelector"
import {
  createServerPort,
  editServerPort,
  deleteServerPort,
  editServerPortUsage,
} from "../redux/actions/ports";
import { formatSpeed, formatQuota } from "../utils/formatter";
import { SpeedLimitOptions, QuotaOptions, DueActionOptions, DateOptions } from "../utils/constants"


const PortEditor = ({ port, serverId, isModalOpen, setIsModalOpen }) => {
  const dispatch = useDispatch();
  const [num, setNum] = useState("");
  const [externalNum, setExternalNum] = useState("");
  const [notes, setNotes] = useState("");
  const [egressLimit, setEgressLimit] = useState("");
  const [egressLimitScalar, setEgressLimitScalar] = useState(1);
  const [ingressLimit, setIngressLimit] = useState("");
  const [ingressLimitScalar, setIngressLimitScalar] = useState(1);
  const [validUntilDate, setValidUntilDate] = useState("");
  const [dueAction, setDueAction] = useState(0);
  const [quota, setQuota] = useState("");
  const [quotaScalar, setQuotaScalar] = useState(1000000000);
  const [quotaAction, setQuotaAction] = useState(0);
  const [isDelete, setIsDelete] = useState(false);

  const validNum = () => num && num > 0 && num < 65536;
  const validExternalNum = () =>
    !externalNum || (externalNum > 0 && externalNum < 65536);
  const validEgress = () => !egressLimit || egressLimit > 0;
  const validIngress = () => !ingressLimit || ingressLimit > 0;
  const validValidUntilDate = () =>
    !validUntilDate ||
    (!isNaN(new Date(validUntilDate)) &&
      new Date(validUntilDate) > Date.now());

  const validForm = () =>
    isDelete || (validNum() && validExternalNum() && validValidUntilDate());

  const resetUsage = () => {
    const data = {
      port_id: port.id,
      download: 0,
      upload: 0,
      download_accumulate: 0,
      upload_accumulate: 0,
      download_checkpoint: 0,
      upload_checkpoint: 0,
    };
    dispatch(editServerPortUsage(serverId, port.id, data));
    setIsModalOpen(false);
  };
  const submitForm = () => {
    if (isDelete) {
      dispatch(deleteServerPort(serverId, port.id));
    } else {
      const data = {
        num,
        external_num: null,
        config: {
          egress_limit: null,
          ingress_limit: null,
          valid_until: null,
          due_action: 0,
          quota: null,
          quota_action: 0,
        },
      };
      if (externalNum) data.external_num = externalNum;
      data.notes = notes;
      if (egressLimit)
        data.config.egress_limit = egressLimit * egressLimitScalar;
      if (ingressLimit)
        data.config.ingress_limit = ingressLimit * ingressLimitScalar;
      if (validUntilDate) data.config.valid_until = Date.parse(validUntilDate);
      if (dueAction) data.config.due_action = parseInt(dueAction);
      if (quota) data.config.quota = quota * quotaScalar;
      if (quotaAction) data.config.quota_action = parseInt(quotaAction);

      if (port) {
        dispatch(editServerPort(serverId, port.id, data));
      } else {
        dispatch(createServerPort(serverId, data));
      }
    }
    setIsModalOpen(false);
  };

  useEffect(() => {
    setIsDelete(false);
    if (port) {
      setNum(port.num);
      if (port.external_num) setExternalNum(port.external_num);
      else setExternalNum("");
      if (port.notes) setNotes(port.notes);
      else setNotes("");
      if (port.config.egress_limit) {
        formatSpeed(
          port.config.egress_limit,
          setEgressLimit,
          setEgressLimitScalar
        );
      } else setEgressLimit("");
      if (port.config.ingress_limit) {
        formatSpeed(
          port.config.ingress_limit,
          setIngressLimit,
          setIngressLimitScalar
        );
      } else setIngressLimit("");
      if (port.config.valid_until) {
        setValidUntilDate(new Date(port.config.valid_until).toISOString());
      } else setValidUntilDate("");
      if (port.config.due_action) {
        setDueAction(port.config.due_action);
      } else setDueAction(0);

      formatQuota(port.config.quota, setQuota, setQuotaScalar);
      if (port.config.quota_action) {
        setQuotaAction(port.config.quota_action);
      } else {
        setQuotaAction(0);
      }
    } else {
      setNum("");
      setExternalNum("");
      setNotes("");
      setEgressLimit("");
      setIngressLimit("");
      setEgressLimitScalar(1);
      setIngressLimitScalar(1);
    }
  }, [isModalOpen, port]);

  return (
    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <ModalHeader>{port ? "修改" : "添加"}端口</ModalHeader>
      <ModalBody>
        <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <AuthSelector permissions={['admin']}>
          <Label className="mt-2">
            <span>端口</span>
            {port ? (
              <Input className="mt-1" value={num} disabled={true} />
            ) : (
              <Input
                className="mt-1"
                placeholder={"8000"}
                value={num}
                disabled={port}
                valid={!port && validNum()}
                onChange={(e) => setNum(e.target.value)}
              />
            )}
          </Label>
          <Label className="mt-1">
            <span>公网端口</span>
            <Input
              className="mt-1"
              placeholder={"可为空，如服务器为NAT则填写"}
              value={externalNum}
              valid={validExternalNum()}
              onChange={(e) => setExternalNum(e.target.value)}
            />
          </Label>
          <Label className="mt-1">
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
          </Label>
          <Label className="mt-1">
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
          <Label className="mt-1">
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
          </AuthSelector>
          <Label className="mt-1">
            <span>备注</span>
            <Input
            className="mt-1"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Label>

        <AuthSelector permissions={['admin']}>
          {port ? (
            <Label className="mt-4">
              <Input
                type="checkbox"
                checked={isDelete}
                onChange={() => setIsDelete(!isDelete)}
              />
              <span className="ml-2">我要删除这个端口</span>
            </Label>
          ) : null}

        </AuthSelector>
        </div>
      </ModalBody>
      <ModalFooter>
        <div className="w-full flex flex-row justify-end space-x-2">
          {port ? (
            <Button layout="outline" onClick={resetUsage}>
              重置流量
            </Button>
          ) : null}
          <Button layout="outline" onClick={() => setIsModalOpen(false)}>
            取消
          </Button>
          <Button onClick={submitForm} disabled={!validForm()}>
            {port ? "修改" : "添加"}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default PortEditor;
