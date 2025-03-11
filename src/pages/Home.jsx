import React from "react";
import Header from "../components/Header";
import HomePageBanner from "../components/HomeBanner";
import HomeBrandList from "../components/HomeBrandList";
import HomeProductList from "../components/HomeProductList";
import HomeSell from "../components/HomeSell";
import Footer from "../components/Footer";

const HomePage = () => {
  return (
    <div>
      <main className="my-[15px] mx-[25px]">
        <header className="mb-5">
          <Header />
        </header>
        <div className="mb-5">
          <HomePageBanner />
        </div>
        <div className="mb-5">
          <HomeBrandList />
        </div>
        <div className="mb-5">
          <HomeProductList />
        </div>
        <div className="mb-5">
          <HomeProductList />
        </div>
        <div className="mb-5">
          <HomeSell />
        </div>
        <div>
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default HomePage;
