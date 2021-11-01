/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsChatModalOpen } from "../../redux/slices/modalSlice";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";

import { db } from "../../firebase";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  where,
} from "@firebase/firestore";

export const ChatModal = ({ displayName, userFromUrl }) => {
  const [message, setMessage] = useState("");
  const [chatId, setChatId] = useState("");

  const dispatch = useDispatch();
  const isChatModalOpen = useSelector((state) => state.modal.isChatModalOpen);
  const userData = useSelector((state) => state.user.userData);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "chats"), where("to", "==", userFromUrl?.userId)),
      (snapshot) => {
        if (snapshot.docs.length > 0) {
          setChatId(snapshot.docs[0].id);
        }
      }
    );
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "chats"),
        where("sentBy", "==", userFromUrl?.userId)
      ),
      (snapshot) => {
        if (snapshot.docs.length > 0) {
          setChatId(snapshot.docs[0].id);
        }
      }
    );
    return unsubscribe;
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (chatId) {
      await addDoc(collection(db, "chats", chatId, "messages"), {
        text: message,
        timestamp: Date.now(),
        sentBy: userData?.userId,
        to: userFromUrl?.userId,
      });
      dispatch(setIsChatModalOpen(false));
    } else {
      try {
        const chatRef = await addDoc(collection(db, "chats"), {
          sentBy: userData?.userId,
          to: userFromUrl?.userId,
          sender: { ...userData },
          receiver: { ...userFromUrl },
          timestamp: Date.now(),
        });

        await addDoc(collection(db, "chats", chatRef?.id, "messages"), {
          text: message,
          timestamp: Date.now(),
          sentBy: userData?.userId,
          to: userFromUrl?.userId,
        });

        await addDoc(collection(db, "users", userData?.documentId, "chats"), {
          sender: { ...userData },
          receiver: { ...userFromUrl },
          chatId: chatRef?.id,
        });

        await addDoc(
          collection(db, "users", userFromUrl?.documentId, "chats"),
          {
            sender: { ...userData },
            receiver: { ...userFromUrl },
            chatId: chatRef?.id,
          }
        );

        dispatch(setIsChatModalOpen(false));
      } catch (error) {
        console.log(error);
      }
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
