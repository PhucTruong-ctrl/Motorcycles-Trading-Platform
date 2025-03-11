import React from "react";

const HomeProduct = () => {
  return (
    <div
      id="product"
      className="home-card"
    >
      <div id="img">
        <img
          className="rounded-t-md h-[145px] object-cover "
          src="/img/R7_Sample.jpg"
          alt=""
        />
      </div>
      <div
        id="detail"
        className="flex flex-col justify-start gap-0.5 self-stretch p-2 h-full"
      >
        <div
          id="price-status"
          className="flex justify-between items-start self-stretch"
        >
          <span id="price" className="flex-[1,0,0] text-[16px] font-extrabold">
            $12,456
          </span>
          <span
            id="status"
            className="text-[16px] font-[700] text-red stroke-2 stroke-black"
          >
            NEW
          </span>
        </div>

        <span id="name" className="text-[14px] text-grey font-[500]">
          Motorcycle Name
        </span>
        <div
          id="odo-year"
          className="flex justify-between items-start self-stretch  text-[12px] text-grey font-[500]"
        >
          <span id="odo" className="flex-[1,0,0]">
            0,000 Miles
          </span>
          <span id="year">2025</span>
        </div>
      </div>
    </div>
  );
};

export default HomeProduct;
