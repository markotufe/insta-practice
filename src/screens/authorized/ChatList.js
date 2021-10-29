import { useEffect, useState } from "react";

import { collection, onSnapshot, query, where } from "@firebase/firestore";
import { db } from "../../firebase";
import { getMessages } from "../../helpers/getMessages";
import { useSelector } from "react-redux";

const ChatList = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [chat, setChat] = useState([]);

  const userData = useSelector((state) => state.user.userData);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "chatRooms"),
        // where("receiverUserId", "==", userData?.userId)
        where("activeUserId", "==", userData?.userId)
        // orderBy("timestamp", "desc")
      ),
      async (snapshot) => {
        const chatRooms = snapshot.docs.map((doc) => ({
          ...doc.data(),
          documentId: doc.id,
        }));

        console.log(chatRooms);

        setChatRooms(chatRooms);
      }
    );
    return unsubscribe;
  }, [userData?.userId]);

  const getChatData = async (chatRoomDocumentId) => {
    const results = await getMessages(chatRoomDocumentId);
    setChat(results);
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
              onClick={() => getChatData(room?.documentId)}
            >
              <h1>{room?.receiverUserData?.fullName}</h1>
              {/* <h1>{room?.activeUserData?.fullName}</h1> */}
            </div>
          );
        })}
      </div>
      <div className="flex-1 px-5 chat-bg">
        {chat.map((message, index) => {
          return <div key={index}>{message?.text}</div>;
        })}
      </div>
      <div className="bg-white w-[350px]">profil osobe</div>
    </div>
  );
};

export default ChatList;
