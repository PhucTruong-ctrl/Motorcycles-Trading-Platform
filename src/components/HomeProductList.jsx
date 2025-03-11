import React from "react";
import HomeProduct from "./HomeProduct";

const HomeProductList = () => {
  return (
    <div className="self-stretch border-b-1 border-grey px-4 pb-5">
      <div className="flex flex-col items-start gap-1 mb-2">
        <div className="flex gap-2">
          <div className="font-bold text-[16px]">Brand New</div>
          <button className="text-blue">See All</button>
        </div>
        <div className="font-light">No miles, no worries—just pure riding joy.</div>
      </div>
      <div className="w-full flex justify-start items-start gap-8 overflow-hidden p-4">
        <HomeProduct />
        <HomeProduct />
        <HomeProduct />
        <HomeProduct />
        <HomeProduct />
        <HomeProduct />
        <HomeProduct />
        <HomeProduct />
        <HomeProduct />
        <HomeProduct />
        <HomeProduct />
      </div>
    </div>
  );
};

export default HomeProductList;
