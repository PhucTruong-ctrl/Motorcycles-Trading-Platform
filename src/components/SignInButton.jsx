import React, { useEffect, useState, useRef } from "react";
import supabase from "../supabase-client";
import UserMenu from "./UserMenu";
import { Link } from "react-router";

const SignInButton = () => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const signOut = async () => {
    try {
      localStorage.removeItem("sb-" + session?.user.id + "-auth-token");
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setSession(null);
      setUser(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Sign out error:", error);
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/";
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user) return;

      const { data: userData, error } = await supabase
        .from("USER")
        .select("avatar_url")
        .eq("uid", session.user.id)
        .single();

      if (error) {
        console.error("Error fetching user data:", error);
      } else {
        setUser(userData);
      }
    };

    fetchUserData();
  }, [session]);

  if (!session) {
    return (
      <Link to="/account">
        <button className="text-[18px] md:text-2xl text-nowrap hover:underline hover:scale-105 hover:font-semibold transition">
          <img
            src="/icons/User.svg"
            className="w-[39px] h-[42px] block md:hidden"
          ></img>

          <span className="hidden md:block">Sign In</span>
        </button>
      </Link>
    );
  } else {
    return (
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-[18px] md:text-2xl text-nowrap"
        >
          <span>
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                className="w-10 h-10 rounded-full hover:outline-1 hover:scale-105 transition"
              />
            ) : (
              <span>{session.user?.email}</span>
            )}
          </span>
        </button>
        {isMenuOpen && <UserMenu user={session.user} signOut={signOut} />}
      </div>
    );
  }
};

export default SignInButton;
