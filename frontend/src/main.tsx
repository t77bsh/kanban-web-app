import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
// css
import "./index.css";
// Route imports
import Home from "./routes/Home";
import App from "./App";
import Dashboard from "./routes/Dashboard";
import Register from "./routes/Register";
import Login from "./routes/Login";
import ErrorPage from "./error-page";
import ProtectedRouteDash from "./routes/protected/ProtectedRouteDash";
import ProtectedRouteAuth from "./routes/protected/ProtectedRouteAuth";
import BoardContent from "./components/BoardContent";
import ThemeProvider from "./context/ThemeContext";
import AuthProvider from "./context/AuthContext";
import NoBoards from "./routes/NoBoards";
// Redux imports
import { store } from "./redux/app/store";
import { Provider } from "react-redux";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      element={
        <ThemeProvider>
          <AuthProvider>
            <Provider store={store}>
              <App />
            </Provider>
          </AuthProvider>
        </ThemeProvider>
      }
    >
      <Route path="/" element={<Home />} />

      {/* If user not logged in, taken to "/", else take to requested route */}
      <Route element={<ProtectedRouteDash />}>
        <Route path="/:uid" element={<Dashboard />} />
        <Route
          path="/:uid/b/:boardUrlID/:boardName"
          element={<BoardContent />}
        />
        <Route path="/:uid/b/" element={<NoBoards />} />
      </Route>

      {/* If user is logged in, taken to "/myboards", else take to the user entered path */}
      <Route element={<ProtectedRouteAuth />}>
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <RouterProvider router={router} />
  //  </React.StrictMode>
);
