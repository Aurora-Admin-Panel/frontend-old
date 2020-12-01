import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import {
  Input,
  Label,
} from "@windmill/react-ui";

import { PlusIcon, MinusIcon } from "../../icons";
import {
  createForwardRule,
  editForwardRule,
} from "../../redux/actions/ports";

const GostRuleEditor = ({
  serverId,
  portId,
  method,
  forwardRule,
  serveNodes,
  setServeNodes,
  chainNodes,
  setChainNodes,
  retries,
  setRetries,
  setValidRuleForm,
  setSubmitRuleForm,
}) => {
  const dispatch = useDispatch();
  const validServeNode = (n) => n.length > 0;
  const validChainNode = (n) => n.length > 0;
  const validRuleForm = () =>
    serveNodes.length > 0 &&
    serveNodes.every((n) => validServeNode(n)) &&
    chainNodes.every((n) => validChainNode(n));
  const submitRuleForm = () => {
    const data = {
      method,
      config: {
        Retries: retries,
        ServeNodes: serveNodes,
        ChainNodes: chainNodes,
      },
    };
    if (forwardRule) {
      dispatch(editForwardRule(serverId, portId, data));
    } else {
      dispatch(createForwardRule(serverId, portId, data));
    }
  };

  useEffect(() => {
    if (method === "gost") {
      setValidRuleForm(() => validRuleForm);
      setSubmitRuleForm(() => submitRuleForm);
    }
  }, [method, serveNodes, chainNodes]);

  useEffect(() => {
    if (forwardRule) {
      if (forwardRule.config.Retries) setRetries(forwardRule.config.Retries);
      else setRetries(0);
      if (forwardRule.config.ServeNodes)
        setServeNodes(forwardRule.config.ServeNodes);
      else setServeNodes([]);
      if (forwardRule.config.ChainNodes)
        setChainNodes(forwardRule.config.ChainNodes);
      else setChainNodes([]);
    } else {
      setRetries(0);
      setServeNodes([]);
      setChainNodes([]);
    }
  }, [forwardRule]);

  return (
    <>
      <Label className="mt-4 flex flex-row justify-between items-center">
        <div className="flex flex-auto">
          <span>重试次数</span>
        </div>
        <div className="flex flex-3 items-center">
          <button
            className="mr-3 h-5 w-5 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-500 border border-transparent rounded active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-red"
            onClick={(e) =>
              e.preventDefault() && retries > 0
                ? setRetries(retries - 1)
                : setRetries(0)
            }
          >
            <MinusIcon />
          </button>
          <span className="w-3 h-6 text-sm text-black dark:text-gray-300">
            {retries}
          </span>
          <button
            className="ml-3 h-5 w-5 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-green-400 border border-transparent rounded active:bg-green-600 hover:bg-green-700 focus:outline-none focus:shadow-outline-green"
            onClick={() =>
              retries < 5 ? setRetries(retries + 1) : setRetries(5)
            }
          >
            <PlusIcon />
          </button>
        </div>
      </Label>
      <Label className="mt-4 flex flex-row justify-between items-center">
        <span>本地服务配置(-L)</span>
        <button
          className="w-5 h-5 px-1 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-green-400 border border-transparent rounded active:bg-green-600 hover:bg-green-600 focus:outline-none focus:shadow-outline-green"
          onClick={() => setServeNodes(serveNodes.concat([""]))}
        >
          <PlusIcon />
        </button>
      </Label>
      {serveNodes.map((node, idx) => (
        <Label className="mt-4" key={`gost_serve_nodes_${idx}`}>
          <div className="relative text-gray-500 focus-within:text-purple-600 dark:focus-within:text-purple-400">
            <div className="absolute inset-y-0 flex items-center ml-3 pointer-events-none">
              {idx + 1}
            </div>
            <Input
              className="block w-full pl-8 pr-5 mt-1 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
              placeholder="tcp://:8888"
              value={node}
              valid={validServeNode(node)}
              onChange={(e) => {
                setServeNodes(
                  serveNodes.map((v, i) => (i === idx ? e.target.value : v))
                );
              }}
            />
            <button
              className="absolute inset-y-0 right-0 w-5 px-1 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-500 border border-transparent rounded-r active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-red"
              onClick={() =>
                setServeNodes(serveNodes.filter((_, i) => i !== idx))
              }
            >
              <MinusIcon />
            </button>
          </div>
        </Label>
      ))}
      <Label className="mt-4 flex flex-row justify-between items-center">
        <span>转发服务配置(-F)</span>
        <button
          className="w-5 h-5 px-1 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-green-400 border border-transparent rounded active:bg-green-600 hover:bg-green-600 focus:outline-none focus:shadow-outline-green"
          onClick={() => setChainNodes(chainNodes.concat([""]))}
        >
          <PlusIcon />
        </button>
      </Label>
      {chainNodes.map((node, idx) => (
        <Label className="mt-4" key={`gost_serve_nodes_${idx}`}>
          <div className="relative text-gray-500 focus-within:text-purple-600 dark:focus-within:text-purple-400">
            <div className="absolute inset-y-0 flex items-center ml-3 pointer-events-none">
              {idx + 1}
            </div>
            <Input
              className="block w-full pl-8 pr-5 mt-1 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
              placeholder="relay+tls://www.example.com:8888"
              value={node}
              valid={validChainNode(node)}
              onChange={(e) => {
                setChainNodes(
                  chainNodes.map((v, i) => (i === idx ? e.target.value : v))
                );
              }}
            />
            <button
              className="absolute inset-y-0 right-0 w-5 px-1 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-500 border border-transparent rounded-r active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-red"
              onClick={() =>
                setChainNodes(chainNodes.filter((_, i) => i !== idx))
              }
            >
              <MinusIcon />
            </button>
          </div>
        </Label>
      ))}
    </>
  );
};

export default GostRuleEditor;
