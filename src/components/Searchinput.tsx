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
      <div className="relative group">
        <div className="absolute inset-y-0 flex items-center pl-4 pointer-events-none">
          <VscSearch className="h-5 w-5 text-zinc-400 group-focus-within:text-zinc-700 transition-colors" />
        </div>
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          className="pl-11 pr-4 py-2.5 w-full bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/20 focus:border-zinc-900 focus:bg-white transition-all duration-200 placeholder:text-zinc-400"
          placeholder="Search packages..."
          aria-label="Search packages"
        />
      </div>
    </form>
  );
}
