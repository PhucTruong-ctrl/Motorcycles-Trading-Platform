import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import supabase from "../supabase-client";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { Message } from "../components/Message";

const Listing = () => {
  const { uid } = useParams();
  const [moto, setMoto] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setCurrentUser(session?.user || null);
    };

    const fetchMotoData = async () => {
      try {
        const { data: motoData, error: motoError } = await supabase
          .from("MOTORCYCLE")
          .select("*")
          .eq("uid", uid)
          .order("created_at", { ascending: false });

        if (motoError) throw motoError;
        setMoto(motoData || []);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
    fetchMotoData();
  }, [uid]);

  const handleDelete = async (motoId) => {
    try {
      const { error } = await supabase
        .from("MOTORCYCLE")
        .delete()
        .eq("id", motoId);

      if (!error) {
        setMoto(moto.filter((item) => item.id !== motoId));
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <main className="my-[15px] mx-[25px]">
        <Message />
        <header className="mb-5">
          <Header />
        </header>
        <div className="w-full flex justify-start items-start gap-8 overflow-hidden p-4">
          {moto.map(
            (motoItem) =>
              moto.is_sold === false && (
                <ProductCard
                  key={motoItem.id}
                  moto={motoItem}
                  currentUserId={currentUser?.id}
                  isOwnerPage={uid === currentUser?.id}
                  onDelete={handleDelete}
                />
              )
          )}
        </div>
        <div className="mt-5">
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default Listing;
