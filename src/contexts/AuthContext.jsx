import React, { useEffect, useState, useRef } from "react";
import supabase from "../supabase-client";
import UserMenu from "../components/UserMenu";

const AuthContext = () => {
  const [session, setSession] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);

      if (session) {
        handleUserCreation(session.user);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);

      if (session) {
        handleUserCreation(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Nếu menu đang mở và click xảy ra bên ngoài menu
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false); // Đóng menu
      }
    };

    // Thêm sự kiện lắng nghe
    document.addEventListener("mousedown", handleClickOutside);

    // Dọn dẹp sự kiện khi component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]); // Chỉ chạy lại khi isMenuOpen thay đổi

  const handleUserCreation = async (user) => {
    const { data: existingUser, error: selectError } = await supabase

      .from("USER")

      .select("*")

      .eq("email", user.email)

      .single();

    if (!existingUser) {
      const { data: newUser, error: insertError } = await supabase

        .from("USER")

        .insert([
          {
            uid: user.id,

            email: user.email,

            name: user.user_metadata.full_name,

            avatar_url: user.user_metadata.avatar_url,
          },
        ])

        .single();

      if (insertError) {
        console.error("Error inserting user:", insertError);
      } else {
        console.log("User created:", newUser);
      }
    } else {
      console.log("User already exists:", existingUser);
    }
  };

  const signUp = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  if (!session) {
    return (
      <button onClick={signUp} className="text-[18px] md:text-2xl text-nowrap">
        <img
          src="/icons/User.svg"
          className="w-[39px] h-[42px] block md:hidden"
        ></img>

        <span className="hidden md:block">Sign In</span>
      </button>
    );
  } else {
    return (
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-[18px] md:text-2xl text-nowrap"
        >
          <span>
            {session?.user?.user_metadata?.avatar_url ? (
              <img
                src={session.user.user_metadata.avatar_url}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <span>{session?.user?.email}</span>
            )}
          </span>
        </button>
        {isMenuOpen && <UserMenu user={session.user} />}
      </div>
    );
  }
};

export default AuthContext;
