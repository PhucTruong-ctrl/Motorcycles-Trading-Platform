import React, { useState, useEffect, useCallback } from "react";
import supabase from "../supabase-client";
import Header from "../components/Header";
import Footer from "../components/Footer";

const LoginSignUp = () => {
  const [atLogin, setAtLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    name: "",
    birthdate: "",
    is_man: null,
    phone_num: "",
    citizen_id: "",
  });

  const uploadAvatarToSupabase = useCallback(async (imageUrl, userId) => {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error("Failed to fetch image");

      const contentType = response.headers.get("Content-Type");
      const fileExt = contentType?.split("/")[1] || "jpg";
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const blob = await response.blob();

      const folderPath = `${userId}/${fileName}`;
      const { data, error } = await supabase.storage
        .from("user-media")
        .upload(folderPath, blob, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from("user-media").getPublicUrl(data.path);

      return publicUrl;
    } catch (error) {
      console.error("Error uploading avatar:", error);
      return null;
    }
  }, []);

  const handleUserCreation = useCallback(
    async (user, isEmailSignup = false) => {
      try {
        const { data: existingUser, error: selectError } = await supabase
          .from("USER")
          .select("*")
          .eq("email", user.email)
          .maybeSingle();

        if (selectError) throw selectError;

        if (!existingUser) {
          let avatarUrl =
            user.user_metadata?.avatar_url ||
            user.user_metadata?.picture?.data?.url;

          if (avatarUrl) {
            avatarUrl = await uploadAvatarToSupabase(avatarUrl, user.id);
          }
          const userName = isEmailSignup
            ? newUser.name
            : user.user_metadata?.full_name || user.email.split("@")[0];

          const { error: insertError } = await supabase
            .from("USER")
            .insert([
              {
                uid: user.id,
                email: user.email,
                name: userName,
                avatar_url: avatarUrl,
                phone_num: isEmailSignup ? newUser.phone_num : null,
                citizen_id: isEmailSignup ? newUser.citizen_id : null,
                birthdate: isEmailSignup ? newUser.birthdate : null,
                is_man: isEmailSignup ? newUser.is_man : null,
                password: isEmailSignup ? newUser.password : null,
                badge: "New to the market!",
              },
            ])
            .single();

          if (insertError) throw insertError;
        }
      } catch (error) {
        console.error("Error in handleUserCreation:", error);
        throw error;
      }
    },
    [uploadAvatarToSupabase, newUser]
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        handleUserCreation(session.user);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        handleUserCreation(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [handleUserCreation]);

  useEffect(() => {
    if (atLogin) {
      document.title = "Login";
    } else {
      document.title = "Sign Up";
    }
  }, [atLogin]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "radio") {
      setNewUser({
        ...newUser,
        is_man: value === "true" ? true : false,
      });
    } else {
      setNewUser({
        ...newUser,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const signUp = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          queryParams: {
            prompt: "select_account",
          },
          redirectTo: window.location.origin,
        },
      });

      if (error) throw error;
    } catch (err) {
      console.error("Google login error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!atLogin) {
      try {
        const { data: authData, error: authError } = await supabase.auth.signUp(
          {
            email: newUser.email,
            password: newUser.password,
            options: {
              data: {
                name: newUser.name,
              },
            },
          }
        );

        if (authError) throw authError;

        await handleUserCreation(authData.user, true);
        alert("Sign up successful! Please check email to verify your account.");
      } catch (error) {
        console.error("Sign up error: ", error);
        alert("Sign up error: " + error.message);
      }
    } else {
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email: newUser.email,
          password: newUser.password,
        });

        if (error) throw error;
        alert("Log in successful!");
        window.location.href = "/";
      } catch (error) {
        console.error("Login error:", error);
        alert("Login error:", error);
      }
    }
  };

  return (
    <div>
      <main className="my-[15px] mx-[25px]">
        <div className="mb-5">
          <Header />
        </div>
        <div className="flex flex-row justify-evenly items-center mb-5">
          <div className="md:p-15 relative flex justify-center items-center gap-6 bg-white shadow-md rounded-xl">
            <div className="w-full md:w-[450px] h-full flex flex-col justify-start items-center gap-[30px] border-1 border-black rounded-md p-[40px]">
              <div
                id="login-signupHeader"
                className="flex flex-row justify-between items-center gap-[30px] self-stretch border-b-1 border-black"
              >
                <button
                  onClick={() => {
                    setAtLogin(false);
                  }}
                  className={`text-[20px] ${atLogin ? "text-grey font-light" : "text-black font-bold"} text-nowrap`}
                >
                  Sign Up
                </button>
                <span className="font-bold text-[24px] text-black">/</span>
                <button
                  onClick={() => {
                    setAtLogin(true);
                  }}
                  className={`text-[20px] ${atLogin ? "text-black font-bold" : "text-grey font-light"} text-nowrap`}
                >
                  Log In
                </button>
              </div>
              <div
                id="login-signupBody"
                className="flex flex-col items-center gap-[15px] self-stretch"
              >
                <div
                  id="title"
                  className="flex flex-col justify-center items-start gap-[5px] self-stretch"
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
                    onClick={signUp}
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
                className="flex justify-center items-center gap-[10px] self-stretch"
              >
                <div className="h-[1px] w-full bg-grey"></div>
                <span className="text-grey">or</span>
                <div className="h-[1px] w-full bg-grey"></div>
              </div>

              <form
                onSubmit={handleSubmit}
                className="flex flex-col justify-center items-center gap-[15px] w-full"
              >
                <div className="flex flex-col items-start gap-[5px] self-stretch">
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
                    <div className="flex flex-col items-start gap-[5px] self-stretch">
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
                    <div className="flex flex-col items-start gap-[5px] self-stretch">
                      <label
                        htmlFor="phoneNum"
                        className="text-black font-bold"
                      >
                        Phone Number
                      </label>
                      <input
                        id="phoneNum"
                        name="phone_num"
                        required
                        type="text"
                        value={newUser.phone_num}
                        onChange={handleInputChange}
                        className="rounded-sm border-1 border-grey p-[10px] w-full"
                        placeholder="Enter your Phone Number"
                      />
                    </div>
                    <div className="flex flex-col items-start gap-[5px] self-stretch">
                      <label
                        htmlFor="citizenID"
                        className="text-black font-bold"
                      >
                        Citizen ID
                      </label>
                      <input
                        id="citizenID"
                        name="citizen_id"
                        required
                        type="text"
                        value={newUser.citizen_id}
                        onChange={handleInputChange}
                        className="rounded-sm border-1 border-grey p-[10px] w-full"
                        placeholder="Enter your Citizen ID"
                      />
                    </div>
                    <div className="flex flex-col items-start gap-[5px] self-stretch">
                      <label
                        htmlFor="birthdate"
                        className="text-black font-bold"
                      >
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
                    <div className="flex flex-col items-start gap-[5px] self-stretch">
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
                              <span className="w-full font-semibold">
                                Female
                              </span>
                            </div>
                          </label>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
                <div className="flex flex-col items-start gap-[5px] self-stretch">
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
                <div className="flex justify-between items-start self-stretch">
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
              className={`hidden md:block w-[450px] ${atLogin ? "h-[647px]" : "h-[1003px]"} object-cover rounded-md border-1 border-black`}
            />
          </div>
        </div>
        <div>
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default LoginSignUp;
