import React, { useEffect, useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import supabase from "../supabase-client";

const AuthContext = () => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Lấy session hiện tại khi component được render
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Lắng nghe sự kiện thay đổi trạng thái đăng nhập
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Hủy đăng ký lắng nghe khi component unmount
    return () => subscription.unsubscribe();
  }, []);

  // Hàm kiểm tra và thêm user mới vào bảng USER
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

  // Hàm đăng xuất
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
  };

  // Hàm đăng nhập bằng Google
  const signUp = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      console.error("Error signing in with Google:", error);
      return;
    }

    // Lấy thông tin user sau khi đăng nhập thành công
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Kiểm tra và thêm user vào bảng USER
      await handleUserCreation(user);
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
      <button onClick={signOut} className="text-[18px] md:text-2xl text-nowrap">
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
    );
  }
};

export default AuthContext;