import { useDispatch, useSelector } from "react-redux";
import { setIsTagModalOpen } from "../redux/slices/modalSlice";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { useState } from "react";

export const TagModal = () => {
  const dispatch = useDispatch();
  const isTagModalOpen = useSelector((state) => state.modal.isTagModalOpen);
  const { listOfFollowingUsername } = useSelector(
    (state) => state.user.following
  );

  const [userToTag, setUserToTag] = useState(listOfFollowingUsername);

  const searchAction = (searchText) => {
    const pomUserToTag = listOfFollowingUsername.filter((itemInList) => {
      return itemInList.startsWith(searchText);
    });
    setUserToTag(pomUserToTag);
  };

  return (
    <Modal
      open={isTagModalOpen}
      onClose={() => {
        dispatch(setIsTagModalOpen(false));
      }}
      center
    >
      <div style={{ padding: "20px", minWidth: "350px", minHeight: "250px" }}>
        <div style={{ paddingTop: "25px" }}>
          <div>
            <input
              type="text"
              placeholder="Search user"
              onChange={(e) => searchAction(e.target.value)}
            />
            {userToTag?.map((user) => {
              return <div key={user}>{user}</div>;
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
};
