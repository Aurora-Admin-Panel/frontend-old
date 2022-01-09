import React, {useCallback} from "react";

import {
  Button,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@windmill/react-ui";
import Modal from './Modal'

const ConfirmationModal = ({
  title = undefined,
  body = undefined,
  callback,
  isModalOpen,
  setIsModalOpen,
}) => {
  const submitForm = useCallback(() => {
    setIsModalOpen(false)
    return callback();
  }, [setIsModalOpen, callback])
  return (
    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      {title ? <ModalHeader>{title}</ModalHeader> : null}
      {body ? (
        <ModalBody>
          <div className="px-4 py-3 mb-8 bg-white rounded-lg dark:bg-gray-800">
            {body}
          </div>
        </ModalBody>
      ) : null}
      <ModalFooter>
        <div className="w-full flex flex-row justify-end space-x-2">
          <Button layout="outline" onClick={() => setIsModalOpen(false)}>
            取消
          </Button>
          <Button onClick={submitForm}>确认</Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default ConfirmationModal;
