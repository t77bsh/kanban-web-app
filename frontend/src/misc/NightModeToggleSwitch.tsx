import { useEffect, useState } from "react";
// Hook Imports
import { useTheme } from "../context/ThemeContext";
// Icon Imports
import dayModeIcon from "../assets/icon-light-theme.svg";
import nightModeIcon from "../assets/icon-dark-theme.svg";

function NightModeToggleSwitch() {

  const { toggleDayMode } = useTheme();

  const [enabled, setEnabled] = useState<boolean>(
    localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
      ? true
      : false
  );
  const [theme, setTheme] = useState<string | null>(enabled ? "dark" : "light");

  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      setTheme("dark");
      setEnabled(true);
    } else {
      document.documentElement.classList.remove("dark");
      setTheme("light");
      setEnabled(false);
    }
  }, []);

  // Click handlers
  const handleToggle = () => {
    setEnabled((enabled) => !enabled);
    setTheme((theme) => (theme === "light" ? "dark" : "light"));
    toggleDayMode();
  };

  useEffect(() => {
    if (theme === "dark") {
      localStorage.theme = "dark";
      document.documentElement.classList.add("dark");
    } else {
      localStorage.theme = "light";
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className="flex justify-center m-auto scale-y-95">
      <img className="object-contain my-auto" src={dayModeIcon} alt="day" />
      {/* Toggle Switch */}
      <div className="relative flex flex-col items-center justify-center overflow-hidden mx-5">
        <div className="flex">
          <label className="inline-flex relative items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={enabled}
              readOnly
            />
            <div
              onClick={handleToggle}
              className="bg-white dark:bg-purple dark:bg-purple-gradient border dark:border-night w-11 h-6 rounded-full peer peer-focus:ring-green-300 peer-checked:after:bg-night peer-checked:after:translate-x-full peer-checked:after:border-2 peer-checked:after:border-light-grey after:content-[''] after:absolute after:top-0.5 after:left-[2px]  after:bg-light-grey after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
            ></div>
          </label>
        </div>
      </div>
      {/* End Switch */}
      <img
        src={nightModeIcon}
        alt="night"
        className="object-contain my-auto color-white"
      />
    </div>
  );
}

export default NightModeToggleSwitch;
