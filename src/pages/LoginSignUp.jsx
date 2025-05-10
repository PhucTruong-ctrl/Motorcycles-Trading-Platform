import React, { useState, useEffect } from "react";
import { NumericFormat } from "react-number-format";
import supabase from "../lib/supabase-client";
import bcrypt from "bcryptjs";
import { handleUserCreation } from "../utils/authUtils";
import { Message } from "../features/Chat/Message";

const LoginSignUp = () => { // Login and Sign Up component
  const [atLogin, setAtLogin] = useState(true); // State to determine if the user is at the login or sign up page
  const [showPassword, setShowPassword] = useState(false); // State to show or hide password
  const [newUser, setNewUser] = useState({ // State to store new user information
    email: "",
    password: "",
    name: "",
    birthdate: "",
    is_man: null,
    phone_num: "",
    citizen_id: "",
  });

  useEffect(() => { // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) { // If user is logged in, handle user creation
        handleUserCreation(session.user);
      }
    });

    const { // Subscribe to auth state changes
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => { // Listen for auth state changes
      console.log("Auth state changed:", _event, session); // Log the auth state change
      if (session) { // If user is logged in, handle user creation
        console.log("User from session:", session.user);
        handleUserCreation(session.user); // Handle user creation
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => { // Set the document title based on the current state
    if (atLogin) {
      document.title = "Login";
    } else {
      document.title = "Sign Up";
    }
  }, [atLogin]);

  const handleInputChange = (e) => { // Handle input changes
    const { name, value, type, checked } = e.target; // Destructure the event target

    if (type === "radio") { // If the input is a radio button
      setNewUser({ // Update the newUser state with the selected radio button value
        ...newUser,
        is_man: value === "true" ? true : false, // Convert the value to a boolean
      });
    } else {
      setNewUser({ // Update the newUser state with the input value
        ...newUser, // Spread the existing newUser state
        [name]: type === "checkbox" ? checked : value, // If the input is a checkbox, set the value to checked or unchecked else set the value to the input value
      });
    }
  };

  const signUp = async () => { // Google Sign Up
    try {
      const { error } = await supabase.auth.signInWithOAuth({ // Sign in with Google
        provider: "google", // Use Google as the provider
        options: { // Options for the sign in
          redirectTo: `${window.location.origin}/auth-callback`, // Redirect to this URL after sign in
          queryParams: { // Query parameters for the sign in
            prompt: "select_account", // Prompt the user to select an account
            access_type: "offline", // Request offline access
          },
        },
      });

      if (error) throw error;
    } catch (err) {
      alert("Error signing in with Google: " + err.message);
    }
  };

  const handleSubmit = async (e) => { // Login/SignUp
    e.preventDefault();

    if (!atLogin) { // Sign Up
      try {
        const salt = await bcrypt.genSalt(10); // Generate a salt for hashing
        const hashedPassword = await bcrypt.hash(newUser.password, salt); // Hash the password

        const {
          data: { user },
          error,
        } = await supabase.auth.signUp({ // Sign up the user
          email: newUser.email, // User's email
          password: newUser.password, // User's password
          options: { // Options for the sign up
            data: { name: newUser.name }, // User's name
            emailRedirectTo: `${window.location.origin}/auth-callback`, // Redirect to this URL after sign up 
          },
        });

        if (error) throw error;

        await handleUserCreation(user, true, { // Handle user creation
          ...newUser, // Spread the newUser state
          password: hashedPassword, // Use the hashed password
        });

        alert("Sign up successful!");
        history.back(); // Go back to the previous page
      } catch (error) {
        alert("Error signing up: " + error.message);
      }
    } else { // Login
      try {
        const { data: userData, error: userError } = await supabase // Fetch user data from the database
          .from("USER")
          .select("*")
          .eq("email", newUser.email); // Check if the email exists

        if (userError) throw userError;
        if (!userData || userData.length === 0)
          throw new Error("User not found"); // If user not found, throw an error
        if (userData.length > 1)
          throw new Error("Multiple users found with this email"); // If multiple users found, throw an error

        const user = userData[0]; // Get the user data
        const isMatch = await bcrypt.compare(newUser.password, user.password); // Compare the hashed password with the input password

        console.log(isMatch);
        console.log(newUser.password, user.password);

        if (!isMatch) throw new Error("Invalid password"); // If password doesn't match, throw an error

        const { error } = await supabase.auth.signInWithPassword({ // Sign in the user
          email: newUser.email, // User's email
          password: newUser.password, // User's password
        });

        if (error) throw error;
        alert("Log in successful!");
        history.back(); // Go back to the previous page
      } catch (error) {
        console.error("Login error:", error);
        alert("Login error: " + error.message);
      }
    }
  };

  return (
    <div>
      <Message />
      <div className="flex flex-row justify-evenly items-center mb-5">
        <div className="md:p-15 relative flex justify-center items-center gap-6 bg-white shadow-md rounded-xl">
          <div className="w-[80vw] md:w-[450px] h-full flex flex-col justify-center items-center gap-[30px] border-1 border-black rounded-md p-[40px]">
            <div
              id="login-signupHeader"
              className="flex flex-row justify-between items-center gap-[30px] w-full border-b-1 border-black"
            >
              <button
                onClick={() => {
                  setAtLogin(false); // Switch to sign up
                }}
                className={`text-[20px] ${atLogin ? "text-grey font-light" : "text-black font-bold"} text-nowrap`}
              >
                Sign Up
              </button>
              <span className="font-bold text-[24px] text-black">/</span>
              <button
                onClick={() => {
                  setAtLogin(true); // Switch to login
                }}
                className={`text-[20px] ${atLogin ? "text-black font-bold" : "text-grey font-light"} text-nowrap`}
              >
                Log In
              </button>
            </div>
            <div
              id="login-signupBody"
              className="flex flex-col items-center gap-[15px] w-full"
            >
              <div
                id="title"
                className="flex flex-col justify-center items-start gap-[5px] w-full"
              >
                <span className="text-black text-[24px] font-bold">
                  Find Your Passion
                </span>
                <span className="text-black text-[14px] font-light">
                  Choose a way to {atLogin ? "log in" : "sign up"}
                </span>
              </div>

              <div
                id="login-signupMethod"
                className="flex items-center gap-[30px] w-full"
              >
                <button
                  onClick={signUp} // Google Sign Up
                  className="flex justify-center items-center gap-[10px] px-[30px] py-[10px] rounded-sm border-1 border-grey w-full"
                >
                  <img
                    src="/icons/Google.png"
                    alt=""
                    className="w-[30px] h-[30px]"
                  />
                </button>
                {/* <button className="flex justify-center items-center gap-[10px] px-[30px] py-[10px] rounded-sm border-1 border-grey">
                    <img
                      src="/icons/Facebook.png"
                      alt=""
                      className="w-[30px] h-[30px]"
                    />
                  </button> */}
              </div>
            </div>

            <div
              id="or"
              className="flex justify-center items-center gap-[10px] w-full"
            >
              <div className="h-[1px] w-full bg-grey"></div>
              <span className="text-grey">or</span>
              <div className="h-[1px] w-full bg-grey"></div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col justify-center items-center gap-[15px] w-full"
            >
              <div className="flex flex-col items-start gap-[5px] w-full">
                <label htmlFor="email" className="text-black font-bold">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  required
                  type="text"
                  value={newUser.email}
                  onChange={handleInputChange}
                  className="rounded-sm border-1 border-grey p-[10px] w-full"
                  placeholder="Enter your Email"
                />
              </div>
              {atLogin === false && (
                <div className="flex flex-col justify-center items-center gap-[15px] w-full">
                  <div className="flex flex-col items-start gap-[5px] w-full">
                    <label htmlFor="name" className="text-black font-bold">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      required
                      type="text"
                      value={newUser.name}
                      onChange={handleInputChange}
                      className="rounded-sm border-1 border-grey p-[10px] w-full"
                      placeholder="Enter your Name"
                    />
                  </div>
                  <div className="flex flex-col items-start gap-[5px] w-full">
                    <label htmlFor="phoneNum" className="text-black font-bold">
                      Phone Number
                    </label>
                    <NumericFormat
                      id="phoneNum"
                      name="phone_num"
                      required
                      value={newUser.phone_num}
                      onChange={handleInputChange}
                      className="rounded-sm border-1 border-grey p-[10px] w-full"
                      placeholder="Enter your Phone Number"
                      maxLength={10}
                    />
                  </div>
                  <div className="flex flex-col items-start gap-[5px] w-full">
                    <label htmlFor="citizenID" className="text-black font-bold">
                      Citizen ID
                    </label>
                    <NumericFormat
                      id="citizenID"
                      name="citizen_id"
                      required
                      value={newUser.citizen_id}
                      onChange={handleInputChange}
                      className="rounded-sm border-1 border-grey p-[10px] w-full"
                      placeholder="Enter your Citizen ID"
                      maxLength={12}
                    />
                  </div>
                  <div className="flex flex-col items-start gap-[5px] w-full">
                    <label htmlFor="birthdate" className="text-black font-bold">
                      Birthdate
                    </label>
                    <input
                      id="birthdate"
                      name="birthdate"
                      required
                      type="date"
                      value={newUser.birthdate}
                      onChange={handleInputChange}
                      className="rounded-sm border-1 border-grey p-[10px] w-full"
                    />
                  </div>
                  <div className="flex flex-col items-start gap-[5px] w-full">
                    <div className="text-black font-bold">Gender</div>
                    <ul className="flex justify-center items-center w-full gap-5">
                      <li className="">
                        <input
                          required
                          type="radio"
                          id="male"
                          name="gender"
                          className="hidden peer"
                          value={true}
                          checked={newUser.is_man === true}
                          onChange={handleInputChange}
                        />
                        <label
                          htmlFor="male"
                          className="inline-flex items-center justify-center w-30 h-10 p-5 text-black border border-grey rounded-lg cursor-pointer peer-checked:bg-blue peer-checked:text-white hover:scale-105 active:scale-110 transition  "
                        >
                          <div className="block">
                            <span className="w-full font-semibold">Male</span>
                          </div>
                        </label>
                      </li>
                      <li>
                        <input
                          required
                          type="radio"
                          id="female"
                          name="gender"
                          className="hidden peer"
                          value={false}
                          checked={newUser.is_man === false}
                          onChange={handleInputChange}
                        />
                        <label
                          htmlFor="female"
                          className="inline-flex items-center justify-center w-30 h-10 p-5 text-black border border-grey rounded-lg cursor-pointer peer-checked:bg-blue peer-checked:text-white hover:scale-105 active:scale-110 transition  "
                        >
                          <div className="relative block overflow-hidden">
                            <span className="w-full font-semibold">Female</span>
                          </div>
                        </label>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
              <div className="flex flex-col items-start gap-[5px] w-full">
                <label htmlFor="password" className="text-black font-bold">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  required
                  type={showPassword ? "text" : "password"}
                  value={newUser.password}
                  onChange={handleInputChange}
                  className="rounded-sm border-1 border-grey p-[10px] w-full"
                  placeholder="Enter your Password"
                />
              </div>
              <div className="flex justify-between items-start w-full">
                <div className="flex justify-start items-center gap-[5px]">
                  <input
                    id="showPass"
                    type="checkbox"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                  />
                  <label
                    htmlFor="showPass"
                    className="text-[14px] font-semibold"
                  >
                    Show Password
                  </label>
                </div>
                {/* <button className="text-[14px] font-semibold">
                    Forgot Password
                  </button> */}
              </div>
              <button
                type="submit"
                className="px-[30px] py-[15px] text-white bg-black w-full rounded-sm mt-[15px]"
              >
                {atLogin ? "Log In" : "Sign Up"}
              </button>
            </form>
          </div>
          <img
            src="/img/loginPic.jpg"
            alt=""
            className={`hidden md:block w-[450px] ${atLogin ? "h-[647px]" : "h-[1093px]"} object-cover rounded-md border-1 border-black`}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginSignUp;
