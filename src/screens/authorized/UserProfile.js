/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getFollowingUsers } from "../../helpers/getFollowingUsers";

const UserProfile = () => {
  const { userId } = useSelector((state) => state.user.userData);

  useEffect(() => {
    async function handleGetFollowingUsers() {
      const response = await getFollowingUsers(userId);
      console.log(response);
    }

    handleGetFollowingUsers();
  }, []);

  return <div>cao, ja sam profil</div>;
};

export default UserProfile;
