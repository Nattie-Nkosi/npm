import { useState } from "react";
import { VscSearch } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";

export default function SearchInput() {
  const [term, setTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!term.trim()) return;

    navigate(`/search?term=${encodeURIComponent(term.trim())}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="relative">
        <div className="absolute inset-y-0 flex items-center pl-3 pointer-events-none">
          <VscSearch className="h-5 w-5 text-gray-400" />
        </div>
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          className="pl-10 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="Search packages..."
          aria-label="Search packages"
        />
      </div>
    </form>
  );
}
