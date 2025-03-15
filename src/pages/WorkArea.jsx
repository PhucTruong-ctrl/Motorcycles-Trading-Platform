import React from "react";

const WorkArea = () => {
  return (
    <div className="m-5 p-5 flex flex-col gap-5 w-fit shadow-md bg-white rounded-[6px]">
      <div className="flex flex-row justify-start items-center gap-5">
        <img
          src="/img/R7_Sample.jpg"
          alt=""
          className="w-15 h-15 rounded-full object-fill"
        />
        <div className="w-full font-semibold text-xl">User name</div>
      </div>
      <button className="w-full text-[16px] text-left rounded-[6px] flex flex-row gap-1 p-2 hover:bg-[#efeeee] hover:shadow-md transition"><img src="icons/User.svg" alt="" /> My Profile</button>
      <button className="w-full text-[16px] text-left rounded-[6px] flex flex-row gap-1 p-2 hover:bg-[#efeeee] hover:shadow-md transition"><img src="icons/Edit.svg" alt="" /> Edit information</button>
      <button className="w-full text-[16px] text-left rounded-[6px] flex flex-row gap-1 p-2 hover:bg-[#efeeee] hover:shadow-md transition"><img src="icons/List.svg" alt="" /> View My Listing</button>
      <button className="w-full text-[16px] text-left rounded-[6px] flex flex-row gap-1 p-2 hover:bg-[#efeeee] hover:shadow-md transition"><img src="icons/HistoryBlack.svg" alt="" /> Purchases History</button>
      <button className="w-full text-[16px] text-left rounded-[6px] flex flex-row gap-1 p-2 hover:bg-[#efeeee] hover:shadow-md transition"><img src="icons/Logout.svg" alt="" /> Sign Out</button>
    </div>
  );
};

export default WorkArea;
