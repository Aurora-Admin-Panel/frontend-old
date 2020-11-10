import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
} from "@windmill/react-ui";
import ReactLoading from "react-loading";

import { getServer } from "../redux/actions/servers";
import { PlusIcon, TickIcon, ReportIcon } from "../icons";
import { clearServerPorts, getServerPorts } from "../redux/actions/ports";
import AuthSelector from "../components/AuthSelector";
import PortEditor from "../components/PortEditor";
import PageTitle from "../components/Typography/PageTitle";
import ForwardRuleEditor from "../components/ForwardRuleEditor";

const statusToIcon = (rule) => {
  if (rule) {
    const status = rule.status;
    if (status === "running" || status === "starting") {
      return (
        <ReactLoading
          height={20}
          width={20}
          type="spinningBubbles"
          color="#000"
        />
      );
    } else {
      if (status === "successful") return <TickIcon />;
      else if (status === "failed") return <ReportIcon />;
    }
  } else return "🈚️ ";
};

function Server() {
  const server_id = parseInt(useParams().server_id);
  const servers = useSelector((state) => state.servers.servers);
  const ports = useSelector((state) => state.ports.ports);
  const permission = useSelector((state) => state.auth.permission);
  const dispatch = useDispatch();
  const [ruleEditorOpen, setRuleEditorOpen] = useState(false);
  const [currentRule, setCurrentRule] = useState("");
  const [currentPort, setCurrentPort] = useState("");
  const [portEditorOpen, setPortEditorOpen] = useState(false);

  useEffect(() => {
    dispatch(clearServerPorts());
    dispatch(getServerPorts(server_id));
    if (!(server_id in servers)) {
      dispatch(getServer(server_id));
    }
  }, []);

  return (
    <>
      <PageTitle>
        {servers[server_id].name}[{servers[server_id].address}]
      </PageTitle>

      <ForwardRuleEditor
        forwardRule={currentRule}
        serverId={server_id}
        port={currentPort}
        isModalOpen={ruleEditorOpen}
        setIsModalOpen={setRuleEditorOpen}
      />
      <AuthSelector permissions={["admin"]} >
      <PortEditor
        port={currentPort}
        serverId={server_id}
        isModalOpen={portEditorOpen}
        setIsModalOpen={setPortEditorOpen}
      />
      </AuthSelector>
      <div className="flex justify-between items-center">
        <PageTitle>端口</PageTitle>
        <AuthSelector permissions={["admin"]}>
          <Button
            size="regular"
            iconLeft={PlusIcon}
            onClick={() => {
              setCurrentPort("");
              setPortEditorOpen(true);
            }}
          >
            添加端口
          </Button>
        </AuthSelector>
      </div>
      <TableContainer>
        <Table>
          <TableHeader>
            <tr>
              <AuthSelector permissions={["admin"]}>
                <TableCell>外部端口号</TableCell>
              </AuthSelector>
              <TableCell>端口号</TableCell>
              <TableCell>转发规则</TableCell>
              <TableCell>转发状态</TableCell>
              <TableCell>动作</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {Object.keys(ports).map((port_id) => (
              <TableRow key={`servers_server_${server_id}_${port_id}`}>
                <AuthSelector permissions={["admin"]}>
                  <TableCell>
                    {ports[port_id].external_num
                      ? ports[port_id].external_num
                      : ports[port_id].num}
                  </TableCell>
                </AuthSelector>

                <TableCell>
                  <AuthSelector permissions={["admin"]}>
                    {ports[port_id].num}
                  </AuthSelector>
                  <AuthSelector permissions={["user"]}>
                    {ports[port_id].external_num
                      ? ports[port_id].external_num
                      : ports[port_id].num}
                  </AuthSelector>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {ports[port_id].forward_rule
                      ? ports[port_id].forward_rule.method === "iptables"
                        ? `[${ports[port_id].forward_rule.config.type}] ${ports[port_id].forward_rule.config.remote_address}:${ports[port_id].forward_rule.config.remote_port}`
                        : ports[port_id].forward_rule.method
                      : "无"}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {statusToIcon(ports[port_id].forward_rule)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col flex-wrap md:flex-row md:items-end md:space-x-1 space-y-1">
                    <AuthSelector permissions={["admin"]}>
                    <Button
                        size="small"
                        onClick={() => {
                          setCurrentPort(ports[port_id]);
                          setPortEditorOpen(true);
                        }}
                      >
                        修改端口
                      </Button>
                    </AuthSelector>
                    {ports[port_id].forward_rule ? (
                      <>
                        <Button
                          size="small"
                          onClick={() => {
                            setCurrentRule(ports[port_id].forward_rule);
                            setCurrentPort(ports[port_id]);
                            setRuleEditorOpen(true);
                          }}
                          disabled={
                            ports[port_id].forward_rule.status === "starting" ||
                            ports[port_id].forward_rule.status === "running"
                          }
                        >
                          修改转发
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="small"
                        onClick={() => {
                          setCurrentRule(null);
                          setCurrentPort(ports[port_id]);
                          setRuleEditorOpen(true);
                        }}
                      >
                        添加转发
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default Server;
