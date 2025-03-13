import React, { useEffect, useState } from "react";
import HomeProduct from "./HomeProduct";
import supabase from "../supabase-client";

const HomeProductList = ({ condition }) => {
  const [motorcycles, setMotorcycles] = useState([]);

  useEffect(() => {
    const fetchMotorcycles = async () => {
      try {
        const { data, error } = await supabase
          .from("MOTORCYCLE")
          .select("*")
          .eq("condition", condition)
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        setMotorcycles(data);
      } catch (error) {
        console.error("Error fetching motorcycles:", error);
      }
    };

    fetchMotorcycles();
  }, [condition]);

  const title = condition === "New" ? "Brand New" : "Used Motorcycles";
  const description =
    condition === "New"
      ? "No miles, no worries—just pure riding joy."
      : "Pre-loved bikes with stories to tell.";

  return (
    <div className="self-stretch border-b-1 border-grey px-4 pb-5">
      <div className="flex flex-col items-start gap-1 mb-2">
        <div className="flex gap-2">
          <div className="font-bold text-[16px]">{title}</div>
          <button className="text-blue">See All</button>
        </div>
        <div className="font-light">{description}</div>
      </div>
      <div className="w-full flex justify-start items-start gap-8 overflow-hidden p-4">
        {motorcycles.map((moto) => (
          <HomeProduct key={moto.id} moto={moto} />
        ))}
      </div>
    </div>
  );
};

export default HomeProductList;