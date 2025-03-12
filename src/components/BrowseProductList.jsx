import React, { useState, useEffect } from "react";
import supabase from "../supabase-client";
import BrowseProduct from "../components/BrowseProduct";

const BrowseProductList = () => {
  const [moto, setMoto] = useState([]);

  useEffect(() => {
    const fetchMoto = async () => {
      try {
        const { data, error } = await supabase
          .from("MOTORCYCLE")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        setMoto(data);
      } catch (error) {
        console.error("Error fetching moto:", error);
      }
    };
    fetchMoto();
  }, []);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:flex flex-col gap-5 md:gap-3.5 items-stretch justify-between ">
        {moto.map((moto) => (
          <BrowseProduct key={moto.id} moto={moto} />
        ))}
      </div>
    </div>
  );
};

export default BrowseProductList;
