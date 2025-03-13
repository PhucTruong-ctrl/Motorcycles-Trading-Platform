import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HomeBanner from "../components/HomeBanner";
import HomeBrandList from "../components/HomeBrandList";
import HomeProductList from "../components/HomeProductList";
import HomeSell from "../components/HomeSell";


const HomePage = () => {
  return (
    <div>
      <main className="my-[15px] mx-[25px]">
        <div className="mb-5">
          <Header />
        </div>
        <div className="mb-5">
          <HomeBanner />
        </div>
        <div className="mb-5">
          <HomeBrandList />
        </div>
        <div className="mb-5">
          <HomeProductList condition={"New"} />
        </div>
        <div className="mb-5">
          <HomeProductList condition={"Used"} />
        </div>
        <div className="mb-5">
          <HomeSell />
        </div>
        <div className="mb-5">
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default HomePage;
