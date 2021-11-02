const Chat = ({ message, activeUserId }) => {
  return (
    <div
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
