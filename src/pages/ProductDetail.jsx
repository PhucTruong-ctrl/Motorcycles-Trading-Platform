import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import supabase from "../supabase-client";
import Header from "../components/Header";
import Footer from "../components/Footer";

const MotoDetail = () => {
  const { uid, id } = useParams(); // Lấy uid và id từ URL
  const [moto, setMoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMoto = async () => {
      try {
        // Fetch sản phẩm từ Supabase dựa trên uid và id
        const { data, error } = await supabase
          .from("MOTORCYCLE")
          .select("*")
          .eq("uid", uid)
          .eq("id", id)
          .single();

        if (error) {
          throw error;
        }

        setMoto(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching moto:", error);
        setError(error);
        setLoading(false);
      }
    };

    fetchMoto();
  }, [uid, id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!moto) {
    return <div>Moto not found.</div>;
  }

  return (
    <div>
      <main className="my-[15px] mx-[25px]">
        <header className="mb-5">
          <Header />
        </header>

        <div className="font-light ">
          {moto.type} / {moto.brand} / {moto.model} / {moto.trim} / {moto.year}
        </div>

        <div className="w-[700px] h-[600px]">
          <img src={moto.image_url} alt="" />
        </div>

        <div className="mb-5">
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default MotoDetail;
