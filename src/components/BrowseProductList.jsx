import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import queryString from "query-string";
import ReactPaginate from "react-paginate";
import supabase from "../supabase-client";
import BrowseProduct from "./BrowseProduct";

const BrowseProductList = () => {
  const [moto, setMoto] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const maxItems = 10;
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  const currentPage = parseInt(queryParams.page) - 1 || 0;

  useEffect(() => {
    const fetchMoto = async () => {
      setLoading(true);
      try {
        const filter = {};
        if (queryParams.type) filter.type = queryParams.type;
        if (queryParams.brand) filter.brand = queryParams.brand;
        if (queryParams.model) filter.model = queryParams.model;
        if (queryParams.trim) filter.trim = queryParams.trim;
        if (queryParams.condition) filter.condition = queryParams.condition;

        // Count query
        const countQuery = supabase
          .from("MOTORCYCLE")
          .select("*", { count: "exact", head: true })
          .match(filter)
          .gte("price", queryParams.price_min || 0)
          .lte("price", queryParams.price_max || 100000)
          .gte("year", queryParams.year_min || 1895)
          .lte("year", queryParams.year_max || 2025)
          .gte("mile", queryParams.mileage_min || 0)
          .lte("mile", queryParams.mileage_max || 100000)
          .gte("engine_size", queryParams.engine_size_min || 0)
          .lte("engine_size", queryParams.engine_size_max || 100000);

        const { count, error: countError } = await countQuery;

        if (countError) throw countError;

        const totalPages = Math.ceil(count / maxItems);
        setPageCount(totalPages);

        // Data query
        const { data, error } = await supabase
          .from("MOTORCYCLE")
          .select(`*, USER (*)`)
          .match(filter)
          .gte("price", queryParams.price_min || 0)
          .lte("price", queryParams.price_max || 100000)
          .gte("year", queryParams.year_min || 1895)
          .lte("year", queryParams.year_max || 2025)
          .gte("mile", queryParams.mileage_min || 0)
          .lte("mile", queryParams.mileage_max || 100000)
          .gte("engine_size", queryParams.engine_size_min || 0)
          .lte("engine_size", queryParams.engine_size_max || 100000)
          .order("created_at", { ascending: false })
          .range(currentPage * maxItems, (currentPage + 1) * maxItems - 1);

        if (error) throw error;

        setMoto(data || []);
      } catch (error) {
        console.error("Error fetching moto:", error);
      } finally {
        setLoading(false);
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
    currentPage,
  ]);

  const handlePageChange = ({ selected }) => {
    const currentQuery = queryString.parse(location.search);
    const updatedQuery = {
      ...currentQuery,
      page: selected + 1,
    };

    navigate(`/browse?${queryString.stringify(updatedQuery)}`, {
      replace: true,
    });
  };

  return (
    <div className="w-full flex flex-col gap-5 justify-start items-center">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:flex flex-col gap-5 md:gap-3.5 items-stretch justify-between">
            {moto.map((moto) => (
              <BrowseProduct key={moto.id} moto={moto} user={moto.USER} />
            ))}
          </div>

          <ReactPaginate
            previousLabel={"< Previous"}
            nextLabel={"Next >"}
            pageCount={pageCount}
            onPageChange={handlePageChange}
            forcePage={currentPage}
            pageRangeDisplayed={3}
            marginPagesDisplayed={2}
            pageClassName="page-item w-[50px] h-[50px] border-1 border-grey flex justify-center items-center font-bold rounded-md cursor-pointer active:scale-110 transition"
            pageLinkClassName="page-link w-full h-full flex justify-center items-center"
            previousClassName="page-item w-[100px] h-[50px] border-1 border-grey flex justify-center items-center font-bold rounded-md cursor-pointer active:scale-110 transition"
            previousLinkClassName="page-link w-full h-full flex justify-center items-center"
            nextClassName="page-item w-[100px] h-[50px] border-1 border-grey flex justify-center items-center font-bold rounded-md cursor-pointer active:scale-110 transition"
            nextLinkClassName="page-link w-full h-full flex justify-center items-center"
            breakLabel="..."
            breakClassName="page-item"
            breakLinkClassName="page-link"
            containerClassName="pagination flex flex-row gap-2"
            activeClassName="active bg-blue text-white"
            renderOnZeroPageCount={null}
          />
        </>
      )}
    </div>
  );
};

export default BrowseProductList;
