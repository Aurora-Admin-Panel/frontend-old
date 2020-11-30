import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  Badge,
  Button,
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
} from "@windmill/react-ui";
import { Question, CheckCircle, WarningCircle } from "phosphor-react";

import { PlusIcon } from "../icons";
import AuthSelector from "../components/AuthSelector";
import ServerEditor from "../components/ServerEditor";
import { getServers } from "../redux/actions/servers";
import PageTitle from "../components/Typography/PageTitle";
import { clearServerPorts } from "../redux/actions/ports";

const serverFactsToBadge = (facts, permission) => {
  if (!facts)
    return (
      <>
        <Badge type="warning">SSH状态未知</Badge>
        {permission === "user" ? (
          <span>请通知管理员更新服务器状态</span>
        ) : (
          <span>请稍等片刻或重新编辑一次服务器以触发服务器状态更新</span>
        )}
      </>
    );
  if (!facts.ansible_distribution)
    return (
      <>
        <Badge type="warning">SSH连接失败</Badge>
        {permission === "user" ? (
          <span>请通知管理员检查SSH连接信息</span>
        ) : (
          <span>请检查SSH连接信息</span>
        )}
      </>
    );
  return (
    <>
      <Badge type="success">SSH连接成功</Badge>
      <span>{`${facts.ansible_distribution} ${facts.ansible_distribution_version} (${facts.ansible_distribution_release}) ${facts.ansible_architecture}`}</span>
    </>
  );
};

function Servers() {
  const [editorOpen, setEditorOpen] = useState(false);
  const [currentServer, setCurrentServer] = useState(null);
  const [showFacts, setShowFacts] = useState({});
  const servers = useSelector((state) => state.servers.servers);
  const permission = useSelector((state) => state.auth.permission);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(getServers());
  }, [dispatch]);

  return (
    <>
      <div className="flex justify-between items-center">
        <PageTitle>Servers</PageTitle>
        {permission === "admin" ? (
          <Button
            size="regular"
            iconLeft={PlusIcon}
            onClick={() => {
              setCurrentServer(null);
              setEditorOpen(true);
            }}
          >
            添加
          </Button>
        ) : null}
      </div>

      <ServerEditor
        server={currentServer}
        isModalOpen={editorOpen}
        setIsModalOpen={setEditorOpen}
      />

      <TableContainer>
        <Table>
          <TableHeader>
            <tr>
              <TableCell>名字</TableCell>
              <TableCell>地址</TableCell>
              <TableCell>SSH状态</TableCell>
              <TableCell>动作</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {Object.keys(servers).map((server_id) => (
              <TableRow key={`servers_server_${server_id}`}>
                <TableCell>
                  <span className="text-sm">{servers[server_id].name}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{servers[server_id].address}</span>
                </TableCell>
                <TableCell>
                  <div className="relative z-20 inline-flex">
                    <div
                      onMouseEnter={() => setShowFacts({ [server_id]: true })}
                      onMouseLeave={() => setShowFacts({ [server_id]: false })}
                    >
                      {servers[server_id].config.facts ? (
                        !servers[server_id].config.facts
                          .ansible_distribution ? (
                          <WarningCircle weight="bold" size={20} />
                        ) : (
                          <CheckCircle weight="bold" size={20} />
                        )
                      ) : (
                        <Question weight="bold" size={20} />
                      )}
                    </div>
                    {showFacts[server_id] ? (
                      <div className="relative">
                        <div className="absolute top-0 z-30 w-auto p-2 -mt-1 text-sm leading-tight text-black transform -translate-x-1/2 -translate-y-full bg-white rounded-lg shadow-lg">
                          {serverFactsToBadge(
                            servers[server_id].config.facts,
                            permission
                          )}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-start space-x-1">
                    <Button
                      size="small"
                      onClick={() => {dispatch(clearServerPorts());history.push(`/app/servers/${server_id}`)}}
                    >
                      查看
                    </Button>
                    {permission === "admin" ? (
                      <>
                        {/* <Button
                          size="small"
                          onClick={() =>
                            history.push(`/app/servers/${server_id}/users`)
                          }
                        >
                          查看用户
                        </Button> */}
                        <Button
                          size="small"
                          onClick={() => {
                            setCurrentServer(servers[server_id]);
                            setEditorOpen(true);
                          }}
                        >
                          编辑服务器
                        </Button>
                      </>
                    ) : null}
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

export default Servers;
