import React from "react";
import { useTheme } from "../context/ThemeContext";

function BoardsLoader() {
  const { dayMode } = useTheme();
  const boardsLoaderClass = "bg-lighter-purple dark:bg-night flex rounded-r-3xl relative h-[39px] mr-7";
  return (
    <>
      <div className={boardsLoaderClass}></div>
      <div className={boardsLoaderClass}></div>
      <div className={boardsLoaderClass}></div>
      <div className={boardsLoaderClass}></div>
      <div className={boardsLoaderClass}></div>
      <div className={boardsLoaderClass}></div>
    </>
  );
}

export default BoardsLoader;
