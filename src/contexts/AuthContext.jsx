import React, { useEffect, useState, useRef } from "react";
import supabase from "../supabase-client";
import UserMenu from "../components/UserMenu";

const AuthContext = () => {
  const [user, setUser] = useState(null);
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
      // Fallback manual
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/";
    }
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
            {user?.avatar_url ? (
              <img src={user.avatar_url} className="w-10 h-10 rounded-full" />
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

export default AuthContext;
