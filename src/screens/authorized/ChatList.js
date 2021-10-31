import { useEffect, useState } from "react";

import { collection, onSnapshot, orderBy, query } from "@firebase/firestore";
import { db } from "../../firebase";
import { useSelector } from "react-redux";

const ChatList = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [chatRoomDocumentId, setChatRoomDocumentId] = useState("");
  const [chat, setChat] = useState([]);

  const userData = useSelector((state) => state.user.userData);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "users", userData?.documentId, "chats"),
        orderBy("timestamp", "desc")
      ),
      async (snapshot) => {
        const chatRooms = snapshot.docs.map((doc) => ({
          ...doc.data(),
          documentId: doc.id,
        }));

        setChatRooms(chatRooms);
      }
    );
    return unsubscribe;
  }, [userData?.documentId]);

  useEffect(() => {
    if (chatRoomDocumentId) {
      const unsubscribe = onSnapshot(
        query(
          collection(
            db,
            "users",
            userData?.documentId,
            "chats",
            chatRoomDocumentId,
            "messages"
          ),
          orderBy("timestamp", "asc")
        ),
        (snapshot) => {
          const results = snapshot.docs.map((doc) => ({
            ...doc.data(),
            documentId: doc.id,
          }));
          setChat(results);
        }
      );

      return unsubscribe;
    }
  }, [chatRoomDocumentId, chatRooms, userData?.documentId]);

  return (
    <div className="flex min-h-screen">
      <div className="w-[300px] bg-white shadow-lg">
        <h1>lista osoba</h1>
        {chatRooms.map((room) => {
          return (
            <div
              key={room?.documentId}
              className="mt-4 cursor-pointer"
              onClick={() => setChatRoomDocumentId(room?.documentId)}
            >
              <h1>
                {room?.activeUserData?.userId === userData?.userId
                  ? room?.receiverUserData?.fullName
                  : room?.activeUserData?.fullName}
              </h1>
            </div>
          );
        })}
      </div>
      <div className="flex-1 px-5 chat-bg">
        {chat.map((message, index) => {
          return (
            <div key={index}>
              {message?.text}{" "}
              {message.sentBy === userData?.userId
                ? "sent by me"
                : "sent by other"}{" "}
            </div>
          );
        })}
      </div>
      <div className="bg-white w-[350px]">profil osobe</div>
    </div>
  );
};

export default ChatList;
