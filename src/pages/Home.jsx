import React, { useEffect } from "react";
import Banner from "../components/Home/Banner";
import BrandList from "../components/Home/BrandList";
import ProductList from "../components/Home/ProductList";
import Sell from "../components/Home/Sell";
import { Message } from "../components/Message";

const HomePage = () => {
  useEffect(() => {
    document.title = "RevNow";
  }, []);
  return (
    <div>
      <Message />
      <div className="mb-5">
        <Banner />
      </div>
      <div className="mb-5">
        <BrandList />
      </div>
      <div className="mb-5">
        <ProductList condition={"New"} />
      </div>
      <div className="mb-5">
        <ProductList condition={"Used"} />
      </div>
      <div className="mb-5">
        <Sell />
      </div>
    </div>
  );
};

export default HomePage;
