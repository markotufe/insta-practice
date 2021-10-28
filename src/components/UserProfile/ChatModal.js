import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsChatModalOpen } from "../../redux/slices/modalSlice";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";

import { db } from "../../firebase";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "@firebase/firestore";
import { getMessages } from "../../helpers/getMessages";

export const ChatModal = ({ displayName, userFromUrl }) => {
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const isChatModalOpen = useSelector((state) => state.modal.isChatModalOpen);
  const userData = useSelector((state) => state.user.userData);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "chatRooms"),
        where("activeUserId", "==", userData?.userId)
        // orderBy("timestamp", "desc")
      ),
      async (snapshot) => {
        const chatRooms = snapshot.docs.map((doc) => ({
          ...doc.data(),
          documentId: doc.id,
        }));

        const chatData = await Promise.all(
          chatRooms.map(async (chatRoomData) => {
            return {
              chatRoomData: chatRoomData,
              messages: await getMessages(chatRoomData),
            };
          })
        );

        console.log(chatData);
      }
    );
    return unsubscribe;
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    const chatRomRef = await addDoc(collection(db, "chatRooms"), {
      timestamp: serverTimestamp(),
      activeUserId: userData?.userId,
      receiverUserId: userFromUrl?.userId,
    });

    await addDoc(collection(db, "chatRooms", chatRomRef.id, "messages"), {
      text: message,
      timestamp: serverTimestamp(),
      activeUserId: userData?.userId,
      receiverUserId: userFromUrl?.userId,
    });

    await addDoc(
      collection(db, "chatRoomsAccessControl", chatRomRef?.id, "members"),
      {
        ...userData,
      }
    );

    await addDoc(
      collection(db, "chatRoomsAccessControl", chatRomRef?.id, "members"),
      {
        ...userFromUrl,
      }
    );
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
