import React from "react";
import Modal from "react-modal";

const BasicModal = ({ message, isOpen }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={isOpen === false}
      contentLabel="Login/Signup Modal"
      className="absolute w-full h-full flex justify-center items-center"
      overlayClassName="fixed inset-0 bg-[#b5b5b5]/75 block pointer-events-auto"
      shouldCloseOnOverlayClick={true}
    >
      <div className="relative w-fit p-10 bg-white rounded-md">
        <button
          onClick={() => window.location.reload()}
          className="absolute top-2 right-2"
        >
          <img src="/icons/Close.svg" alt="" />
        </button>
        <span>{message}</span>
      </div>
    </Modal>
  );
};

export default BasicModal;
