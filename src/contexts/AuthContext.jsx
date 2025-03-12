import React, { useEffect, useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import supabase from "../supabase-client";

const AuthContext = () => {
  const [session, setSession] = useState(null);

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

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
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
      <button onClick={signOut} className="text-[18px] md:text-2xl text-nowrap">
        <img
          src="/icons/Logout.svg"
          className="w-[39px] h-[42px] block md:hidden"
        ></img>
        <span className="hidden md:block">
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
    );
  }
};

export default AuthContext;
