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
} from "@windmill/react-ui";

import {
  createServerPort,
  editServerPort,
  deleteServerPort,
} from "../redux/actions/ports";

const SpeedLimitOptions = [
  { label: "kbit/s", value: 1 },
  { label: "Mbit/s", value: 1000 },
  { label: "Gbit/s", value: 1000000 },
];

const formatSpeed = (speed, setSpeed, setScalar) => {
  speed = parseInt(speed, 10)
  if (speed % 1000000 === 0 ) {
    setSpeed(speed / 1000000);
    setScalar(1000000);
  } else if (speed % 1000 === 0) {
    setSpeed(speed / 1000);
    setScalar(1000);
  } else {
    setSpeed(speed)
    setScalar(1)
  }
}


const PortEditor = ({ port, serverId, isModalOpen, setIsModalOpen }) => {
  const dispatch = useDispatch();
  const [num, setNum] = useState(0);
  const [externalNum, setExternalNum] = useState("");
  const [egressLimit, setEgressLimit] = useState("");
  const [egressLimitScalar, setEgressLimitScalar] = useState(1);
  const [ingressLimit, setIngressLimit] = useState("");
  const [ingressLimitScalar, setIngressLimitScalar] = useState(1);
  const [isDelete, setIsDelete] = useState(false);

  const validNum = () => num > 0 && num < 65536;
  const validExternalNum = () =>
    !externalNum || (externalNum > 0 && externalNum < 65536);
  const validEgress = () => !egressLimit || egressLimit > 0;
  const validIngress = () => !ingressLimit || ingressLimit > 0;

  const validForm = () => isDelete || (validNum() && validExternalNum());

  const submitForm = () => {
    if (isDelete) {
      dispatch(deleteServerPort(serverId, port.id));
    } else {
      const data = {
        num,
        config: {}
      };
      if (externalNum) data.external_num = externalNum;
      if (egressLimit) data.config.egress_limit = egressLimit * egressLimitScalar;
      if (ingressLimit) data.config.ingress_limit = ingressLimit * ingressLimitScalar;

      if (port) {
        dispatch(editServerPort(serverId, port.id, data));
      } else {
        dispatch(createServerPort(serverId, data));
      }
    }
    setIsModalOpen(false);
  };

  useEffect(() => {
    console.log(port)
    setIsDelete(false);
    if (port) {
      setNum(port.num);
      if (port.external_num) setExternalNum(port.external_num);
      else setExternalNum("");
      if (port.config.egress_limit) {
        formatSpeed(port.config.egress_limit, setEgressLimit, setEgressLimitScalar);
      } else setEgressLimit("");
      if (port.config.ingress_limit) {
        formatSpeed(port.config.ingress_limit, setIngressLimit, setIngressLimitScalar)
      } else setIngressLimit("");
    } else {
      setNum(0);
      setExternalNum("");
      setEgressLimit("");
      setIngressLimit("");
      setEgressLimitScalar(1);
      setIngressLimitScalar(1);
    }
  }, [port]);

  return (
    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <ModalHeader>{port ? "修改" : "添加"}端口</ModalHeader>
      <ModalBody>
        <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <Label className="mt-4">
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
          <Label className="mt-4">
            <span>公网端口</span>
            <Input
              className="mt-1"
              placeholder={"可为空，如服务器为NAT则填写"}
              value={externalNum}
              valid={validExternalNum()}
              onChange={(e) => setExternalNum(e.target.value)}
            />
          </Label>
          <Label className="mt-4">
            <span>限制出站流量</span>
            <div className="flex flex-row">
            <Input
              className="mt-1 flex flex-auto"
              placeholder={"空则不限制"}
              value={egressLimit}
              valid={validEgress()}
              onChange={(e) => setEgressLimit(e.target.value)}
            />
            <Select
                className="mt-1 flex flex-2"
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
          </Label>
          <Label className="mt-4">
            <span>限制入站流量</span>
            <div className="flex flex-row">
            <Input
              className="mt-1 flex flex-auto"
              placeholder={"空则不限制"}
              value={ingressLimit}
              valid={validIngress()}
              onChange={(e) => setIngressLimit(e.target.value)}
            />
            <Select
                className="mt-1 flex flex-2"
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
          </Label>

          {port ? (
            <Label className="mt-6">
              <Input
                type="checkbox"
                checked={isDelete}
                onChange={() => setIsDelete(!isDelete)}
              />
              <span className="ml-2">我要删除这个端口</span>
            </Label>
          ) : null}
        </div>
      </ModalBody>
      <ModalFooter>
      <div className="w-full flex flex-row justify-end space-x-2">
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
