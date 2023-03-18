import React, { useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import { useTheme } from "./context/ThemeContext";

function App() {
  return <Outlet />;
}

export default App;
