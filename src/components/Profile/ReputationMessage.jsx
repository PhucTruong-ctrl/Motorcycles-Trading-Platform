import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import supabase from "../../supabase-client";
import { formatDate } from "./../FormatDate";
import LoadingSmall from "../LoadingSmall";

export const ReputationMessage = ({ uid_send, created_at, message, type }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: userData, error: userError } = await supabase
          .from("USER")
          .select("*")
          .eq("uid", uid_send)
          .single();

        if (userError) throw userError;
        setUser(userData);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [uid_send, user]);

  if (loading) {
    return <LoadingSmall/>;
  }

  return (
    <div className="flex flex-col justify-between items-start gap-5 bg-white rounded-xl shadow-md p-5">
      <div className="flex flex-row gap-5">
        <img src={user.avatar_url} alt="" className="w-15 h-15 rounded-md" />
        <div className="flex flex-col">
          <Link to={`/${user.uid}/profile`}>
            <div className="font-bold text-[16px] text-blue">{user.name}</div>
          </Link>
          <div className="text-[16px] text-grey">{formatDate(created_at)}</div>
        </div>
      </div>
      {message}
      <div className="self-end">
        {type === "Positive" ? (
          <img src="/icons/ThumbUp.svg" alt="Thumbs Up" className="w-8 h-8" />
        ) : (
          <img
            src="/icons/ThumbDown.svg"
            alt="Thumbs Down"
            className="w-8 h-8"
          />
        )}
      </div>
    </div>
  );
};
