import React from "react";

const WorkArea = () => {
  return (
    <div className="m-5 p-5 flex flex-col gap-5 w-fit shadow-md bg-white rounded-[6px]">
      <button className="w-full text-[16px] text-left rounded-[6px] flex flex-row gap-1 p-2 hover:bg-[#efeeee] hover:shadow-md transition">
        <img src="icons/Edit.svg" alt="" /> Edit
      </button>
      <button className="w-full text-[16px] text-left rounded-[6px] flex flex-row gap-1 p-2 hover:bg-[#efeeee] hover:shadow-md transition">
        <img src="icons/Delete.svg" alt=""/> Delete
      </button>
    </div>
  );
};

export default WorkArea;
