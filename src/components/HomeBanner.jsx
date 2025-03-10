import React from "react";

const HomePageBanner = () => {
  return (
    <div
      id="BannerGroup"
      className=" mx-auto flex flex-col md:flex-row py-15 md:py-25 lg:py-35 gap-8 justify-center items-center border-2 border-grey"
    >
      {/* Left Section */}
      <div
        id="LefSection"
        className="flex flex-col items-start gap-8 text-center md:text-left"
      >
        <div
          id="BannerGroupText"
          className="flex flex-col justify-center items-center md:items-start gap-4 md:gap-8 text-center md:text-left"
        >
          <div id="BannerTextTitle" className="flex flex-col">
            <div
              id="LightTitle"
              className="text-3xl italic font-light inline-block tracking-[-0.64px]"
            >
              BORN TO RIDE
            </div>
            <h1 id="Quote1">GEAR UP</h1>
            <h1 id="Quote2" className="text-gradient">
              RIDE ON
            </h1>
          </div>
          <p id="LongQuote" className="max-w-[550px]">
            No pressure, just pure excitement. Find your dream motorcycle and
            make it yours.
          </p>
        </div>
        <button className="flex py-1.5 px-2.5 w-full md:w-fit justify-center items-center gap-1.5 shadow-md shadow-grey bg-blue rounded-[6px] hover:bg-black hover:text-white hover:cursor-pointer transition">
          <img className="w-6 h-auto" src="/icons/Search.svg" alt="" />
          <div className="text-white text-[28px] font-[500]">Browse</div>
        </button>
      </div>

      {/* Right Section */}
      <img
        src="/img/2021-YZF-R1M.png"
        alt="YZF-R1M"
        className="hidden md:block min-w-[400px] w-[80%] md:w-[30%] lg:[20%] object-contain"
      />
    </div>
  );
};

export default HomePageBanner;
