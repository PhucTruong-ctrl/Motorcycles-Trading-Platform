import React, { useEffect, useState } from "react";
import supabase from "../../lib/supabase-client";
import { Link } from "react-router";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import Loading from "./Loading";

const UserMenu = () => {
  const currentUser = useCurrentUser();
  const [userDetail, setUserDetail] = useState(null);
  const signOut = async () => {
    try {
      localStorage.removeItem(
        "sb-" + supabase.auth.currentSession?.user.id + "-auth-token"
      );
      sessionStorage.clear();

      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      history.back();
      window.location.reload();
    } catch (error) {
      console.error("Error signing out:", error);

      localStorage.clear();
      sessionStorage.clear();
      history.back();
      window.location.reload();
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;
      const { data: userData, error } = await supabase
        .from("USER")
        .select("*")
        .eq("uid", currentUser.id)
        .single();

      if (error) throw error;
      setUserDetail(userData);
    };
    fetchUserData();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="absolute right-0 p-5 flex flex-col gap-5 w-20 h-20 shadow-md bg-white rounded-[6px] z-10">
        {" "}
        <Loading />
      </div>
    );
  }

  return (
    <div className="absolute right-0 p-5 flex flex-col gap-5 w-fit shadow-md bg-white rounded-[6px] z-1001">
      <div className="max-w-70 w-fit flex flex-row justify-start items-center gap-2.5">
        <img
          src={userDetail?.avatar_url}
          alt=""
          className="min-w-15 min-h-15 max-w-15 max-h-15 rounded-full object-fill"
        />
        <div className="w-full font-semibold text-xl text-nowrap">
          {userDetail?.name || userDetail?.email}
        </div>
      </div>

      <Link
        to={`/profile/${currentUser.id}`}
        className="w-full text-[16px] text-nowrap text-left rounded-[6px] flex flex-row gap-1 p-2 hover:bg-[#efeeee] hover:shadow-md transition"
      >
        <img className="w-6 h-6" src="/icons/User.svg" alt="" />{" "}
        <span className="text-black text-[16px]">Profile</span>
      </Link>

      <Link
        to={`/listing/${currentUser.id}`}
        className="w-full text-[16px] text-nowrap text-left rounded-[6px] flex flex-row gap-1 p-2 hover:bg-[#efeeee] hover:shadow-md transition"
      >
        <img className="w-6 h-6" src="/icons/List.svg" alt="" />
        <span className="text-black text-[16px]">Listing</span>
      </Link>

      <Link
        to={`/transaction/${currentUser.id}`}
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
  );
};

export default UserMenu;
