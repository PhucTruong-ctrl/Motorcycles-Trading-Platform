import React from "react";
import Button from "./Button";

const HomePageBanner = () => {
  return (
    <div
      id="BannerGroup"
      className="border-b-1 border-grey  mx-auto flex flex-col md:flex-row py-15 md:py-25 lg:py-35 gap-8 justify-center items-center"
    >
      {/* Left Section */}
      <div
        id="LefSection"
        className="flex flex-col items-center md:items-start gap-8 text-center md:text-left"
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
        <Button textValue={"Browse"} bg_color={"blue"} text_color={"white"} icons={"icons/Search.svg"}/>
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
