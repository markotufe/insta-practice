import faker from "faker";
import { useEffect, useState } from "react";
import Story from "./Story";
import { useSession } from "next-auth/react";

function Stories() {
  const [suggestions, setSuggestions] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    const suggestions = [...Array(20)].map((_, index) => {
      return {
        ...faker.helpers.contextualCard(),
        id: index,
      };
    });
    setSuggestions(suggestions);
  }, []);

  return (
    <div className="flex space-x-2 p-6 bg-white mt-8 border rounded-sm border-gray-200 overflow-x-scroll scrollbar-thin scrollbar-thumb-black">
      {session && <Story avatar={session.user.image} username={"Your story"} />}

      {suggestions.map((profile) => (
        <Story
          avatar={profile.avatar}
          username={profile.username}
          key={profile.id}
        />
      ))}
    </div>
  );
}

export default Stories;
