import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FilterBar from "../components/FilterBar";
import BrowseNavbar from "../components/BrowseNavbar";
import BrowseProductList from "../components/BrowseProductList";

const BrowsingPage = () => {
  return (
    <div>
      <main className="my-[15px] mx-[25px]">
        <div className="mb-5">
          <Header />
        </div>
        <div className="flex flex-col justify-center items-center gap-3.5 mb-5">
          <div className="flex flex-col md:flex-row self-stretch gap-3.5 pb-4">
            {/* Filter bar */}
            <FilterBar />

            <BrowseProductList />
          </div>

          <BrowseNavbar />
        </div>

        <div className="mb-5">
          <Footer />
        </div>
      </main>
    </div>
  );
};
export default BrowsingPage;
