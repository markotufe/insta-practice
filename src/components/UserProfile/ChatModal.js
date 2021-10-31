import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsChatModalOpen } from "../../redux/slices/modalSlice";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";

import { db } from "../../firebase";
import { addDoc, collection, doc, updateDoc } from "@firebase/firestore";

export const ChatModal = ({ displayName, userFromUrl }) => {
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const isChatModalOpen = useSelector((state) => state.modal.isChatModalOpen);
  const userData = useSelector((state) => state.user.userData);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    try {
      const chatRomRefActiveUser = await addDoc(
        collection(db, "users", userData?.documentId, "chats"),
        {
          activeUserData: {
            ...userData,
          },
          receiverUserData: {
            ...userFromUrl,
          },
          timestamp: Date.now(),
        }
      );

      const chatRomRefActiveUserFromUrl = await addDoc(
        collection(db, "users", userFromUrl?.documentId, "chats"),
        {
          activeUserData: {
            ...userData,
          },
          receiverUserData: {
            ...userFromUrl,
          },
          timestamp: Date.now(),
        }
      );

      await addDoc(
        collection(
          db,
          "users",
          userData?.documentId,
          "chats",
          chatRomRefActiveUser.id,
          "messages"
        ),
        {
          text: message,
          timestamp: Date.now(),
          sentBy: userData?.userId,
        }
      );

      await addDoc(
        collection(
          db,
          "users",
          userFromUrl?.documentId,
          "chats",
          chatRomRefActiveUserFromUrl.id,
          "messages"
        ),
        {
          text: message,
          timestamp: Date.now(),
          sentBy: userData?.userId,
        }
      );

      dispatch(setIsChatModalOpen(false));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      open={isChatModalOpen}
      onClose={() => {
        dispatch(setIsChatModalOpen(false));
      }}
      center
    >
      <div className="flex w-[350px] p-4">
        <div className="mt-7 w-full">
          <h1 className="text-lg">
            Chat with <span className="font-semibold">{displayName}</span>
          </h1>
          <form className="mt-5 w-full" onSubmit={handleSendMessage}>
            <textarea
              onChange={(e) => setMessage(e.target.value)}
              className="border rounded-sm w-full resize-none min-h-[120px]"
            ></textarea>
            <button
              type="submit"
              className="
              bg-blue-500
              hover:bg-blue-700
              text-white 
              font-bold
              py-2
              px-4 
              rounded
              ml-auto
              mt-3
              flex
              "
            >
              Send message
            </button>
          </form>
        </div>
      </div>
    </Modal>
  );
};
