import React, { useState, useEffect } from "react";
import supabase from "../supabase-client";
import BrowseProduct from "../components/BrowseProduct";
import { useLocation } from "react-router";
import queryString from "query-string";

const BrowseProductList = () => {
  const [moto, setMoto] = useState([]);
  const location = useLocation();
  const queryParams = queryString.parse(location.search);

  useEffect(() => {
    const fetchMoto = async () => {
      try {
        const filter = {};
        if (queryParams.type) filter.type = queryParams.type;
        if (queryParams.brand) filter.brand = queryParams.brand;
        if (queryParams.model) filter.model = queryParams.model;
        if (queryParams.trim) filter.trim = queryParams.trim;
        if (queryParams.condition) filter.condition = queryParams.condition;

        const { data, error } = await supabase
          .from("MOTORCYCLE")
          .select(
            `
            *,
            USER (*)
          `
          )
          .match(filter)
          .gte("price", queryParams.price_min || 0)
          .lte("price", queryParams.price_max || 100000)
          .gte("year", queryParams.year_min || 1895)
          .lte("year", queryParams.year_max || 2025)
          .gte("mile", queryParams.mileage_min || 0)
          .lte("mile", queryParams.mileage_max || 100000)
          .gte("engine_size", queryParams.engine_size_min || 0)
          .lte("engine_size", queryParams.engine_size_max || 100000)
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
  }, [
    location.search,
    queryParams.brand,
    queryParams.condition,
    queryParams.engine_size_max,
    queryParams.engine_size_min,
    queryParams.mileage_max,
    queryParams.mileage_min,
    queryParams.model,
    queryParams.price_max,
    queryParams.price_min,
    queryParams.trim,
    queryParams.type,
    queryParams.year_max,
    queryParams.year_min,
  ]);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:flex flex-col gap-5 md:gap-3.5 items-stretch justify-between ">
        {moto.map((moto) => (
          <BrowseProduct key={moto.id} moto={moto} user={moto.USER} />
        ))}
      </div>
    </div>
  );
};

export default BrowseProductList;
