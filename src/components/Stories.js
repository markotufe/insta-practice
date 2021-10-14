import faker from "faker";
import { useEffect, useState } from "react";
import Story from "./Story";

function Stories() {
  const [suggestions, setSuggestions] = useState([]);

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
      <Story
        avatar={
          "https://i2.wp.com/www.stazeibogaze.info/wp-content/uploads/2016/08/default-placeholder.png?fit=1200%2C1200&w=640"
        }
        username={"You"}
      />

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
