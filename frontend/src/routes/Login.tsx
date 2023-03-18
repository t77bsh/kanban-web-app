import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// Logo icon imports
import googleLogo from "../assets/google-icon.svg";
import facebookLogo from "../assets/facebook-icon.svg";
import logoDark from "../assets/logo-dark.svg";
import logoLight from "../assets/logo-light.svg";
// Import icons
import crossIcon from "../assets/icon-cross.svg";
// Auth context
import { useAuth } from "../context/AuthContext";
// Theme context
import { useTheme } from "../context/ThemeContext";
// Night mode
import NightModeToggleSwitch from "../misc/NightModeToggleSwitch";

function Login() {
  // Refs
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const resetPassEmailRef = useRef<HTMLInputElement>(null);

  // Theme
  const { dayMode } = useTheme();

  // SIGN INS //
  const { login, googleAuth, facebookAuth, resetPassword } = useAuth();

  // STATES//
  const [showForgotPasswordUI, setShowForgotPasswordUI] = useState(false);

  // Login with Email and Password
  const navigate = useNavigate();
  const signIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(emailRef.current!.value, passwordRef.current!.value).then(
        (currentUser) => navigate(`/${currentUser.user.uid}`)
      );
    } catch (error: any) {
      alert(error.message);
    }
  };

  //   Class names
  const inputClass =
    "border-day border rounded-sm pl-2 text-dark shadow-sm dark:text-white dark:bg-transparent dark:border-night";
  const socialButtonClass =
    "flex gap-2 rounded-[4px] text-white px-4 py-1.5 hover:shadow-inner-md";
  const labelClass = "text-dark dark:text-white";

  return (
    <div className="flex flex-col gap-3 page-center">
      {/* Logo */}
      <div className="ml-2">
        <img src={dayMode ? logoLight : logoDark} alt="logo" />
      </div>

      {/* Sign In UI */}
      <div className="flex flex-col w-[450px] gap-5 p-6 bg-white dark:bg-grey rounded-lg shadow-xl">
        <h2 className="font-normal text-dark dark:text-white text-center ">
          Sign in
        </h2>

        {/* Sign in with Facebook or Google */}
        <div className="flex justify-between">
          <button
            onClick={googleAuth}
            className={"bg-[#4285F4] " + socialButtonClass}
          >
            <div className="w-[22px] h-[22px] bg-white rounded-sm p-[1px]">
              <img src={googleLogo} alt="google-logo" />
            </div>
            <div> Sign in with Google</div>
          </button>
          <button
            onClick={facebookAuth}
            className={"bg-[#3b5998] " + socialButtonClass}
          >
            <div className="w-[22px] h-[22px] bg-white rounded-sm p-[1px]">
              <img src={facebookLogo} alt="facebook-logo" />
            </div>
            <div>Sign in with Facebook</div>
          </button>
        </div>

        {/* Or */}
        <div className="flex justify-center dark:text-white items-center">
          <hr className="w-full border border-day mx-2" />
          <span>Or</span>
          <hr className="w-full border border-day mx-2" />
        </div>

        {/* Custom login*/}
        <form className="flex flex-col gap-3" onSubmit={signIn}>
          {/* Email */}
          <div className="flex flex-col">
            <label htmlFor="email" className={labelClass}>
              Email address
            </label>
            <input
              ref={emailRef}
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              className={inputClass}
              required
            />
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label htmlFor="password" className={labelClass}>
              Password
            </label>
            <input
              ref={passwordRef}
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              className={inputClass}
              required
            />
          </div>

          {/* Sign in button */}
          <button className="rounded-3xl text-white px-4 py-2 bg-purple bg-purple-gradient hover:shadow-inner-md">
            Sign in
          </button>
        </form>

        {/* Forgot Pass + Sign Up */}
        <div className="flex flex-col gap-2 items-center">
          <div
            onClick={() => setShowForgotPasswordUI((prev) => !prev)}
            className="text-xs cursor-pointer text-purple"
          >
            Forgot password?
          </div>
          <div className="text-xs">
            Need an account? <Link to="/register">Sign Up</Link>
          </div>
        </div>
      </div>

      {/* Forgot Password */}
      {showForgotPasswordUI ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            resetPassword(resetPassEmailRef.current!.value.trim());
            setShowForgotPasswordUI(false);
          }}
          className="bg-white relative dark:bg-grey p-3.5 rounded-lg flex flex-col gap-2"
        >
          <p className="font-normal text-dark dark:text-white text-center ">
            Send a reset password link to your email
          </p>
          <button onClick={()=>setShowForgotPasswordUI(false)} className="absolute top-4 right-4">
            <img src={crossIcon} alt="" />
          </button>
          <input
            ref={resetPassEmailRef}
            type="email"
            name="forgotPass"
            id="forgotPass"
            placeholder="Email"
            className={inputClass}
            autoFocus
            required
          />
          <button type="submit" className="text-purple">
            Send Reset Password Link
          </button>
        </form>
      ) : null}

      {/* Night mode toggle */}
      <div className="bg-white dark:bg-grey p-3.5 rounded-lg">
        <NightModeToggleSwitch />
      </div>
    </div>
  );
}

export default Login;
