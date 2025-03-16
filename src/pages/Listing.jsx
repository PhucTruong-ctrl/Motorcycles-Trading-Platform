import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import supabase from "../supabase-client";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

const Listing = () => {
  const { uid } = useParams();
  const [moto, setMoto] = useState([]);
  const [currentUser, setCurrentUser] = useState(null); // Thêm state cho người dùng hiện tại
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch người dùng hiện tại từ session
    const fetchCurrentUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setCurrentUser(session?.user || null);
    };

    // Fetch danh sách xe máy
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

  // Hàm xử lý xóa sản phẩm
  const handleDelete = async (motoId) => {
    try {
      const { error } = await supabase
        .from("MOTORCYCLE")
        .delete()
        .eq("id", motoId);

      if (!error) {
        // Cập nhật danh sách sau khi xóa
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
        <header className="mb-5">
          <Header />
        </header>
        <div className="w-full flex justify-start items-start gap-8 overflow-hidden p-4">
          {moto.map((motoItem) => (
            <ProductCard
              key={motoItem.id}
              moto={motoItem}
              currentUserId={currentUser?.id}
              isOwnerPage={uid === currentUser?.id}
              onDelete={handleDelete} // Truyền hàm xử lý xóa xuống
            />
          ))}
        </div>
        <div className="mt-5">
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default Listing;
