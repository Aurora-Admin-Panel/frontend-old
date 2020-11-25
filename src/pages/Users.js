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
import { CheckCircle, WarningCircle, NumberZero, NumberOne, Plus } from "phosphor-react";

import { PlusIcon } from "../icons";
import { getUsers } from "../redux/actions/users";
import UserEditor from "../components/UserEditor";
import PageTitle from "../components/Typography/PageTitle";

const privilegeToIcon = (user) => {
  if (!user || !user.allowed_ports || user.allowed_ports.length === 0) return <NumberZero weight="bold" size={20} />
  else if (user.allowed_ports.length === 1) return <NumberOne weight="bold" size={20} />
  else return <span className="flex flex-row"><NumberOne weight="bold" size={20} /><Plus weight="bold" size={20} /></span>
}

const privilegeToBadge = (user, servers, ports) => {
  const components = [];
  // if (!user || !user.allowed_servers || user.allowed_servers.length === 0) {
  //   components.push(<Badge type="danger">0台服务器权限</Badge>)
  // } else {
  //   components.push(<Badge type="danger">{`${user.allowed_servers.length}台服务器权限`}</Badge>)
  //   components.push(<span>{user.allowed_servers.map(s => servers[s.server_id] && servers[s.server_id].name).join(',')}</span>)
  // }
  if (!user || !user.allowed_ports || user.allowed_ports.length === 0) {
    components.push(<Badge type="success">0个端口权限</Badge>)
  } else {
    components.push(<Badge type="success">{`${user.allowed_ports.length}个端口权限`}</Badge>)
    components.push(<span>{user.allowed_ports.map(p => ports[p.port_id]&& ports[p.port_id].num).join(',')}</span>)
  }
  return (
    <>
    {components.map(c => c)}
    </>
  )
}

function Users() {
  const users = useSelector((state) => state.users.users);
  const servers = useSelector((state) => state.servers.servers);
  const ports = useSelector((state) => state.ports.ports);
  const [currentUser, setCurrentUser] = useState("");
  const [isUserEditorOpen, setIsUserEditorOpen] = useState(false);
  const [showPrivilege, setShowPrivilege] = useState({});
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  return (
    <>
      <div className="flex justify-between items-center">
        <PageTitle>Users</PageTitle>
        <Button
          size="regular"
          iconLeft={PlusIcon}
          onClick={() => setIsUserEditorOpen(true)}
        >
          添加
        </Button>
      </div>

      <UserEditor
        user={currentUser}
        isModalOpen={isUserEditorOpen}
        setIsModalOpen={setIsUserEditorOpen}
      />

      <TableContainer>
        <Table>
          <TableHeader>
            <tr>
              <TableCell>邮箱</TableCell>
              <TableCell>活跃</TableCell>
              <TableCell>权限</TableCell>
              <TableCell>备注</TableCell>
              <TableCell>动作</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {Object.keys(users).map(
              (user_id) =>
                users[user_id] && (
                  <TableRow key={`users_user_${user_id}`}>
                    <TableCell>
                      <span className="text-sm">{users[user_id].email}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {users[user_id].is_active ? (
                          <CheckCircle weight="bold" size={20} />
                        ) : (
                          <WarningCircle weight="bold" size={20} />
                        )}
                      </span>
                    </TableCell>
                    <TableCell>
                    <div className="relative z-20 inline-flex items-center">
                        <div
                          onMouseEnter={() => setShowPrivilege({ [user_id]: true })}
                          onMouseLeave={() => setShowPrivilege({ [user_id]: false })}
                        >
                          {privilegeToIcon(users[user_id])}
                        </div>
                        {showPrivilege[user_id] ? (
                          <div className="relative">
                            <div className="absolute flex flex-col justify-start items-center top-0 z-30 w-auto p-2 -mt-1 text-sm leading-tight text-black transform -translate-x-1/2 -translate-y-full bg-white rounded-lg shadow-lg">
                              {privilegeToBadge(users[user_id], servers, ports)}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell>
                      {users[user_id].notes
                        ? users[user_id].notes.length >= 5
                          ? `${users[user_id].notes.slice(0, 5)}...`
                          : users[user_id].notes
                        : "无"}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-row space-x-1">
                        <Button
                          size="small"
                          onClick={() => history.push(`/app/users/${user_id}`)}
                        >
                          查看
                        </Button>
                        <Button
                          size="small"
                          onClick={() => {
                            setCurrentUser(users[user_id]);
                            setIsUserEditorOpen(true);
                          }}
                        >
                          编辑
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default Users;
