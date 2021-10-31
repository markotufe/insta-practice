import { useEffect, useState } from "react";

import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "@firebase/firestore";
import { db } from "../../firebase";
import { useSelector } from "react-redux";

const ChatList = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [chatRoomDocumentId, setChatRoomDocumentId] = useState("");
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const [isMessageSentToUser, setIsMessageSentToUser] = useState(false);
  const [isMessageSentFromUser, setIsMessageSentFromUser] = useState(false);
  const [receiverChatDocumentId, setReceiverChatDocumentId] = useState("");
  const [senderChatDocumentId, setSenderChatDocumentId] = useState("");
  const [myChatDocumentId, setMyChatDocumentId] = useState("");
  const [receiver, setReceiver] = useState();
  const [sender, setSender] = useState();

  const userData = useSelector((state) => state.user.userData);

  //ovo je za get soba i poruka
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

  //ovo je za send
  useEffect(() => {
    if (receiver) {
      const unsubscribe = onSnapshot(
        query(
          collection(db, "users", receiver?.documentId, "chats"),
          where("sentBy", "==", userData?.userId)
        ),
        (snapshot) => {
          if (snapshot.docs.length > 0) {
            setReceiverChatDocumentId(snapshot.docs[0].id);
            setIsMessageSentToUser(snapshot.docs.length > 0);
          }
        }
      );
      return unsubscribe;
    }
  }, [receiver?.documentId, receiver, userData?.userId]);

  useEffect(() => {
    if (receiver) {
      const unsubscribe = onSnapshot(
        query(
          collection(db, "users", receiver?.documentId, "chats"),
          where("sentBy", "==", receiver?.userId)
        ),
        (snapshot) => {
          if (snapshot.docs.length > 0) {
            setSenderChatDocumentId(snapshot.docs[0].id);
            setIsMessageSentFromUser(snapshot.docs.length > 0);
          }
        }
      );
      return unsubscribe;
    }
  }, [receiver?.userId, receiver?.documentId, receiver]);

  useEffect(() => {
    if (sender) {
      const unsubscribe = onSnapshot(
        query(
          collection(db, "users", sender?.documentId, "chats"),
          where("sentBy", "==", sender?.userId)
        ),
        (snapshot) => {
          if (snapshot.docs.length > 0) {
            setSenderChatDocumentId(snapshot.docs[0].id);
          }
        }
      );
      return unsubscribe;
    }
  }, [sender]);

  useEffect(() => {
    if (isMessageSentToUser) {
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
      if (sender) {
        const getMyChatDocumentId = async () => {
          const collectionRef = collection(
            db,
            "users",
            userData?.documentId,
            "chats"
          );
          const q = query(collectionRef, where("sentBy", "==", sender?.userId));
          const snapshot = await getDocs(q);

          if (snapshot.docs.length > 0) {
            setMyChatDocumentId(snapshot.docs[0].id);
          }
        };
        getMyChatDocumentId();
      }
    }
  }, [
    isMessageSentToUser,
    userData?.documentId,
    userData?.userId,
    sender?.userId,
    sender,
  ]);

  const handleSend = async (e) => {
    e.preventDefault();

    if (isMessageSentToUser && !isMessageSentFromUser) {
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
            receiver?.documentId,
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
        setMessage("");
      } catch (error) {
        console.log(error);
      }
    } else {
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
            sender?.documentId,
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
        setMessage("");
      } catch (error) {
        console.log(error);
      }
    }
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
                setChatRoomDocumentId(room?.documentId);
                setReceiver(room?.receiver);
                setSender(room?.sender);
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
              {message?.text}{" "}
              {message.sentBy === userData?.userId
                ? "sent by me"
                : "sent by other"}{" "}
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
