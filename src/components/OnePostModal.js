import { useDispatch, useSelector } from "react-redux";
import { setIsPostModalOpen } from "../redux/slices/modalSlice";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";

export const OnePostModal = ({ post, setSelectedPost }) => {
  const dispatch = useDispatch();
  const isPostModalOpen = useSelector((state) => state.modal.isPostModalOpen);

  console.log(post);

  return (
    <Modal
      open={isPostModalOpen}
      onClose={() => {
        dispatch(setIsPostModalOpen(false));
        setSelectedPost();
      }}
      center
    >
      <div className="flex">
        <div
          style={{
            position: "relative",
            width: "935px",
          }}
        >
          <img src={post?.image} alt="post" className="object-cover" />
        </div>
        <div style={{ width: "335px", marginTop: "70px" }}>right part</div>
      </div>
    </Modal>
  );
};
