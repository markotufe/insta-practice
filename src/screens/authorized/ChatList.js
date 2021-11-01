/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "@firebase/firestore";
import { db } from "../../firebase";
import { useSelector } from "react-redux";

const ChatList = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [chatRoomDocumentId, setChatRoomDocumentId] = useState("");
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const [receiver, setReceiver] = useState("");

  const userData = useSelector((state) => state.user.userData);

  //ovo je za get soba i poruka
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "users", userData?.documentId, "chats")),
      async (snapshot) => {
        let chatRooms = snapshot.docs.map((doc) => ({
          ...doc.data(),
          documentId: doc.id,
        }));

        chatRooms.sort(function (a, b) {
          return new Date(b.timestamp) - new Date(a.timestamp);
        });

        setChatRooms(chatRooms);
      }
    );
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (chatRoomDocumentId) {
      const unsubscribe = onSnapshot(
        query(
          collection(db, "chats", chatRoomDocumentId, "messages"),
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
  }, [chatRoomDocumentId]);

  const handleSend = async () => {
    await addDoc(collection(db, "chats", chatRoomDocumentId, "messages"), {
      text: message,
      timestamp: Date.now(),
      sentBy: userData?.userId,
      to: receiver?.userId,
    });
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-[300px] bg-white shadow-lg">
        <h1>lista osoba</h1>
        {chatRooms.map((room) => {
          return (
            <div
              key={room?.documentId}
              className="mt-4 cursor-pointer"
              onClick={() => {
                console.log(room);
                setChatRoomDocumentId(room?.chatId);
                setReceiver(room?.receiver);
              }}
            >
              <h1>
                {room?.sender?.userId === userData?.userId
                  ? room?.receiver?.fullName
                  : room?.sender?.fullName}
              </h1>
            </div>
          );
        })}
      </div>
      <div className="flex-1 px-5 chat-bg">
        {chat.map((message, index) => {
          return (
            <div
              key={index}
              className={
                message.sentBy === userData?.userId ? "text-right" : "text-left"
              }
            >
              {message?.text}
            </div>
          );
        })}
        <input
          placeholder="Enter message"
          className="mt-4 w-full py-4 pl-2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handleSend}>Send</button>
      </div>
      <div className="bg-white w-[350px]">profil osobe</div>
    </div>
  );
};

export default ChatList;
