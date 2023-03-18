import { useState, useRef, useEffect } from "react";
import threeDots from "../assets/icon-vertical-ellipsis.svg";
import { useAuth } from "../context/AuthContext";
// Redux
import { useAppDispatch } from "../redux/app/hooks";
import { setUserBoards } from "../redux/features/dashboardSlice";

function DropdownMenu() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [ref]);
  //

  // Contexts
  const { logout } = useAuth();

  //Redux
  const dispatch = useAppDispatch();

  // State
  const [isOpen, setIsOpen] = useState(false);
  // Class names
  const optionClass =
    "hover:bg-day dark:hover:bg-night block px-4 py-2 cursor-pointer text-red text-center hover:bg-day focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out";

  // Logout handler
  const logoutHandler = () => {
    logout().then(() => {
      dispatch(setUserBoards(null));
    });
  };
  return (
    <div className="relative z-50 ml-3" ref={ref}>
      <div>
        <img
          src={threeDots}
          onClick={() => setIsOpen(!isOpen)}
          className="cursor-pointer min-h-[20px] min-w-[5px]"
          alt="three-dots"
        />
      </div>
      {/* Dropdown UI */}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } origin-top-right absolute right-0 mt-5 w-40 rounded-lg shadow-md`}
      >
        <div className="bg-white dark:bg-grey rounded-md shadow-md">
          <div className="py-2">
            {/* Menu options */}
            <div onClick={logoutHandler} className={optionClass}>
              Log out
            </div>
            {/*  */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DropdownMenu;
