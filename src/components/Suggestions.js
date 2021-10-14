import faker from "faker";
import { useEffect, useState } from "react";
import Suggestion from "./Suggestion";

const Suggestions = () => {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const suggestions = [...Array(5)].map((_, index) => {
      return {
        ...faker.helpers.contextualCard(),
        id: index,
      };
    });
    setSuggestions(suggestions);
  }, []);

  return (
    <div className="mt-4 ml-10">
      <div className="flex justify-between text-sm mb-5">
        <h3 className="text-sm font-bold text-gray-400">Suggestions for you</h3>
        <button className="text-gray-600 font-semibold">See all</button>
      </div>

      {suggestions.map((profile) => {
        return <Suggestion key={profile.id} profile={profile} />;
      })}
    </div>
  );
};

export default Suggestions;
