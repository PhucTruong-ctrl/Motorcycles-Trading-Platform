import React, { useState, useEffect } from "react";
import HomeBrand from "./HomeBrand";
import supabase from "../supabase-client";

const HomeBrandList = () => {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const { data, error } = await supabase
          .from("BRAND")
          .select("*")
          .order("id", { ascending: false });

        if (error) {
          throw error;
        }

        setBrands(data);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchBrands();
  }, []);

  return (
    <div className="w-full flex justify-center border-b-1 border-grey ">
      <div className="flex justify-start items-start overflow-hidden px-4 pb-5 gap-8">
        {brands.map((brd) => (
          <HomeBrand key={brd.id} brand={brd} />
        ))}
      </div>
    </div>
  );
};

export default HomeBrandList;
