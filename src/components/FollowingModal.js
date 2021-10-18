import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import FollowingUsers from "./FollowingUsers";

export const FollowingModal = ({
  isFollowingModalOpen,
  setIsFollowingModalOpen,
  unfollowUser,
  followingUsers,
}) => {
  return (
    <Transition.Root show={isFollowingModalOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={() => setIsFollowingModalOpen(false)}
      >
        <div className="flex items-end justify-center min-h-[800px] sm:min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* pomaze da centriramo sadrzaj modala */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:Scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
              {followingUsers.map((user) => {
                return (
                  <FollowingUsers
                    key={user?.userId}
                    user={user}
                    handleUnfollow={unfollowUser}
                  />
                );
              })}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};