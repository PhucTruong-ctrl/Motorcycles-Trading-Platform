import React, { useEffect } from "react";
import Banner from "./components/Banner";
import BrandList from "./components/BrandList";
import ProductList from "./components/ProductList";
import Sell from "./components/Sell";
import { Message } from "../../components/forms/Message";

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
