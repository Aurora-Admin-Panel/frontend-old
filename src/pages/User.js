import React, { useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHeader,
  TableRow,
} from "@windmill/react-ui";
import {
  ArrowUp,
  ArrowDown,
  SmileyXEyes,
} from "phosphor-react";

import {
  getUser,
  getUserServers,
  deleteUserServers,
} from "../redux/actions/users";
import { getServer  } from "../redux/actions/servers";
import { getServerPort } from "../redux/actions/ports";
import PageTitle from "../components/Typography/PageTitle";
import SectionTitle from "../components/Typography/SectionTitle";
import FullScreenLoading from "../components/FullScreenLoading";
import UsageCell from "../components/TableCells/UsageCell";

const User = () => {
  const user_id = parseInt(useParams().user_id);
  const user = useSelector((state) => state.users.users[user_id]);
  const userServers = useSelector((state) => state.users.currentUserServers);
  const servers = useSelector((state) => state.servers.servers);
  const ports = useSelector((state) => state.ports.ports);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (!user) dispatch(getUser(user_id));
    dispatch(deleteUserServers());
    dispatch(getUserServers(user_id));
  }, [user_id, dispatch, user]);
  useEffect(() => {
    if (userServers) {
      userServers.forEach((server) => {
        if (!servers[server.server_id]) dispatch(getServer(server.server_id));
        server.ports.forEach((port) => {
          if (!ports[port.port_id])
            dispatch(getServerPort(server.server_id, port.port_id));
        });
      });
    }
  }, [userServers, dispatch, ports, servers]);

  if (!user) return <FullScreenLoading />;
  return (
    <>
      <div className="flex flex-col justify-start">
        <PageTitle>用户详情 [{user.email}]</PageTitle>
        {user.notes ? <span>备注：{user.notes}</span> : null}
      </div>
      {userServers ? (
        userServers.length === 0 ? (
          <SectionTitle>用户没有权限访问任何服务器和端口</SectionTitle>
        ) : (
          userServers.map((server) => servers[server.server_id] && (
            <div className="mt-3 flex flex-col">
              <div className="flex flex-row justify-between mb-2">
                <div className="flex flex-row space-x-2">
                <Button
                  layout="outline"
                  onClick={() =>
                    history.push(`/app/servers/${server.server_id}`)
                  }
                >
                  {servers[server.server_id].name} [
                  {servers[server.server_id].address}]
                </Button>
                <UsageCell usage={server} flexStyle={"row"} />
                </div>
                <div className="flex flex-row">
                {/* <Button size="regular" iconLeft={ArrowsDownUp} onClick={() => {}}>
                  限制用量
                </Button> */}
                </div>
              </div>
              <TableContainer key={`user_servers_${server.server_id}`}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableCell>端口</TableCell>
                      <TableCell>用量</TableCell>
                      {/* <TableCell>动作</TableCell> */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {server.ports.map(
                      (port) =>
                        ports[port.port_id] && (
                          <TableRow>
                            <TableCell>{ports[port.port_id].num}</TableCell>
                            <TableCell>
                              <div className="flex flex-col justify-center">
                                {ports[port.port_id].usage ? (
                                  <>
                                    <span className="flex flex-auto items-center">
                                      <ArrowUp size={16} />
                                      {
                                        ports[port.port_id].usage
                                          .readable_upload
                                      }
                                    </span>
                                    <span className="flex flex-auto items-center">
                                      <ArrowDown size={16} />
                                      {
                                        ports[port.port_id].usage
                                          .readable_download
                                      }
                                    </span>
                                  </>
                                ) : (
                                  <SmileyXEyes weight="bold" size={20} />
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          ))
        )
      ) : (
        <FullScreenLoading />
      )}
    </>
  );
};

export default User;
