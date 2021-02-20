import React, { useState, useEffect } from "react";
import { useParams, useHistory, useLocation, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Badge,
  Button,
  TableBody,
  TableContainer,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
} from "@windmill/react-ui";
import ReactLoading from "react-loading";
import {
  ArrowUp,
  ArrowDown,
  Circle,
  CheckCircle,
  WarningCircle,
  User,
  Users,
} from "phosphor-react";

import Table from "../components/Table"
import Tooltip from "../components/Tooltip"
import { PlusIcon, InfinityIcon } from "../icons";
import { getCurrentServer } from "../redux/actions/servers";
import { getServerPorts, getServerPortForwardRule } from "../redux/actions/ports";
import Pagination from "../components/Pagination";
import FullScreenLoading from "../components/FullScreenLoading";
import AuthSelector from "../components/AuthSelector";
import PortEditor from "../components/PortEditor";
import PortUserEditor from "../components/PortUserEditor";
import PageTitle from "../components/Typography/PageTitle";
import ForwardRuleEditor from "../components/ForwardRuleEditor";
import UsageCell from "../components/TableCells/UsageCell";
import Tooptip from "../components/Tooltip";

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
      if (status === "successful")
        return <CheckCircle weight="bold" size={20} />;
      else if (status === "failed")
        return <WarningCircle weight="bold" size={20} />;
    }
  } else return <Circle weight="bold" size={20} />;
};
const statusToBadge = (rule, server, port) => {
  const ret = [];
  if (rule) {
    const status = rule.status;
    if (status === "running" || status === "starting") {
      ret.push(<Badge type="warning">部署中</Badge>);
      ret.push(
        <Link
          className="text-blue-600"
          to={`/app/servers/${server.id}/${port.id}/artifacts`}
        >
          查看日志
        </Link>
      );
    } else {
      if (status === "successful") {
        ret.push(<Badge type="success">端口功能已部署</Badge>);
        if (rule.method === "iptables") {
          ret.push(
            <span>{`[${rule.config.type}] ${rule.config.remote_address}:${rule.config.remote_port}`}</span>
          );
        } else if (rule.method === "gost") {
          ret.push(
            `gost${rule.config.ServeNodes.map((n) => "\n-L " + n).join(
              ""
            )}${rule.config.ChainNodes.map((n) => "\n-F " + n).join("")}`
          );
        } else if (rule.method === "brook") {
          ret.push(`brook ${rule.config.command}`);
        } else if (rule.method === "tiny_port_mapper") {
          ret.push(
            `tinyPortMapper -l0.0.0.0:${port.external_num ? port.external_num : port.num
            } -r${rule.config.remote_address}:${rule.config.remote_port}`
          );
        } else if (rule.method === "node_exporter") {
          ret.push("node_exporter");
          ret.push(
            `请添加${server.address}:${port.external_num ? port.external_num : port.num
            }到promethus.yml中`
          );
        } else {
          ret.push(rule.method);
        }
      } else if (status === "failed") {
        ret.push(<Badge type="danger">端口功能部署失败</Badge>);
        ret.push(
          <Link
            className="text-blue-600"
            to={`/app/servers/${server.id}/${port.id}/artifacts`}
          >
            查看日志
          </Link>
        );
        if (rule.config && rule.config.error) {
          ret.push(`\n${rule.config.error}`);
        }
      }
    }
  }
  return (
    <>
      {ret.map((c, idx) => (
        <div key={`forward_status_badge_${idx}`}>{c}</div>
      ))}
    </>
  );
};

const usersToBadge = (history, users) => {
  if (users.length > 0) {
    return (
      <div className="flex flex-col">
        <Badge type="success">有{`${users.length}`}人正在使用此端口</Badge>
        {users.map((u) => (
          <button
            onClick={() => history.push(`/app/users/${u.user_id}`)}
            key={`server_users_badge_${u.user_id}`} 
            className="text-blue-500">
              {u.user.email}
          </button>
        ))}
      </div>
    );
  }
  return <Badge type="warning">此端口无人使用</Badge>;
};

const formatSpeed = (speed) => {
  speed = parseInt(speed, 10);
  if (speed % 1000000 === 0) {
    return speed / 1000000 + "Gb/s";
  } else if (speed % 1000 === 0) {
    return speed / 1000 + "Mb/s";
  } else {
    return speed + "kb/s";
  }
};

function ServerPorts() {
  const server_id = parseInt(useParams().server_id);
  const location = useLocation();
  const query = new URLSearchParams(location.search)
  const page = parseInt(query.get("page") || 1);
  const size = parseInt(query.get('size') || 10)

  const dispatch = useDispatch();
  const history = useHistory();

  const { server, loading: serverLoading } = useSelector((state) => state.servers.current);
  const { ports, loading: portsLoading } = useSelector((state) => state.ports.ports);
  const permission = useSelector((state) => state.auth.permission);

  const [ruleEditorOpen, setRuleEditorOpen] = useState(false);
  const [currentRule, setCurrentRule] = useState("");
  const [currentPort, setCurrentPort] = useState("");
  const [portEditorOpen, setPortEditorOpen] = useState(false);
  const [portUserEditorOpen, setPortUserEditorOpen] = useState(false);

  useEffect(() => {
    dispatch(getCurrentServer(server_id));
  }, [dispatch, server_id]);
  useEffect(() => {
      dispatch(getServerPorts(server_id, page, size));
      // eslint-disable-next-line
  }, [dispatch, server_id, location]);
  useEffect(() => {
    if (!portsLoading && ports) {
      ports.items.forEach(p => {
        if (p.forward_rule && (p.forward_rule.status === 'starting' || p.forward_rule.status === 'running')) {
          dispatch(getServerPortForwardRule(server_id, p.id))
        }
      })
    }
    // eslint-disable-next-line
  }, [dispatch, server_id, portsLoading])

  if (serverLoading) return <FullScreenLoading />;
  return (
    <>
      <PageTitle>
        <div className="flex flex-row justify-start space-x-2">
          <span>
            {server.name}[{server.address}]
          </span>
          <AuthSelector permissions={["admin", "ops"]}>
            <Button
              iconLeft={Users}
              size="small"
              layout="outline"
              onClick={() => history.push(`/app/servers/${server_id}/users`)}
            ></Button>
          </AuthSelector>
        </div>
      </PageTitle>

      <ForwardRuleEditor
        forwardRule={currentRule}
        serverId={server_id}
        port={currentPort}
        isModalOpen={ruleEditorOpen}
        setIsModalOpen={setRuleEditorOpen}
      />
      <PortEditor
        port={currentPort}
        serverId={server_id}
        isModalOpen={portEditorOpen}
        setIsModalOpen={setPortEditorOpen}
      />
      <AuthSelector permissions={["admin","ops"]}>
        <PortUserEditor
          portId={currentPort.id}
          serverId={server_id}
          isModalOpen={portUserEditorOpen}
          setIsModalOpen={setPortUserEditorOpen}
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
      {portsLoading ? <FullScreenLoading /> : (
        <TableContainer>
          <Table>
            <TableHeader>
              <tr>
                <TableCell>端口号</TableCell>
                <TableCell>备注</TableCell>
                <TableCell>功能</TableCell>
                <TableCell>限速</TableCell>
                <TableCell>流量</TableCell>
                <TableCell>用户</TableCell>
                <TableCell>动作</TableCell>
              </tr>
            </TableHeader>
            <TableBody>
              {ports && ports.items.map(
                (port) => (
                  <TableRow key={`servers_server_${server_id}_${port.id}`}>
                    <TableCell>
                      <div className="flex flex-row items-center">
                        {port.external_num ? port.external_num : port.num}
                        <AuthSelector permissions={["admin", "ops"]}>
                          {port.external_num ? (
                            <Tooptip
                              tip={
                                <span>
                                  <Badge>内部端口</Badge>
                                  {port.num}
                                </span>
                              }
                            >
                              <WarningCircle weight="bold" size={20} />
                            </Tooptip>
                          ) : null}
                        </AuthSelector>
                      </div>
                    </TableCell>
                    <TableCell>
                      {port.notes ? (
                        port.notes.length > 10 ? (
                          <Tooptip tip={port.notes}>
                            {`${port.notes.slice(0, 10)}...`}
                          </Tooptip>
                        ) : (port.notes)
                      ) : null}
                    </TableCell>
                    <TableCell>
                      <Tooptip
                        tip={statusToBadge(port.forward_rule, server, port)}
                      >
                        {statusToIcon(port.forward_rule)}
                      </Tooptip>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col justify-center">
                        {port.config &&
                          (port.config.egress_limit ||
                            port.ingress_limit) ? (
                            <>
                              {port.config.ingress_limit ? (
                                <span className="flex flex-auto items-center">
                                  <ArrowUp size={16} />
                                  {formatSpeed(
                                    port.config.ingress_limit
                                  )}
                                </span>
                              ) : null}
                              {port.config.egress_limit ? (
                                <span className="flex flex-auto items-center">
                                  <ArrowDown size={16} />
                                  {formatSpeed(
                                    port.config.egress_limit
                                  )}
                                </span>
                              ) : null}
                            </>
                          ) : (
                            <InfinityIcon weight="bold" size={24} />
                          )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <UsageCell usage={port.usage} />
                    </TableCell>
                    <TableCell>
                      <Tooltip tip={usersToBadge(history, port.allowed_users)} >
                          {port.allowed_users &&
                            port.allowed_users.length > 0 ? (
                              port.allowed_users.length > 1 ? (
                                <Users weight="bold" size={20} />
                              ) : (
                                  <User weight="bold" size={20} />
                                )
                            ) : (
                              <Circle weight="bold" size={20} />
                            )}

                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col flex-wrap lg:flex-row lg:items-end lg:space-x-1 space-y-1">
                        <AuthSelector permissions={["admin"]}>
                          <Button
                            size="small"
                            onClick={() => {
                              setCurrentPort(port);
                              setPortUserEditorOpen(true);
                            }}
                          >
                            查看用户
                          </Button>
                        </AuthSelector>
                        <Button
                          size="small"
                          onClick={() => {
                            setCurrentPort(port);
                            setPortEditorOpen(true);
                          }}
                        >
                          修改端口
                        </Button>
                        {port.forward_rule ? (
                          <>
                            <Button
                              size="small"
                              onClick={() => {
                                setCurrentRule(port.forward_rule);
                                setCurrentPort(port);
                                setRuleEditorOpen(true);
                              }}
                              disabled={
                                ((!port.forward_rule.count ||
                                  port.forward_rule.count <= 5) &&
                                  (port.forward_rule.status ===
                                    "starting" ||
                                    port.forward_rule.status ===
                                    "running")) ||
                                (port.forward_rule.method ===
                                  "caddy" &&
                                  permission === "user")
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
                                setCurrentPort(port);
                                setRuleEditorOpen(true);
                              }}
                            >
                              添加转发
                            </Button>
                          )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
          <TableFooter>
            {/* TODO: ResultPerPage */}
            <Pagination
              totalResults={parseInt(ports.total)}
              resultsPerPage={parseInt(ports.size)}
              currentPage={page}
              onChange={(p) => { p !== page && history.push(`/app/servers/${server_id}/ports?page=${p}&size=${size}`) }}
              label="Servers"
            />
          </TableFooter>
        </TableContainer>
      )}
      <div className="h-3" />
    </>
  );
}

export default ServerPorts;
