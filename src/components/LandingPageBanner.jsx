import React from "react";

const LandingPageBanner = () => {
  return (
    <div
      id="BannerGroup"
      className="flex p-[20vh] justify-evenly items-center self-stretch border-b-1"
    >
      <div id="LefSection" className="flex flex-col items-start gap-[30px]">
        <div id="BannerGroupText" className="flex flex-col items-start italic mb-[30px] gap-[30px]">
          <div id="BannerTextTitle" className="flex flex-col">
            <div
              id="LightTitle"
              className="text-[32px] italic font-extralight inline-block tracking-[-0.64px]"
            >
              BORN TO RIDE
            </div>
            <h1 id="Quote1">GEAR UP</h1>
            <h1 id="Quote2" className="text-gradient h-[55px]">
              RIDE ON
            </h1>
          </div>
          <p id="LongQuote" className="max-w-[550px]">
            No pressure, just pure excitement. Find your dream motorcycle and
            make it yours.
          </p>
        </div>
        <button className="flex py-[10px] px-[20px] justify-center items-center gap-[5px] bg-blue rounded-[6px]">
          <img className="w-[25px] h-[25px]" src="/public/img/Search.svg" alt="" />
          <div className="text-white text-[28px] font-[500]">Browse</div>
        </button>
      </div>
      <img src="/public/img/2021-YZF-R1M.png" alt="" />
    </div>
  );
};

export default LandingPageBanner;
