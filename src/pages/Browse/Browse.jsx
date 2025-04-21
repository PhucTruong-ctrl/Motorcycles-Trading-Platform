import React, { useEffect } from "react";
import FilterBar from "./components/FilterBar";
import ProductList from "./components/ProductList";
import { Message } from "../../components/forms/Message";

const BrowsingPage = () => {
  useEffect(() => {
    document.title = "Browse";
  }, []);
  return (
    <div>
       <Message />
      <div className="flex flex-col justify-center items-center gap-3.5 mb-5">
        <div className="flex flex-col md:flex-row self-stretch gap-3.5 pb-4">
          {/* Filter bar */}
          <FilterBar />

          <ProductList />
        </div>
      </div>
    </div>
  );
};
export default BrowsingPage;
