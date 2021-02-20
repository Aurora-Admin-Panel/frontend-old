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
  DotsNine,
  Users,
  ArrowUp,
  ArrowDown,
  SmileyXEyes,
} from "phosphor-react";

import {
  getCurrentUser,
  getUserServers,
  deleteUserServers,
} from "../redux/actions/users";
import Tooltip from '../components/Tooltip';
import MyLinkify from '../components/MyLinkify';
import PageTitle from "../components/Typography/PageTitle";
import SectionTitle from "../components/Typography/SectionTitle";
import FullScreenLoading from "../components/FullScreenLoading";
import UsageCell from "../components/TableCells/UsageCell";

const User = () => {
  const user_id = parseInt(useParams().user_id);
  const { user, loading: userLoading } = useSelector((state) => state.users.current);
  const { userServers, loading: userServersLoading } = useSelector((state) => state.users.userServers);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(getCurrentUser(user_id))
  }, [dispatch, user_id])
  useEffect(() => {
    dispatch(deleteUserServers());
    dispatch(getUserServers(user_id));
  }, [user_id, dispatch, user]);

  if (userLoading) return <FullScreenLoading />
  return (
    <>
      <div className="flex flex-col justify-start">
        <PageTitle>用户详情 [{user.email}]</PageTitle>
        {user.notes ? <span>备注： <MyLinkify>{user.notes}</MyLinkify></span> : null}
      </div>
      {!userServersLoading ? (
        userServers.length === 0 ? (
          <SectionTitle>用户没有权限访问任何服务器和端口</SectionTitle>
        ) : (
            userServers.map((userServer) => (
              <div className="mt-3 flex flex-col">
                <div className="flex flex-row justify-between mb-2">
                  <div className="flex flex-row space-x-2">
                    <span>
                      {userServer.server.name} [{userServer.server.address}]
                    </span>
                    <Tooltip tip="查看所有端口">
                      <Button
                        iconLeft={DotsNine}
                        size="small"
                        layout="outline"
                        onClick={(e) => history.push(`/app/servers/${userServer.server_id}/ports`)}
                      />
                    </Tooltip>
                    <Tooltip tip="查看所有用户">
                      <Button
                        iconLeft={Users}
                        size="small"
                        layout="outline"
                        onClick={() => history.push(`/app/servers/${userServer.server_id}/users`)}
                      />

                    </Tooltip>
                    <UsageCell usage={userServer} flexStyle={"row"} />
                  </div>
                  <div className="flex flex-row">
                    {/* <Button size="regular" iconLeft={ArrowsDownUp} onClick={() => {}}>
                  限制用量
                </Button> */}
                  </div>
                </div>
                <TableContainer key={`user_servers_${userServer.server_id}`}>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableCell>端口</TableCell>
                        <TableCell>用量</TableCell>
                        {/* <TableCell>动作</TableCell> */}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userServer.ports.map(
                        (userPort) => (
                          <TableRow>
                            <TableCell>{userPort.port.num}</TableCell>
                            <TableCell>
                              <div className="flex flex-col justify-center">
                                {userPort.port.usage ? (
                                  <>
                                    <span className="flex flex-auto items-center">
                                      <ArrowUp size={16} />
                                      {
                                        userPort.port.usage.readable_upload
                                      }
                                    </span>
                                    <span className="flex flex-auto items-center">
                                      <ArrowDown size={16} />
                                      {
                                        userPort.port.usage.readable_download
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
