import { useEffect, useRef } from "react";

const Chat = ({ message, activeUserId }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div
      ref={scrollRef}
      className={message.sentBy === activeUserId ? "myMessage" : "userMessage"}
    >
      <p
        className={
          message.sentBy === activeUserId ? "text-gray-800" : "text-white"
        }
      >
        {message?.text}
      </p>
    </div>
  );
};

export default Chat;
