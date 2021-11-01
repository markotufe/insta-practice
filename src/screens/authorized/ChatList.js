/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "@firebase/firestore";
import { db } from "../../firebase";
import { useSelector } from "react-redux";

const ChatList = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [chatRoomDocumentId, setChatRoomDocumentId] = useState("");
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const [receiver, setReceiver] = useState("");
  const [sender, setSender] = useState("");
  const [myChatRoomIdInProfile, setMyChatRoomIdInProfile] = useState("");
  const [receiverChatRoomId, setReceiverChatRoomId] = useState("");
  const [senderChatRoomId, setSenderChatRoomId] = useState("");

  const userData = useSelector((state) => state.user.userData);

  //ovo je za get soba i poruka
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "users", userData?.documentId, "chats"),
        orderBy("timestamp", "desc")
      ),
      async (snapshot) => {
        let chatRooms = snapshot.docs.map((doc) => ({
          ...doc.data(),
          documentId: doc.id,
        }));

        setChatRooms(chatRooms);
      }
    );
    return unsubscribe;
  }, []);

  //ovo je za get soba i poruka
  useEffect(() => {
    if (receiver) {
      const unsubscribe = onSnapshot(
        query(
          collection(db, "users", receiver?.documentId, "chats"),
          where("chatId", "==", chatRoomDocumentId)
        ),
        async (snapshot) => {
          let chatRooms = snapshot.docs.map((doc) => ({
            ...doc.data(),
            documentId: doc.id,
          }));

          setReceiverChatRoomId(chatRooms[0]?.documentId);
        }
      );
      return unsubscribe;
    }
  }, [receiver]);

  useEffect(() => {
    if (sender) {
      const unsubscribe = onSnapshot(
        query(
          collection(db, "users", sender?.documentId, "chats"),
          where("chatId", "==", chatRoomDocumentId)
        ),
        async (snapshot) => {
          let chatRooms = snapshot.docs.map((doc) => ({
            ...doc.data(),
            documentId: doc.id,
          }));

          setSenderChatRoomId(chatRooms[0]?.documentId);
        }
      );
      return unsubscribe;
    }
  }, [receiver]);

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
    try {
      setMessage("");
      await addDoc(collection(db, "chats", chatRoomDocumentId, "messages"), {
        text: message,
        timestamp: Date.now(),
        sentBy: userData?.userId,
        to: receiver?.userId,
      });

      //moj chat document id
      await updateDoc(
        doc(db, "users", userData?.documentId, "chats", myChatRoomIdInProfile),
        {
          timestamp: Date.now(),
        }
      );

      //korisnikov chat dokument id
      await updateDoc(
        sender?.userId === userData?.userId
          ? doc(db, "users", receiver?.documentId, "chats", receiverChatRoomId)
          : doc(db, "users", sender?.documentId, "chats", senderChatRoomId),
        {
          timestamp: Date.now(),
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-[300px] bg-white shadow-lg">
        <h1>lista osoba</h1>
        {chatRooms.map((room) => {
          // console.log(room);
          return (
            <div
              key={room?.documentId}
              className="mt-4 cursor-pointer"
              onClick={() => {
                setChatRoomDocumentId(room?.chatId);
                setReceiver(room?.receiver);
                setSender(room?.sender);
                setMyChatRoomIdInProfile(room?.documentId);
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
