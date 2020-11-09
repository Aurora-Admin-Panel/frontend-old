import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  Button,
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
} from "@windmill/react-ui";

import { getUsers } from "../redux/actions/users";
import PageTitle from "../components/Typography/PageTitle";
import { TickIcon, ReportIcon } from "../icons";

function Users() {
  const users = useSelector((state) => state.users.users);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsers());
  }, []);

  return (
    <>
      <PageTitle>Users</PageTitle>

      <TableContainer>
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Email</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Actions</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {Object.keys(users).map((user_id) => (
              <TableRow key={`users_user_${user_id}`}>
                <TableCell>
                  <span className="text-sm">{users[user_id].email}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {users[user_id].is_active ? <TickIcon /> : <ReportIcon />}
                  </span>
                </TableCell>
                <TableCell>
                  <div>
                    <Button
                      size="small"
                      tag={Link}
                      to={`/app/users/${user_id}`}
                      disabled
                    >
                      查看
                    </Button>
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

export default Users;
