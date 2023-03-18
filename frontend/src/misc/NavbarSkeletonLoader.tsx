import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
// Asset imports
import logoLight from "../assets/logo-light.svg";
import logoDark from "../assets/logo-dark.svg";
// Context imports
import { useTheme } from "../context/ThemeContext";

function NavbarSkeletonLoader() {
  const { dayMode } = useTheme();
  return (
    <nav className="bg-white border-day dark:bg-grey dark:border-night flex w-full shrink h-20 border-b-2">
      {/* Logo */}
      <div className="border-day dark:border-night w-64 border-r-2">
        <div className="flex p-7">
            <img src={dayMode ? logoLight : logoDark} alt="logo" />
        </div>
      </div>

      <div className="flex items-center flex-grow">
        {/* Board Name */}

        <div className="bg-lighter-purple dark:bg-night rounded-[4px] ml-12 w-60 h-7"></div>
      </div>
    </nav>
  );
}

export default NavbarSkeletonLoader;
