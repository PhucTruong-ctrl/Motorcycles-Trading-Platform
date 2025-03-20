import React from "react";
import supabase from "../supabase-client";
import { Link, useNavigate } from "react-router";

const UserMenu = ({ user }) => {
  const navigate = useNavigate();
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) navigate("/");
  };

  return (
    <div>
      <div className="absolute right-0 p-5 flex flex-col gap-5 w-70 shadow-md bg-white rounded-[6px]">
        <div className="flex flex-row justify-start items-center gap-5">
          <img
            src={user?.avatar_url}
            alt=""
            className="w-15 h-15 rounded-full object-fill"
          />
          <div className="w-full font-semibold text-xl text-nowrap">
            {user?.name || user?.email}
          </div>
        </div>
        <Link
          to={`/${user.uid}/profile`}
          className="w-full text-[16px] text-nowrap text-left rounded-[6px] flex flex-row gap-1 p-2 hover:bg-[#efeeee] hover:shadow-md transition"
        >
          <img className="w-6 h-6" src="icons/User.svg" alt="" /> My Profile
        </Link>
        <Link
          to={`/${user.uid}/edit-info`}
          className="w-full text-[16px] text-nowrap text-left rounded-[6px] flex flex-row gap-1 p-2 hover:bg-[#efeeee] hover:shadow-md transition"
        >
          <img className="w-6 h-6" src="icons/Edit.svg" alt="" /> Edit
          information
        </Link>
        <Link
          to={`/${user.uid}/listing`}
          className="w-full text-[16px] text-nowrap text-left rounded-[6px] flex flex-row gap-1 p-2 hover:bg-[#efeeee] hover:shadow-md transition"
        >
          <img className="w-6 h-6" src="icons/List.svg" alt="" /> View My
          Listing
        </Link>
        <Link
          to={`/${user.uid}/purchases-history`}
          className="w-full text-[16px] text-nowrap text-left rounded-[6px] flex flex-row gap-1 p-2 hover:bg-[#efeeee] hover:shadow-md transition"
        >
          <img className="w-6 h-6" src="icons/HistoryBlack.svg" alt="" />{" "}
          Purchases History
        </Link>
        <button
          onClick={signOut}
          className="w-full text-[16px] text-nowrap text-left rounded-[6px] flex flex-row gap-1 p-2 hover:bg-[#efeeee] hover:shadow-md transition"
        >
          <img className="w-6 h-6" src="icons/Logout.svg" alt="" /> Sign Out
        </button>
      </div>
    </div>
  );
};

export default UserMenu;
