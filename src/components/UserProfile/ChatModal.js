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
  getDocs,
  onSnapshot,
  query,
  where,
} from "@firebase/firestore";

export const ChatModal = ({ displayName, userFromUrl }) => {
  const [message, setMessage] = useState("");
  const [isFirstMessageSentToUser, setIsMessageSentToUser] = useState(false);
  const [isFirstMessageSentFromUser, setIsMessageSentFromUser] =
    useState(false);
  const [receiverChatDocumentId, setReceiverChatDocumentId] = useState("");
  const [senderChatDocumentId, setSenderChatDocumentId] = useState("");
  const [myChatDocumentId, setMyChatDocumentId] = useState("");
  const dispatch = useDispatch();
  const isChatModalOpen = useSelector((state) => state.modal.isChatModalOpen);
  const userData = useSelector((state) => state.user.userData);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "users", userFromUrl?.documentId, "chats"),
        where("sentBy", "==", userData?.userId)
      ),
      (snapshot) => {
        if (snapshot.docs.length > 0) {
          console.log(snapshot.docs[0].id);
          setReceiverChatDocumentId(snapshot.docs[0].id);
          setIsMessageSentToUser(snapshot.docs.length > 0);
        }
      }
    );
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "users", userData?.documentId, "chats"),
        where("sentBy", "==", userFromUrl?.userId)
      ),
      (snapshot) => {
        if (snapshot.docs.length > 0) {
          console.log(snapshot.docs[0].id);
          setSenderChatDocumentId(snapshot.docs[0].id);
          setIsMessageSentFromUser(snapshot.docs.length > 0);
        }
      }
    );
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (isFirstMessageSentToUser) {
      const getMyChatDocumentId = async () => {
        const collectionRef = collection(
          db,
          "users",
          userData?.documentId,
          "chats"
        );
        const q = query(collectionRef, where("sentBy", "==", userData?.userId));
        const snapshot = await getDocs(q);

        if (snapshot.docs.length > 0) {
          setMyChatDocumentId(snapshot.docs[0].id);
        }
      };

      getMyChatDocumentId();
    } else {
      const getMyChatDocumentId = async () => {
        const collectionRef = collection(
          db,
          "users",
          userData?.documentId,
          "chats"
        );
        const q = query(
          collectionRef,
          where("sentBy", "==", userFromUrl?.userId)
        );
        const snapshot = await getDocs(q);

        if (snapshot.docs.length > 0) {
          console.log(snapshot.docs[0].id);
          setMyChatDocumentId(snapshot.docs[0].id);
        }
      };
      const getSenderChatDocumentId = async () => {
        const collectionRef = collection(
          db,
          "users",
          userFromUrl?.documentId,
          "chats"
        );
        const q = query(
          collectionRef,
          where("sentBy", "==", userFromUrl?.userId)
        );
        const snapshot = await getDocs(q);

        if (snapshot.docs.length > 0) {
          console.log(snapshot.docs[0].id);
          setSenderChatDocumentId(snapshot.docs[0].id);
        }
      };
      getSenderChatDocumentId();
      getMyChatDocumentId();
    }
  }, [isFirstMessageSentToUser]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!isFirstMessageSentToUser && !isFirstMessageSentFromUser) {
      console.log("prvo");
      try {
        const chatRomRefActiveUser = await addDoc(
          collection(db, "users", userData?.documentId, "chats"),
          {
            sentBy: userData?.userId,
            sender: { ...userData },
            receiver: { ...userFromUrl },
            timestamp: Date.now(),
          }
        );

        const chatRomRefActiveUserFromUrl = await addDoc(
          collection(db, "users", userFromUrl?.documentId, "chats"),
          {
            sentBy: userData?.userId,
            sender: { ...userData },
            receiver: { ...userFromUrl },
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
    } else if (isFirstMessageSentToUser && !isFirstMessageSentFromUser) {
      console.log("drugo");
      try {
        await addDoc(
          collection(
            db,
            "users",
            userData?.documentId,
            "chats",
            myChatDocumentId,
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
            receiverChatDocumentId,
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
    } else {
      console.log("trece");
      console.log(myChatDocumentId);
      console.log(senderChatDocumentId);
      try {
        await addDoc(
          collection(
            db,
            "users",
            userData?.documentId,
            "chats",
            myChatDocumentId,
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
            senderChatDocumentId,
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
    }
  };

  console.log("to", isFirstMessageSentToUser);
  console.log("from", isFirstMessageSentFromUser);

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
