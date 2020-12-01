import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Input,
  Label,
  Select,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@windmill/react-ui";

import {
  deleteForwardRule,
} from "../redux/actions/ports";
import GostRuleEditor from "../components/RuleEditors/GostRuleEditor";
import IptablesRuleEditor from "../components/RuleEditors/IptablesRuleEditor";

const MethodOptions = [
  { label: "iptables", value: "iptables" },
  { label: "gost", value: "gost" },
];

const ForwardRuleEditor = ({
  forwardRule,
  serverId,
  port,
  isModalOpen,
  setIsModalOpen,
}) => {
  const dispatch = useDispatch();
  const [type, setType] = useState("TCP");
  const [method, setMethod] = useState("iptables");
  const [remoteAddress, setRemoteAddress] = useState("");
  const [remotePort, setRemotePort] = useState(0);
  const [serveNodes, setServeNodes] = useState([]);
  const [chainNodes, setChainNodes] = useState([]);
  const [retries, setRetries] = useState(0);
  const [validRuleForm, setValidRuleForm] = useState(() => () => false);
  const [submitRuleForm, setSubmitRuleForm] = useState(() => () => {});
  const [isDelete, setIsDelete] = useState(false);

  const validForm = () => isDelete || validRuleForm()
  const submitForm = () => {
    if (isDelete) {
      dispatch(deleteForwardRule(serverId, port.id));
    } else {
      submitRuleForm();
    }
    setIsModalOpen(false);
  };

  useEffect(() => {
    setIsDelete(false);
    if (forwardRule) {
      setMethod(forwardRule.method);
    } else {
      setMethod("iptables")
    }
  }, [isModalOpen, forwardRule]);

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalHeader>
          <div className="mt-1 flex flex-row justify-between items-center">
          <span className="w-1/3">端口功能</span>
              <div className="w-2/3">
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
          </ModalHeader>
        <ModalBody>
          <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">

            {method === "iptables" ? (
              <IptablesRuleEditor
                serverId={serverId}
                portId={port.id}
                isModalOpen={isModalOpen}
                method={method}
                forwardRule={forwardRule}
                type={type}
                setType={setType}
                remoteAddress={remoteAddress}
                setRemoteAddress={setRemoteAddress}
                remotePort={remotePort}
                setRemotePort={setRemotePort}
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
              serveNodes={serveNodes}
              setServeNodes={setServeNodes}
              chainNodes={chainNodes}
              setChainNodes={setChainNodes}
              retries={retries}
              setRetries={setRetries}
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
                <span className="ml-2">我要删除这条转发规则</span>
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
