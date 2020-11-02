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
import { LoadingIcon, TickIcon, ReportIcon } from "../icons";
import { getServerPorts } from "../redux/actions/ports";
import ForwardRuleEditor from "../components/ForwardRuleEditor";
import PageTitle from "../components/Typography/PageTitle";

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
  const permission = useSelector(state => state.auth.permission)
  const dispatch = useDispatch();
  const [ruleEditorOpen, setRuleEditorOpen] = useState(false);
  const [currentRule, setCurrentRule] = useState("");
  const [currentPort, setCurrentPort] = useState(0);

  useEffect(() => {
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
        portId={currentPort}
        isModalOpen={ruleEditorOpen}
        setIsModalOpen={setRuleEditorOpen}
      />
      <PageTitle>端口</PageTitle>
      <TableContainer>
        <Table>
          <TableHeader>
            <tr>
              <TableCell>端口号</TableCell>
              {permission === 'admin' ? <TableCell>内部端口号</TableCell> : null}
              <TableCell>转发规则</TableCell>
              <TableCell>转发状态</TableCell>
              <TableCell>动作</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {Object.keys(ports).map((port_id) => (
              <TableRow key={`servers_server_${server_id}_${port_id}`}>
                <TableCell>
                  <span className="text-sm">{ports[port_id].num}</span>
                </TableCell>
                {permission === 'admin' ? <TableCell>{ports[port_id].internal_num}</TableCell> : null}
                <TableCell>
                  <span className="text-sm">
                    {ports[port_id].forward_rule
                      ? ports[port_id].forward_rule.method === 'iptables'
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
                  <div className="flex flex-col flex-wrap md:flex-row md:items-end md:space-x-2">
                    {ports[port_id].forward_rule ? (
                      <>
                        <div>
                          <Button
                            size="small"
                            onClick={() => {
                              setCurrentRule(ports[port_id].forward_rule);
                              setCurrentPort(port_id);
                              setRuleEditorOpen(true);
                            }}
                            disabled={ports[port_id].forward_rule.status === 'starting' || ports[port_id].forward_rule.status === 'running'}
                          >
                            修改转发
                          </Button>
                        </div>
                      </>
                    ) : (
                      <Button
                        size="small"
                        onClick={() => {
                          setCurrentPort(port_id);
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
