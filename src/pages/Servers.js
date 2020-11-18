import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  Button,
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
} from "@windmill/react-ui";

import { PlusIcon } from "../icons";
import ServerEditor from "../components/ServerEditor";
import { getServers } from "../redux/actions/servers";
import PageTitle from "../components/Typography/PageTitle";

function Servers() {
  const [editorOpen, setEditorOpen] = useState(false);
  const [currentServer, setCurrentServer] = useState(null);
  const [adminEditOpen, setAdminEditOpen] = useState(false);
  const servers = useSelector((state) => state.servers.servers);
  const permission = useSelector((state) => state.auth.permission);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(getServers());
  }, []);

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
              <TableCell>Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Actions</TableCell>
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
                  <div className="flex justify-start space-x-1">
                    <Button
                      size="small"
                      onClick={() => history.push(`/app/servers/${server_id}`)}
                    >
                      查看
                    </Button>
                    {permission === "admin" ? (
                      <Button
                        size="small"
                        onClick={() => {
                          setCurrentServer(servers[server_id]);
                          setEditorOpen(true);
                        }}
                      >
                        编辑
                      </Button>
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
