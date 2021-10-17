import { useLocation } from "react-router-dom";

const UserToFollowProfile = () => {
  const location = useLocation();

  const userId = location.state;

  return <div>cao</div>;
};

export default UserToFollowProfile;
