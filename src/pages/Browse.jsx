import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FilterBar from "../components/FilterBar";
import BrowseProduct from "../components/BrowseProduct";

const BrowsingPage = () => {
  return (
    <div>
      <main className="my-[15px] mx-[25px]">
        <div className="mb-5">
          <Header />
        </div>
        <div className="flex flex-col md:flex-row items-center md:items-start justify-center md:justify-start self-stretch gap-3.5 pb-4">
          {/* Filter bar */}
          <FilterBar />

          {/* Product list */}
          <div className="flex flex-col items-center self-stretch gap-3.5 ">
            <BrowseProduct />
            <BrowseProduct />
            <BrowseProduct />
            <BrowseProduct />
            <BrowseProduct />
            <BrowseProduct />
            <BrowseProduct />
            <BrowseProduct />
            <BrowseProduct />
            <BrowseProduct />
          </div>
        </div>
        <div className="mb-5">
          <Footer />
        </div>
      </main>
    </div>
  );
};
export default BrowsingPage;
