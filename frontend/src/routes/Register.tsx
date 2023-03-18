import React, { useRef } from "react";
import { Link } from "react-router-dom";
// Logo icon imports
import googleLogo from "../assets/google-icon.svg";
import facebookLogo from "../assets/facebook-icon.svg";
import logoDark from "../assets/logo-dark.svg";
import logoLight from "../assets/logo-light.svg";
// Auth context
import { useAuth } from "../context/AuthContext";
// Theme context
import { useTheme } from "../context/ThemeContext";
// Night mode
import NightModeToggleSwitch from "../misc/NightModeToggleSwitch";

function Register() {
  //   Refs
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const surnameRef = useRef<HTMLInputElement>(null);

  //   Theme
  const { dayMode } = useTheme();

  //   Class names
  const inputClass = "border-day border rounded-sm pl-2 text-dark dark:text-white shadow-sm dark:bg-transparent dark:border-night";
  const socialButtonClass =
    "flex gap-2 rounded-[4px] text-white px-4 py-1.5 hover:shadow-inner-md";
  const labelClass = "text-dark dark:text-white";

  // SIGN UPS //

  // Auths
  const { signup, googleAuth, facebookAuth } = useAuth();
  // Email Password Signup
  const createAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (passwordRef.current!.value === confirmPasswordRef.current!.value) {
      try {
        await signup(
          emailRef.current!.value,
          passwordRef.current!.value,
          firstNameRef.current!.value,
          surnameRef.current!.value,
          firstNameRef.current!.value + surnameRef.current!.value // Display name
        );
      } catch (error: any) {
        alert(error.message);
      }
    } else {
      alert("Passwords do not match.");
    }
  };

  return (
    <div className="flex flex-col gap-3 page-center ">
      {/* Logo */}
      <div className="ml-2">
        <img src={dayMode ? logoLight : logoDark} alt="logo" />
      </div>

      {/* Register UI */}
      <div className="flex flex-col w-[450px] gap-5 p-6 bg-white dark:bg-grey rounded-lg shadow-2xl">
        <h2 className="font-normal text-dark dark:text-white text-center ">Sign up</h2>

        {/* Sign up with Facebook or Google */}
        <div className="flex justify-between">
          <button
            onClick={googleAuth}
            className={"bg-[#4285F4] " + socialButtonClass}
          >
            <div className="w-[22px] h-[22px] bg-white rounded-sm p-[1px]">
              <img src={googleLogo} alt="google-logo" />
            </div>
            <div> Sign up with Google</div>
          </button>
          <button
            onClick={facebookAuth}
            className={"bg-[#3b5998] " + socialButtonClass}
          >
            <div className="w-[22px] h-[22px] bg-white rounded-sm p-[1px]">
              <img src={facebookLogo} alt="facebook-logo" />
            </div>
            <div>Sign up with Facebook</div>
          </button>
        </div>

        {/* Or */}
        <div className="flex justify-center items-center">
          <hr className="w-full border dark:text-white border-day mx-2" />
          <span>Or</span>
          <hr className="w-full border border-day mx-2" />
        </div>

        {/* Create Account Form */}
        <form className="flex flex-col gap-3" onSubmit={createAccount}>
          {/* Name */}
          <div className="grid grid-cols-[1fr_1fr] gap-4">
            <div className="flex flex-col">
              <label htmlFor="firstName" className={labelClass}>
                First Name
              </label>
              <input
                ref={firstNameRef}
                type="text"
                name="firstName"
                id="firstName"
                placeholder="First name"
                className={inputClass}
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="surname" className={labelClass}>
                Surname
              </label>
              <input
                ref={surnameRef}
                type="text"
                name="surname"
                id="surname"
                placeholder="Surname"
                className={inputClass}
                required
              />
            </div>
          </div>
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
          <div className="grid grid-cols-[1fr_1fr] gap-4">
            <div className="flex flex-col">
              <label htmlFor="password" className={labelClass}>
                Password
              </label>
              <input
                ref={confirmPasswordRef}
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                className={inputClass}
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="confirmPassword" className={labelClass}>
                Confirm Password
              </label>
              <input
                ref={passwordRef}
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Confirm password"
                className={inputClass}
                required
              />
            </div>
          </div>

          {/* T&Cs */}
          <label className="flex gap-3 text-sm">
            <input type="checkbox" className="accent-purple" required />
            <span>
              I agree to the <Link>Terms of Service</Link> and{" "}
              <Link>Privacy Policy.</Link>
            </span>
          </label>

          {/* Create Account */}
          <button className="rounded-3xl text-white px-4 py-2 bg-purple bg-purple-gradient hover:shadow-inner-md">
            Create Account
          </button>
        </form>

        {/* Existing user */}
        <div className="text-center text-xs">
          Already registered? <Link to="/login">Sign in.</Link>
        </div>
      </div>

      <div
            className="bg-white dark:bg-grey p-3.5 rounded-lg"
          >
            <NightModeToggleSwitch />
          </div>
    </div>
  );
}

export default Register;
