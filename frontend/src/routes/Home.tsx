import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
// Context
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
// Components
import DashSkeletonLoader from "../misc/DashSkeletonLoader";
import logoDark from "../assets/logo-dark.svg";
import logoLight from "../assets/logo-light.svg";
import landingVisual from "../assets/Screenshot_2023-03-14_at_13.19.22-removebg.png";
import demoVideo from "../assets/Kanban_demo.mp4";
import NightModeToggleSwitch from "../misc/NightModeToggleSwitch";
// Library imports
import axios from "axios";

function Home() {
  // Auth context
  const { user, loading } = useAuth();

  // Theme context
  const { dayMode } = useTheme();

  //States
  const [path, setPath] = useState("");
  const [loadingPath, setLoadingPath] = useState(true);

  //Effects
  useEffect(() => {
    if (user && user.uid) {
      setTimeout(() => {
        axios
          .get(`http://localhost:8000/api/user_boards/${user.uid}`)
          .then((res) => {
            if (res.data.boards.length > 0) {
              setPath(
                `${res.data.boards[0].boardUrlID}/${res.data.boards[0].boardNameUrl}`
              );
            }
            setLoadingPath(false);
          });
      }, 500);
    }
  }, [user]);

  if (loading) {
    return null;
  } else if (user === null) {
    return (
      <>
        {/* Navbar */}
        <nav className="flex justify-between max-w-6xl mx-auto items-center h-20">
          <div>
            <img src={dayMode ? logoLight : logoDark} alt="logo" />
          </div>
          <div className="flex items-center gap-x-4">
            <Link
              to="/login"
              className="text-purple-gradient dark:text-white underline"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="bg-purple-gradient rounded-3xl px-10 py-2 hover:shadow-inner-md text-white"
            >
              Join FREE
            </Link>
          </div>
        </nav>

        {/* Main landing */}
        <section
          style={{
            background:
              "linear-gradient(90deg, rgba(107,33,168,1) 15%, rgba(149,29,121,1) 100%)",
          }}
          className="bg-purple-gradient"
        >
          <div className="flex max-w-6xl mx-auto py-2 gap-x-10 justify-between">
            <div className="flex flex-col gap-y-3 text-white justify-center max-w-xl">
              <h1 className="text-3xl">Life admin and work made easy</h1>
              <p>
                Tired of juggling multiple projects and deadlines? Errands all
                over the place? Say goodbye to the chaos. With our intuitive
                boards and powerful features, you can visualize your work, track
                progress, and boost your productivity.
              </p>
              <div>
                <Link
                  to="/register"
                  className="text-white bg-yellow-500 hover:shadow-inner-md rounded-3xl px-10 py-2"
                >
                  Join FREE
                </Link>
              </div>
            </div>
            <figure className="flex justify-center">
              <img
                src={landingVisual}
                className="w-[600px]"
                alt="product-illustration"
              />
            </figure>
          </div>
        </section>

        {/* App demo */}
        <section className="max-w-6xl flex flex-col gap-y-7 mx-auto py-20">
          <video src={demoVideo} className="rounded-xl" controls muted>
            Your browser does not support the video tag. Please consider
            upgrading to a newer browser.
          </video>
          <NightModeToggleSwitch />
        </section>
      </>
    );
  } else if (user.uid && !loadingPath) {
    return <Navigate to={`/${user.uid}/b/${path}`} />;
  } else return <DashSkeletonLoader />;
}
export default Home;
