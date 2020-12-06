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
import ReactLoading from "react-loading";
import { CheckCircle, WarningCircle } from "phosphor-react";

import { PlusIcon } from "../icons";
import ServerEditor from "../components/ServerEditor";
import PageTitle from "../components/Typography/PageTitle";
import Tooltip from "../components/Tooltip"
import { getServers, connectServer } from "../redux/actions/servers";
import { clearServerPorts } from "../redux/actions/ports";

const serverFactsToBadge = (system, permission) => {
  if (!system)
    return (
      <div className="">
        <Badge type="warning">SSH状态未知</Badge>
        {permission === "user" ? (
          <span>请通知管理员更新服务器状态</span>
        ) : (
          <span>请稍等片刻或重新编辑一次服务器以触发服务器状态更新</span>
        )}
      </div>
    );
  if (!system.os_family)
    return (
      <div className="">
        <Badge type="warning">SSH连接失败</Badge>
        {permission === "user" ? (
          <span>请通知管理员检查SSH连接信息</span>
        ) : (
        <span>{system.msg}</span>
        )}
      </div>
    );
  return (
    <div className="">
      <Badge type="success" className="w-auto">SSH连接成功</Badge>
      <span>{`${system.distribution} ${system.distribution_version} (${system.distribution_release}) ${system.architecture}`}</span>
    </div>
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
                  <Tooltip
                    tip={serverFactsToBadge(
                      servers[server_id].config.system,
                      permission
                    )}
                    >
                    <Button
                      size="smaill"
                      layout="link"
                      onClick={e => {e.preventDefault();dispatch(connectServer(server_id, {}))}}
                    >
                      {servers[server_id].config.system ? (
                        !servers[server_id].config.system
                          .os_family ? (
                          
                          <WarningCircle weight="bold" size={20} />
                        ) : (
                          <CheckCircle weight="bold" size={20} />
                        )
                      ) : (
                        <ReactLoading
                          height={20}
                          width={20}
                          type="spinningBubbles"
                          color="#000"
                        />
                      )}
                      </Button>

                    </Tooltip>
                </TableCell>
                <TableCell>
                  <div className="flex justify-start space-x-1">
                    <Button
                      size="small"
                      onClick={() => {
                        dispatch(clearServerPorts());
                        history.push(`/app/servers/${server_id}`);
                      }}
                    >
                      查看端口
                    </Button>
                    {permission === "admin" ? (
                      <>
                        <Button
                          size="small"
                          onClick={() =>
                            history.push(`/app/servers/${server_id}/users`)
                          }
                        >
                          查看用户
                        </Button>
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
