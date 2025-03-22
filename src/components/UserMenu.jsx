import React, { useEffect, useState } from "react";
import supabase from "../supabase-client";
import { Link, useNavigate } from "react-router";

const UserMenu = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) navigate("/");
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
      <div className="absolute right-0 p-5 flex flex-col gap-5 w-70 shadow-md bg-white rounded-[6px] z-10">
        <div className="flex flex-row justify-start items-center gap-5">
          <img
            src={currentUser?.avatar_url}
            alt=""
            className="w-15 h-15 rounded-full object-fill"
          />
          <div className="w-full font-semibold text-xl text-nowrap">
            {currentUser?.name || currentUser?.email}
          </div>
        </div>
        <Link
          to={`/${currentUser.uid}/profile`}
          className="w-full text-[16px] text-nowrap text-left rounded-[6px] flex flex-row gap-1 p-2 hover:bg-[#efeeee] hover:shadow-md transition"
        >
          <img className="w-6 h-6" src="/icons/User.svg" alt="" /> My Profile
        </Link>
        <Link
          to={`/${currentUser.uid}/listing`}
          className="w-full text-[16px] text-nowrap text-left rounded-[6px] flex flex-row gap-1 p-2 hover:bg-[#efeeee] hover:shadow-md transition"
        >
          <img className="w-6 h-6" src="/icons/List.svg" alt="" /> View My
          Listing
        </Link>
        {/* <Link
          to={`/${currentUser.uid}/purchases-history`}
          className="w-full text-[16px] text-nowrap text-left rounded-[6px] flex flex-row gap-1 p-2 hover:bg-[#efeeee] hover:shadow-md transition"
        >
          <img className="w-6 h-6" src="icons/HistoryBlack.svg" alt="" />{" "}
          Purchases History
        </Link> */}
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
