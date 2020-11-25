import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHeader,
  TableRow,
} from "@windmill/react-ui";

import {
  getServer,
  getServerUsers,
} from "../redux/actions/servers";
import PageTitle from "../components/Typography/PageTitle";
import FullScreenLoading from "../components/FullScreenLoading";
import ServerPortUserAdd from "../components/Buttons/ServerPortUserAdd";

const ServerUsers = () => {
  const server_id = parseInt(useParams().server_id);
  const server = useSelector((state) => state.servers.servers[server_id]);
  const dispatch = useDispatch();

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
    dispatch(getServerUsers(server_id));
  }, [server_id, server, dispatch]);

  if (!server) return <FullScreenLoading />;
  return (
    <>
      <div className="flex flex-row justify-between items-center">
        <PageTitle>
          {server.name}[{server.address}] 用户详情
        </PageTitle>
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
              <TableCell>Email</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {server.allowed_users.map((user) => (
              <TableRow key={`server_user_table_${user.user_id}`} >
                <TableCell>{user.user.email}</TableCell>
                <TableCell>test</TableCell>
                <TableCell>test</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ServerUsers;
