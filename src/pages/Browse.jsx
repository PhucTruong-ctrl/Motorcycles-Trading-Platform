import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FilterBar from "../components/Browse/FilterBar";
import ProductList from "../components/Browse/ProductList";
import { Message } from "../components/Message";

const BrowsingPage = () => {
  useEffect(() => {
    document.title = "Browse";
  }, []);
  return (
    <div>
      <main className="my-[15px] mx-[25px]">
        <Message />
        <div className="mb-5">
          <Header />
        </div>
        <div className="flex flex-col justify-center items-center gap-3.5 mb-5">
          <div className="flex flex-col md:flex-row self-stretch gap-3.5 pb-4">
            {/* Filter bar */}
            <FilterBar />

            <ProductList />
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
