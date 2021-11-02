/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "@firebase/firestore";
import { db } from "../../firebase";
import { useSelector } from "react-redux";
import Loader from "react-loader-spinner";
import Chat from "../../components/Chat";
import ChatProfileData from "../../components/ChatProfileData";
import Moment from "react-moment";

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
  const [profileData, setProfileData] = useState("");
  const [loading, setLoading] = useState(true);
  const [lastMessage, setLastMessage] = useState([]);
  const [lastMessageDocumentId, setLastMessageDocumentId] = useState([]);

  const userData = useSelector((state) => state.user.userData);

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

        setChatRoomDocumentId(chatRooms[0]?.chatId);
        setProfileData(
          chatRooms[0]?.sender?.userId === userData?.userId
            ? chatRooms[0]?.receiver
            : chatRooms[0]?.sender
        );
        setMyChatRoomIdInProfile(chatRooms[0]?.documentId);
        setReceiver(chatRooms[0]?.receiver);
        setSender(chatRooms[0]?.sender);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

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
  }, [sender]);

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

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "lastMessage")),
      async (snapshot) => {
        if (snapshot.docs.length > 0) {
          let results = snapshot.docs.map((doc) => ({
            ...doc.data(),
            documentId: doc.id,
          }));
          setLastMessage(results);
        }
      }
    );
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (chatRoomDocumentId) {
      const unsubscribe = onSnapshot(
        query(
          collection(db, "lastMessage"),
          where("chatId", "==", chatRoomDocumentId)
        ),
        async (snapshot) => {
          if (snapshot.docs.length > 0) {
            let results = snapshot.docs.map((doc) => ({
              ...doc.data(),
              documentId: doc.id,
            }));

            setLastMessageDocumentId(results[0]?.documentId);
          }
        }
      );
      return unsubscribe;
    }
  }, [chatRoomDocumentId]);

  const handleSend = async () => {
    // console.log(chatRoomDocumentId);
    // console.log(myChatRoomIdInProfile);
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

      await setDoc(doc(db, "lastMessage", lastMessageDocumentId), {
        chatId: chatRoomDocumentId,
        text: message,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-full">
        <Loader />
        <p className="mt-5 text-xl font-bold text-gray-900">
          Fetching chats...
        </p>
      </div>
    );
  } else if (!chatRooms.length) {
    return (
      <div>
        <h1 className="text-center">No chats...</h1>
      </div>
    );
  }

  return (
    <div className="flex overflow-y-hidden max-h-[100vh]">
      <div className="w-[300px] bg-white shadow-lg pt-8 px-4">
        <h2 className="font-bold text-2xl mb-5 border-b pb-2">Chats</h2>
        {chatRooms.map((room) => {
          const lastMsg = lastMessage?.find(
            (message) => message?.chatId === room?.chatId
          );
          return (
            <div
              key={room?.documentId}
              className="mt-4 cursor-pointer flex items-center"
              onClick={() => {
                setChatRoomDocumentId(room?.chatId);
                setReceiver(room?.receiver);
                setSender(room?.sender);
                setMyChatRoomIdInProfile(room?.documentId);
                setProfileData(
                  room?.sender?.userId === userData?.userId
                    ? room?.receiver
                    : room?.sender
                );
              }}
            >
              <img
                src={
                  (room?.sender?.userId === userData?.userId
                    ? room?.receiver?.photoUrl
                    : room?.sender?.photoUrl) ??
                  "https://i2.wp.com/www.stazeibogaze.info/wp-content/uploads/2016/08/default-placeholder.png?fit=1200%2C1200&w=640"
                }
                alt="profile"
                className="rounded-full border p-[2px] w-12 h-12"
              />
              <div className="ml-3">
                <h1 className="font-semibold">
                  {room?.sender?.userId === userData?.userId
                    ? room?.receiver?.fullName
                    : room?.sender?.fullName}
                </h1>
                <h2 className="text-gray-500 text-sm">
                  {lastMsg?.text}{" "}
                  <Moment fromNow className="pr-5 text-xs italic">
                    {lastMsg?.timestamp}
                  </Moment>{" "}
                </h2>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex-1 px-5 chatBg flex flex-col h-[90vh]">
        <div className="flex-1 overflow-y-scroll h-[100vh]">
          {chat.map((message, index) => {
            return (
              <Chat
                key={index}
                message={message}
                activeUserId={userData?.userId}
              />
            );
          })}
        </div>
        <div className="flex items-center mb-5">
          <input
            placeholder="Enter message"
            className="mt-4 w-full py-4 pl-2"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded mt-4"
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </div>
      <div className="bg-white w-[350px]">
        {profileData && <ChatProfileData profileData={profileData} />}
      </div>
    </div>
  );
};

export default ChatList;
