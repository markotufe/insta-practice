import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef, useState } from "react";
import { CameraIcon } from "@heroicons/react/outline";
import { db, storage } from "../firebase";
import { addDoc, collection, doc, updateDoc } from "@firebase/firestore";
import { ref, getDownloadURL, uploadString } from "@firebase/storage";
import { useSelector } from "react-redux";
import { setModal } from "../redux/slices/modalSlice";
import { useDispatch } from "react-redux";

export const Modal = () => {
  const filePickerRef = useRef(null);
  const captionRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { displayName, userId, photoURL } = useSelector(
    (state) => state.user.userData
  );
  const { isModalOpen } = useSelector((state) => state.modal);
  const dispatch = useDispatch();

  const uploadPost = async () => {
    if (loading) return;

    setLoading(true);

    //Kreiramo objau i saljemo u firestore 'posts' kolekciju
    //uzimamo ID posta koji je kreiran
    //saljemo sliku na firebase storage sa id-em posta
    //uzimamo download URL od firebasea storage-a i azuriramo originalni post sa slikom

    //dodajemo dokument na firestore, prvi argument je inicijalizovan firestore, drugi kolekcija gde ide dokument, a treci sta saljemo na server
    const docRef = await addDoc(collection(db, "posts"), {
      creatorId: userId,
      creatorDisplayName: displayName,
      photoURL: photoURL,
      caption: captionRef?.current?.value,
      timestamp: Date.now(),
    });

    // console.log("New doc added", docRef.id);

    //lokacija gde se nalazi slika na firebase storag-u, putanja ide takva da znamo na sta se odnosi slika i dobijamo referencu na firebase storage
    const imageRef = ref(storage, `posts/${docRef.id}/image`);

    //azuriranje dokumenta na firestore-u, treci argument je tip fajla koji nam treba
    await uploadString(imageRef, selectedFile, "data_url").then(
      async (snapshot) => {
        const downloadUrl = await getDownloadURL(imageRef);

        //azuriramo dodat dokument sa slikom, db je funkcija koja pokazuje na dokument unutar firestore-a, treci argument je sta zelimo da azuriramo
        await updateDoc(doc(db, "posts", docRef.id), {
          image: downloadUrl,
          postId: docRef.id,
        });
      }
    );

    dispatch(setModal(false));
    setLoading(false);
    setSelectedFile(null);

    //Tok: uploaduje post na firestore kolekciju, onda ce uploadovati sliku na firebase storage, onda ce se vratiti i azurirati dokument koji smo kreirali sa slikom
  };

  const addImageToPost = (e) => {
    const reader = new FileReader();
    //e.target.files[0] znaci da uzmemo fajlove koje je korisnik selektovao, a posto uzimamo samo jedan fajl, zato stoji nula
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    //kada browser zavrsi sa citanjem slike, dobijamo readerEvent
    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  };

  return (
    <Transition.Root show={isModalOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={() => dispatch(setModal(false))}
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
              <div>
                {!selectedFile ? (
                  <div
                    className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 cursor-pointer"
                    onClick={() => filePickerRef.current.click()}
                  >
                    <CameraIcon
                      className="h-6 w-6 text-red-600"
                      aria-hidden="true"
                    />
                  </div>
                ) : (
                  <img
                    src={selectedFile}
                    alt="post"
                    className="w-full object-contain cursor-pointer"
                    onClick={() => setSelectedFile(null)}
                  />
                )}

                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      Upload a photo
                    </Dialog.Title>
                  </div>
                  <div>
                    <input
                      type="file"
                      hidden
                      ref={filePickerRef}
                      onChange={addImageToPost}
                    />
                  </div>

                  <div className="mt-2">
                    <input
                      type="text"
                      className="border-none focus:ring-0 w-full text-center"
                      placeholder="Please enter a caption..."
                      ref={captionRef}
                    />
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 disabled:cursor-not-allowed"
                    disabled={!selectedFile}
                    onClick={uploadPost}
                  >
                    {loading ? "Uploading" : "Upload post"}
                  </button>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
