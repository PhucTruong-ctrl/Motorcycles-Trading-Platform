import { useEffect } from "react";
import { useNavigate } from "react-router";
import supabase from "../supabase-client";
import { handleUserCreation } from "./authUtils";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        navigate("/login");
        return;
      }

      if (session) {
        try {
          await handleUserCreation(session.user);
          navigate("/");
        } catch (err) {
          console.error("User creation failed:", err);
          navigate("/login");
        }
      } else {
        navigate("/login");
      }
    };

    checkSession();
  }, [navigate]);

  return <div>Loading...</div>;
};

export default AuthCallback;
