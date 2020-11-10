import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import {
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@windmill/react-ui";

import {
  createServerPort,
  editServerPort,
  deleteServerPort,
} from "../redux/actions/ports";

const PortEditor = ({ port, serverId, isModalOpen, setIsModalOpen }) => {
  const dispatch = useDispatch();
  const [num, setNum] = useState(0);
  const [externalNum, setExternalNum] = useState("");
  const [isDelete, setIsDelete] = useState(false);

  const validNum = () => num > 0 && num < 65536;
  const validExternalNum = () => !externalNum || (externalNum > 0 && externalNum < 65536);

  const validForm = () => isDelete || (validNum() && validExternalNum());

  const submitForm = () => {
    if (isDelete) {
      dispatch(deleteServerPort(serverId, port.id));
    } else {
      const data = {
        num,
      };
      if (externalNum) data.external_num = externalNum;

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
    console.log(port)
    if (port) {
      setNum(port.num);
      if (port.external_num) setExternalNum(port.external_num);
      else setExternalNum("");
    } else {
      setNum(0);
      setExternalNum("");
    }
  }, [port]);

  return (
    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <ModalHeader>{port ? "修改" : "添加"}端口</ModalHeader>
      <ModalBody>
        <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <Label className="mt-4">
            <span>端口</span>
            <Input
              className="mt-1"
              placeholder={"8000"}
              value={num}
              valid={validNum()}
              onChange={(e) => setNum(e.target.value)}
            />
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
        <div className="hidden sm:block">
          <Button layout="outline" onClick={() => setIsModalOpen(false)}>
            取消
          </Button>
        </div>
        <div className="hidden sm:block">
          <Button onClick={submitForm} disabled={!validForm()}>
            {port ? "修改" : "添加"}
          </Button>
        </div>
        <div className="block w-full sm:hidden">
          <Button
            block
            size="large"
            layout="outline"
            onClick={() => setIsModalOpen(false)}
          >
            取消
          </Button>
        </div>
        <div className="block w-full sm:hidden">
          <Button
            block
            size="large"
            onClick={submitForm}
            disabled={!validForm()}
          >
            {port ? "修改" : "添加"}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default PortEditor;
