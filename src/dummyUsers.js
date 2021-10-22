import { createUserWithEmailAndPassword, getAuth } from "@firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
} from "@firebase/firestore";
import { db } from "./firebase";

export async function createUsers() {
  const auth = getAuth();

  const users = [
    {
      username: "markotufe",
      fullName: "Marko Tufegdzic",
      emailAddress: "markotufe@test.test",
      registeredAt: Date.now(),
      password: "123456",
    },
    {
      username: "maja",
      fullName: "Maja Gavrilovic",
      emailAddress: "maja@test.test",
      registeredAt: Date.now(),
      password: "123456",
    },
    {
      username: "masa",
      fullName: "Marija Masic",
      emailAddress: "masa@test.test",
      registeredAt: Date.now(),
      password: "123456",
    },
    {
      username: "stefan",
      fullName: "Stefan Vukoicic",
      emailAddress: "stefan@test.test",
      registeredAt: Date.now(),
      password: "123456",
    },
    {
      username: "nikola",
      fullName: "Nikola Gavrilovic",
      emailAddress: "nikola@test.test",
      registeredAt: Date.now(),
      password: "123456",
    },
  ];

  for (let i = 0; i < users.length; i++) {
    const createdUser = await createUserWithEmailAndPassword(
      auth,
      users[i]?.emailAddress,
      users[i]?.password
    );

    const payload = {
      userId: createdUser?.user?.uid,
      email: createdUser?.user?.email,
      registeredAt: createdUser?.user.metadata?.creationTime,
      photoURL: null,
      fullName: users[i]?.fullName,
      displayName: users[i]?.username,
    };

    const collectionRef = collection(db, "users");
    await addDoc(collectionRef, payload);
  }
}

export async function removeUsers() {
  const collectionRef = collection(db, "users");
  const results = await getDocs(collectionRef);

  const users = results.docs.map((doc) => ({
    ...doc.data(),
    userDocumentId: doc.id,
  }));

  users.forEach(async (user) => {
    const docRef = doc(db, "users", user.userDocumentId);
    await deleteDoc(docRef);
  });
}
