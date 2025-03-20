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
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const uploadAvatarToSupabase = async (imageUrl, userId) => {
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
  };

  const handleUserCreation = async (user) => {
    try {
      const { data: existingUser, error: selectError } = await supabase
        .from("USER")
        .select("*")
        .eq("email", user.email)
        .maybeSingle();

      if (selectError) throw selectError;

      if (!existingUser) {
        let avatarUrl = user.user_metadata.avatar_url;

        if (avatarUrl) {
          const newAvatarUrl = await uploadAvatarToSupabase(avatarUrl, user.id);
          if (newAvatarUrl) avatarUrl = newAvatarUrl;
        }

        const { error: insertError } = await supabase
          .from("USER")
          .insert([
            {
              uid: user.id,
              email: user.email,
              name: user.user_metadata.full_name,
              avatar_url: avatarUrl,
            },
          ])
          .single();

        if (insertError) throw insertError;
      }
    } catch (error) {
      console.error("Error in handleUserCreation:", error);
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
