import { Link } from "react-router-dom";
import SearchInput from "./Searchinput";

export default function Header() {
  return (
    <div>
      <Link to="/">NPM Registry</Link>
      <SearchInput />
    </div>
  );
}
