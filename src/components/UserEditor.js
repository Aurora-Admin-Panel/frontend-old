import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import {
  Button,
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
} from "@windmill/react-ui";

import { createUser, editUser } from "../redux/actions/users";

const UserEditor = ({ user, isModalOpen, setIsModalOpen }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notes, setNotes] = useState("");
  const [isActive, setIsActive] = useState(true);

  const validEmail = () => !email || email.includes("@");
  const validPassword = () => !password || password.length > 5;
  const validForm = () =>
    (user && email && validPassword()) ||
    (!user && email && password && validEmail() && validPassword());

  const submitForm = () => {
    const data = {
      email,
      is_active: isActive,
    };
    if (password) data.password = password;
    if (notes) data.notes = notes;
    if (user) {
      dispatch(editUser(user.id, data));
    } else {
      dispatch(createUser(data));
    }
    setIsModalOpen(false);
  };

  useEffect(() => {
    setPassword("");
    if (user) {
      setEmail(user.email);
      setIsActive(user.is_active);
      setNotes(user.notes);
    } else {
      setEmail("");
      setIsActive(true);
    }
  }, [isModalOpen, user]);

  return (
    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <ModalHeader>{user ? "修改" : "添加"}用户</ModalHeader>
      <ModalBody>
        <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <Label className="mt-4">
            <span>邮件</span>
            <Input
              className="mt-1"
              value={email}
              valid={validEmail()}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Label>
          <Label className="mt-4">
            <span>{user ? "重置" : ""}密码</span>
            <Input
              className="mt-1"
              value={password}
              valid={validPassword()}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Label>
          <Label className="mt-4">
            <span>备注</span>
            <Textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Label>


          {user ? (
            <Label className="mt-6">
              <Input
                type="checkbox"
                checked={!isActive}
                onChange={() => setIsActive(!isActive)}
              />
              <span className="ml-2">我要暂停这个用户(转发仍有效)</span>
            </Label>
          ) : null}
        </div>
      </ModalBody>
      <ModalFooter>
        <div className="w-full flex flex-row justify-end space-x-2">
          <Button layout="outline" onClick={() => setIsModalOpen(false)}>
            取消
          </Button>
          <Button onClick={submitForm} disabled={!validForm()}>
            {user ? "修改" : "添加"}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default UserEditor;
