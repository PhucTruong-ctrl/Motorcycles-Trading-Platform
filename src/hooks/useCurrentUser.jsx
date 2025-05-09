import { useState, useEffect } from "react";
import supabase from "../lib/supabase-client";

export const useCurrentUser = () => { // Custom hook to get the current user
  const [currentUser, setCurrentUser] = useState(null); // State to hold the current user

  useEffect(() => { // Effect to fetch the current user session
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setCurrentUser(session?.user || null); // Set the current user to the session user or null
    };

    fetchSession(); // Fetch the session on component mount

    const { // Subscribe to auth state changes
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => { // Listen for auth state changes
      setCurrentUser(session?.user || null); // Update the current user based on the session
    });

    return () => {
      subscription.unsubscribe();
    }; // Cleanup function to unsubscribe from auth state changes
  }, []);

  return currentUser;
};
