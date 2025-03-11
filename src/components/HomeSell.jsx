import React from "react";

const HomeSell = () => {
  return (
    <div className="border-2 flex flex-col md:flex-row p-10 justify-center items-center self-stretch gap-6">
      <img className=" md:w-[450px] lg:w-[550px]" src="/img/CBR650R.png" alt="" />
      <div className="flex flex-col justify-center items-center text-center md:items-start md:text-left self-stretch gap-4 text-black">
        <div className=" text-[36px] md:text-[48px] font-extrabold -tracking-[-0.96]">
          Sell Your Motorcycle Today!
        </div>
        <div className="font-[400]">
          <div>Reach thousands of buyers on MotoMarket.</div>
          <div>Fast – List your bike in minutes.</div>
          <div>Safe – Secure and hassle-free selling.</div>
          <div>Affordable – Budget-friendly listing options.</div>
        </div>
        <button className="flex justify-center items-center rounded-[6px] bg-blue p-3 shadow-md shadow-grey">
          <div className="text-white font-bold text-xl">Sell My Motorcycle</div>
        </button>
      </div>
    </div>
  );
};
export default HomeSell;
