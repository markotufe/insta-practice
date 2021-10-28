import { useDispatch, useSelector } from "react-redux";
import { setIsChatModalOpen } from "../../redux/slices/modalSlice";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";

export const ChatModal = ({ displayName }) => {
  const dispatch = useDispatch();
  const isChatModalOpen = useSelector((state) => state.modal.isChatModalOpen);

  const handleSendMessage = (e) => {
    e.preventDefault();
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
            <textarea className="border rounded-sm w-full resize-none min-h-[120px]"></textarea>
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
