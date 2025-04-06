import { useEffect } from "react";
import { useNavigate } from "react-router";
import supabase from "../supabase-client";
import { handleUserCreation } from "./utils/authUtils";
import LoadingFull from "./LoadingFull";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        navigate("/account");
        return;
      }

      try {
        await handleUserCreation(session.user);
        navigate("/", { replace: true });
      } catch (err) {
        console.error("User handling failed:", err);
        navigate("/account?error=auth_failed");
      }
    };

    checkSession();
  }, [navigate]);

  return <LoadingFull />; 
};

export default AuthCallback;
