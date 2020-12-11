import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Input,
  Label,
  Select,
  Modal,
  ModalBody,
  ModalFooter,
  Button,
} from "@windmill/react-ui";

import { deleteForwardRule } from "../redux/actions/ports";
import GostRuleEditor from "../components/RuleEditors/GostRuleEditor";
import IptablesRuleEditor from "../components/RuleEditors/IptablesRuleEditor";
// import V2rayRuleEditor from "../components/RuleEditors/V2rayRuleEditor";
import BrookRuleEditor from "../components/RuleEditors/BrookRuleEditor";
import SocatRuleEditor from "../components/RuleEditors/SocatRuleEditor";
import NodeExporterRuleEditor from "../components/RuleEditors/NodeExporterRuleEditor";

const MethodOptions = [
  { label: "iptables", value: "iptables" },
  { label: "gost", value: "gost" },
  { label: "brook", value: "brook" },
  { label: "socat", value: "socat" },
  { label: "node_exporter", value: "node_exporter" },
  // { label: "v2ray", value: "v2ray" },
];

const ForwardRuleEditor = ({
  forwardRule,
  serverId,
  port,
  isModalOpen,
  setIsModalOpen,
}) => {
  const dispatch = useDispatch();
  const [method, setMethod] = useState("iptables");
  const [validRuleForm, setValidRuleForm] = useState(() => () => false);
  const [submitRuleForm, setSubmitRuleForm] = useState(() => () => {});
  const [isDelete, setIsDelete] = useState(false);

  const validForm = () => isDelete || validRuleForm();
  const submitForm = () => {
    if (isDelete) {
      dispatch(deleteForwardRule(serverId, port.id));
    } else {
      submitRuleForm();
    }
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (isModalOpen) {
      setIsDelete(false);
      if (forwardRule) {
        setMethod(forwardRule.method);
      } else {
        setMethod("v2ray");
      }
    }
  }, [isModalOpen, forwardRule]);

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="-mt-6 mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
          <div className="mt-1 flex flex-row justify-start items-center">
            <span className="w-auto">端口功能</span>
            <div className="w-1/3 ml-3">
              <Select
                className="mt-1 w-1/2"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
              >
                {MethodOptions.map((option) => (
                  <option
                    value={option.value}
                    key={`forward_rule_method_${option.value}`}
                  >
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>
        <ModalBody>
          <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
            {method === "iptables" ? (
              <IptablesRuleEditor
                serverId={serverId}
                portId={port.id}
                isModalOpen={isModalOpen}
                method={method}
                forwardRule={forwardRule}
                setValidRuleForm={setValidRuleForm}
                setSubmitRuleForm={setSubmitRuleForm}
              />
            ) : null}

            {method === "gost" ? (
              <GostRuleEditor
                serverId={serverId}
                port={port}
                isModalOpen={isModalOpen}
                method={method}
                forwardRule={forwardRule}
                setValidRuleForm={setValidRuleForm}
                setSubmitRuleForm={setSubmitRuleForm}
              />
            ) : null}

            {/* {method === "v2ray" ? (
              <V2rayRuleEditor
                serverId={serverId}
                port={port}
                isModalOpen={isModalOpen}
                method={method}
                forwardRule={forwardRule}
                setValidRuleForm={setValidRuleForm}
                setSubmitRuleForm={setSubmitRuleForm}
              />
            ) : null} */}

            {method === "brook" ? (
              <BrookRuleEditor
                serverId={serverId}
                port={port}
                isModalOpen={isModalOpen}
                method={method}
                forwardRule={forwardRule}
                setValidRuleForm={setValidRuleForm}
                setSubmitRuleForm={setSubmitRuleForm}
              />
            ) : null}

            {method === "socat" ? (
              <SocatRuleEditor
                serverId={serverId}
                portId={port.id}
                isModalOpen={isModalOpen}
                method={method}
                forwardRule={forwardRule}
                setValidRuleForm={setValidRuleForm}
                setSubmitRuleForm={setSubmitRuleForm}
              />
            ) : null}

            {method === "node_exporter" ? (
              <NodeExporterRuleEditor
                serverId={serverId}
                portId={port.id}
                isModalOpen={isModalOpen}
                method={method}
                forwardRule={forwardRule}
                setValidRuleForm={setValidRuleForm}
                setSubmitRuleForm={setSubmitRuleForm}
              />
            ) : null}

            {forwardRule ? (
              <Label className="mt-6">
                <Input
                  type="checkbox"
                  checked={isDelete}
                  onChange={() => setIsDelete(!isDelete)}
                />
                <span className="ml-2">我要关闭此端口功能</span>
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
              {forwardRule ? "修改" : "添加"}
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ForwardRuleEditor;
