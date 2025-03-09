import React from "react";

const Header = () => {
  return (
    <div className="flex justify-between items-center self-stretch border-b-1 pb-[15px]">
      <div className="flex justify-center items-center gap-[5px]">
        <img src="img/black-logo.svg" alt="" />
        <div className="font-bold text-[36px]">RevNow</div>
      </div>

      <div className="flex items-center gap-[30px]">
        <button className="text-[24px]">Browse All</button>
        <button className="text-[24px]">Sell My Motorcycle</button>
        <button className="text-[24px]">About Us</button>
        <button className="text-[24px]">Sign In</button>
      </div>
    </div>
  );
};

export default Header;
