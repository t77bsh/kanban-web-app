import { Link } from "react-router-dom";
// Component imports
import logoLight from "../assets/logo-light.svg";
import logoDark from "../assets/logo-dark.svg";
import Dropdown from "./Dropdown";

// Context imports
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { dayMode } = useTheme();
  const { user } = useAuth();

  // If display name is separated by spaces, only use the first word
  let boardName = null;
  if (user && "displayName" in user && user.displayName) {
    let boardNameSpaces = user.displayName.split(" ");
    boardName = boardNameSpaces[0];
  }

  return (
    <nav className="bg-white border-day dark:bg-grey dark:border-night flex w-full shrink h-20 border-b-2">
      {/* Logo */}
      <div className="border-day dark:border-night w-64 border-r-2">
        <div className="flex p-7">
          <Link to="/">
            <img src={dayMode ? logoLight : logoDark} alt="logo" />
          </Link>
        </div>
      </div>

      <div className="flex items-center flex-grow">
        {/* Board Name */}
        <h1 className="text-dark dark:text-white rounded-[4px] px-2 ml-10">
          Hi there {boardName}, welcome to Kanban!
        </h1>

        <div className="flex items-center ml-auto mr-7">
          {/* Three Dots Dropdown */}
          <Dropdown />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
