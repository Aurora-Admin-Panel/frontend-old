import React, { useState, useEffect } from "react";
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
import { DotsNine } from "phosphor-react"

import { getReadableSize } from "../utils/formatter";
import { getServer, getServerUsers } from "../redux/actions/servers";
import PageTitle from "../components/Typography/PageTitle";
import FullScreenLoading from "../components/FullScreenLoading";
import ServerPortUserAdd from "../components/Buttons/ServerPortUserAdd";
import ServerUserEditor from "../components/ServerUserEditor";
import { DateOptions } from "../utils/constants";

const ServerUsers = () => {
  const server_id = parseInt(useParams().server_id);
  const server = useSelector((state) => state.servers.servers[server_id]);
  const [currentServerUser, setCurrentServerUser] = useState("");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();

  const [isAdding, setIsAdding] = useState(false);
  // const [newEmail, setNewEmail] = useState("");
  // const [newPassword, setNewPassword] = useState("");
  // const [isActive, setIsActive] = useState(true);
  // const validNewPassword = () => !newPassword || newPassword.length > 5;
  // const validNewEmail = () => newEmail.length > 0 && newEmail.includes("@");
  // const submitPasswordForm = () => {
  //   dispatch(editUser(user_id, { password: newPassword, email: newEmail }))
  // }
  useEffect(() => {
    if (!server) dispatch(getServer(server_id));
  }, [server, dispatch, server_id]);
  useEffect(() => {
    dispatch(getServerUsers(server_id));
  }, [server_id, dispatch]);

  if (!server) return <FullScreenLoading />;
  return (
    <>
      <ServerUserEditor
        serverUser={currentServerUser}
        isModalOpen={isEditorOpen}
        setIsModalOpen={setIsEditorOpen}
      />

      <PageTitle>
        <div className="flex flex-row justify-start space-x-2">
        <span>{server.name}[{server.address}]</span>
        <Button
        iconLeft={DotsNine}
                    size="small"
                    layout="outline"
                    onClick={(e) => history.push(`/app/servers/${server_id}`)}
                  >
                  </Button>
        </div>
      </PageTitle>


      <div className="flex flex-row justify-between items-center">
        <PageTitle>用户详情</PageTitle>
        <ServerPortUserAdd
          serverId={server_id}
          addingType="server"
          allowedUsers={server.allowed_users}
          isAdding={isAdding}
          setIsAdding={setIsAdding}
        />
      </div>
      <TableContainer>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>邮件</TableCell>
              <TableCell>用量</TableCell>
              <TableCell>到期时间</TableCell>
              <TableCell>动作</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {server.allowed_users.map((user) => (
              <TableRow key={`server_user_table_${user.user_id}`}>
                <TableCell>{user.user.email}</TableCell>
                <TableCell>
                  <span>
                    已使用{getReadableSize(user.download + user.upload)}
                    {user.config.quota
                      ? ` / ${getReadableSize(user.config.quota)}`
                      : ""}
                  </span>
                </TableCell>
                <TableCell>
                  {user.config.valid_until
                    ? new Date(user.config.valid_until).toLocaleString(
                        "zh-CN",
                        DateOptions
                      )
                    : "无"}
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentServerUser(user);
                      setIsEditorOpen(true);
                    }}
                  >
                    限制
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ServerUsers;
