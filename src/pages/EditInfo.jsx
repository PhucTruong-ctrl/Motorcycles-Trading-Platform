import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import supabase from "../supabase-client";
import Header from "../components/Header";
import Footer from "../components/Footer";

const EditInfo = () => {
  const { uid } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: userData, error: userError } = await supabase
          .from("USER")
          .select("*")
          .eq("uid", uid)
          .single();

        if (userError) throw userError;

        setUser(userData);

      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [uid, user]);

  return (
    <div>
      <main className="my-[15px] mx-[25px]">
        <header className="mb-5">
          <Header />
        </header>
        <div>{user?.name}</div>
        <div className="mt-5">
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default EditInfo;
