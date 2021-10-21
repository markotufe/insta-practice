import useGetCommentsAndLikesForPost from "../../helpers/getCommentsAndLikesForPost";
import { HeartIcon, ChatIcon } from "@heroicons/react/solid";
import { useDispatch } from "react-redux";
import { setIsPostModalOpen } from "../../redux/slices/modalSlice";

const UserPosts = ({ post, setSelectedPost }) => {
  const { comments, likes } = useGetCommentsAndLikesForPost(post?.postId);
  const dispatch = useDispatch();

  return (
    <div
      className="w-full h-70 mt-3 relative group"
      onClick={() => {
        setSelectedPost(post);
        dispatch(setIsPostModalOpen(true));
      }}
    >
      <img
        src={post?.image}
        alt="photourl"
        className="rounded-md object-cover md:h-[250px] mx-auto"
      />

      <div className="cursor-pointer rounded-md absolute bottom-0 left-0 bg-gray-500 bg-opacity-50 z-10 w-full justify-evenly items-center h-full bg-black-faded group-hover:flex hidden">
        <div className="flex items-center text-white font-bold">
          <HeartIcon className="navBtn mr-1" />
          {likes.length}
        </div>

        <div className="flex items-center text-white font-bold">
          <ChatIcon className="navBtn mr-1" />
          {comments.length}
        </div>
      </div>
    </div>
  );
};

export default UserPosts;
