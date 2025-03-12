import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ProductDetail = () => {
  return (
    <div>
      <main className="my-[15px] mx-[25px]">
        <header className="mb-5">
          <Header />
        </header>

        <div></div>

        <div className="mb-5">
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
