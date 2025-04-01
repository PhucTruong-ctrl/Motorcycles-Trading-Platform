import React, { useEffect, useState } from "react";
import supabase from "../supabase-client";
import { Link, useNavigate } from "react-router";

const UserMenu = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const signOut = async () => {
    try {
      localStorage.removeItem(
        "sb-" + supabase.auth.currentSession?.user.id + "-auth-token"
      );
      sessionStorage.clear();

      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      setCurrentUser(null);
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Error signing out:", error);

      localStorage.clear();
      sessionStorage.clear();
      navigate("/");
      window.location.reload();
    }
  };
  useEffect(() => {
    const fetchUserData = async () => {
      const { data: userData, error } = await supabase
        .from("USER")
        .select("*")
        .eq("uid", user.id)
        .single();

      if (error) {
        console.error("Error fetching user data:", error);
      } else {
        setCurrentUser(userData);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="absolute right-0 p-5 flex flex-col gap-5 w-fit shadow-md bg-white rounded-[6px] z-10">
        <div className="max-w-70 w-fit flex flex-row justify-start items-center gap-2.5">
          <img
            src={currentUser?.avatar_url}
            alt=""
            className="min-w-15 min-h-15 max-w-15 max-h-15 rounded-full object-fill"
          />
          <div className="w-full font-semibold text-xl text-nowrap">
            {currentUser?.name || currentUser?.email}
          </div>
        </div>

        <Link
          to={`/profile/${currentUser.uid}`}
          className="w-full text-[16px] text-nowrap text-left rounded-[6px] flex flex-row gap-1 p-2 hover:bg-[#efeeee] hover:shadow-md transition"
        >
          <img className="w-6 h-6" src="/icons/User.svg" alt="" />{" "}
          <span className="text-black text-[16px]">Profile</span>
        </Link>

        <Link
          to={`/listing/${currentUser.uid}`}
          className="w-full text-[16px] text-nowrap text-left rounded-[6px] flex flex-row gap-1 p-2 hover:bg-[#efeeee] hover:shadow-md transition"
        >
          <img className="w-6 h-6" src="/icons/List.svg" alt="" />
          <span className="text-black text-[16px]">Listing</span>
        </Link>

        <Link
          to={`/transaction/${currentUser.uid}`}
          className="w-full text-[16px] text-nowrap text-left rounded-[6px] flex flex-row gap-1 p-2 hover:bg-[#efeeee] hover:shadow-md transition"
        >
          <img className="w-6 h-6" src="/icons/Payment.svg" alt="" />
          <span className="text-black text-[16px]"> Transaction</span>
        </Link>

        <button
          onClick={signOut}
          className="w-full text-[16px] text-nowrap text-left rounded-[6px] flex flex-row gap-1 p-2 hover:bg-[#efeeee] hover:shadow-md transition"
        >
          <img className="w-6 h-6" src="/icons/Logout.svg" alt="" /> Sign Out
        </button>
      </div>
    </div>
  );
};

export default UserMenu;
