import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import logoLight from "../assets/logo-light.svg";
import logoDark from "../assets/logo-dark.svg";

function ErrorNavbar() {
  // Theme Hook
  const { dayMode } = useTheme();
  return (
    <div
      className="bg-white border-day dark:bg-grey dark:border-night fixed top-0 left-0 flex w-full h-20 border-b-2"
    >
      {/* Logo */}
      <div className="border-day dark:border-night w-64 border-r-2">
        <div className="flex p-7">
          <Link to="/">
            <img src={dayMode ? logoLight : logoDark} alt="logo" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ErrorNavbar;
