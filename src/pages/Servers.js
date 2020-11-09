import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from 'react-router-dom'
import {
  Button,
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
} from "@windmill/react-ui";

import { getServers } from "../redux/actions/servers";
import PageTitle from "../components/Typography/PageTitle";

function Servers() {
  const servers = useSelector((state) => state.servers.servers);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getServers());
  }, []);

  return (
    <>
      <PageTitle>Servers</PageTitle>

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
                  <div>
                    <Button size="small" tag={Link} to={`/app/servers/${server_id}`}>查看</Button>
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
