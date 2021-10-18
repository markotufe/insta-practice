import { useHistory } from "react-router";

const NoPostsMessage = ({
  message,
  btnText,
  btnFunction,
  showCreatePostButton,
}) => {
  const history = useHistory();

  return (
    <div className="flex justify-center flex-col items-center min-h-screen">
      <h1 className="text-3xl text-gray-800 mb-2">No Posts</h1>
      {showCreatePostButton && (
        <>
          <p className="text-md text-gray-400">{message}</p>
          <button
            onClick={() => {
              if (btnFunction) {
                btnFunction();
              } else {
                history.push("/explore");
              }
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          >
            {btnText}
          </button>
        </>
      )}
    </div>
  );
};

export default NoPostsMessage;
