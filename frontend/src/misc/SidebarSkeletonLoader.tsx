
// Context imports
import { useTheme } from "../context/ThemeContext";
// Asset imports
import logoLight from "../assets/logo-light.svg";
import logoDark from "../assets/logo-dark.svg";
import NightModeToggleSwitch from "./NightModeToggleSwitch";
import hideSideEyeIcon from "../assets/icon-hide-sidebar.svg";
import showSideEyeIcon from "../assets/icon-show-sidebar.svg";
// Loader import
import BoardsLoader from "./BoardsLoader";

function SidebarSkeletonLoader() {
  const { dayMode } = useTheme();

  return (
    <aside className="absolute z-40">
      <div className="bg-white border-day dark:bg-grey dark:border-night flex flex-col w-64 h-screen border-r-2">
        {/* Logo */}
        <div className="flex p-7">
          <img src={dayMode ? logoLight : logoDark} alt="logo" />
        </div>

        {/* All Boards */}
        <h4 className="pl-7 mb-2.5">ALL BOARDS ()</h4>

        {/* New Boards Render Here */}
        <div className="flex flex-col gap-1 pt-2 pb-8 overflow-auto">
          <BoardsLoader />
        </div>

        {/* Create New Board */}

        <button disabled className="flex my-2.5 rounded-r-3xl text-left pl-7 py-2 mr-7">
          <svg
            className="my-auto mr-4"
            width="16"
            height="16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 2.889A2.889 2.889 0 0 1 2.889 0H13.11A2.889 2.889 0 0 1 16 2.889V13.11A2.888 2.888 0 0 1 13.111 16H2.89A2.889 2.889 0 0 1 0 13.111V2.89Zm1.333 5.555v4.667c0 .859.697 1.556 1.556 1.556h6.889V8.444H1.333Zm8.445-1.333V1.333h-6.89A1.556 1.556 0 0 0 1.334 2.89V7.11h8.445Zm4.889-1.333H11.11v4.444h3.556V5.778Zm0 5.778H11.11v3.11h2a1.556 1.556 0 0 0 1.556-1.555v-1.555Zm0-7.112V2.89a1.555 1.555 0 0 0-1.556-1.556h-2v3.111h3.556Z"
              fill="#635FC7"
            />
          </svg>
          <div className="text-purple">+ Create New Board</div>
        </button>

        {/* Night Mode + Hide Sidebar */}
        <div className="mx-7 mt-auto mb-4">
          {/* Night Mode Switch */}
          <div className="bg-day dark:bg-night p-3.5 rounded-lg">
            <NightModeToggleSwitch />
          </div>
          {/* Hide Sidebar */}
          <div className="flex gap-4 my-5">
            <img
              className="object-contain"
              src={hideSideEyeIcon}
              alt="eye-icon"
            />
            <div className="font-bold">Hide Sidebar</div>
          </div>
        </div>
      </div>

      {/* Show Sidebar Button */}
      <button className="hidden bg-purple bg-purple-gradient hover:shadow-inner-md w-16 h-12 rounded-r-3xl fixed bottom-10">
        <img className="m-auto" src={showSideEyeIcon} alt="show-sidebar" />
      </button>
    </aside>
  );
}

// Convert board name to URL friendly format

export default SidebarSkeletonLoader;
