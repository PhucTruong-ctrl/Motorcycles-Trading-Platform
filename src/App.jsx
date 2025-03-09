import React from "react";
import Header from "./components/Header";
import LandingPageBanner from "./components/LandingPageBanner";

const App = () => {
  return (
    <main className="my-[15px] mx-[25px]">
      <header>
        <Header />
      </header>
      <LandingPageBanner />
    </main>
  );
};

export default App;
