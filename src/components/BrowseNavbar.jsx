import React from "react";

const BrowseNavbar = () => {
  return (
    <div className="flex flex-row gap-3.5">
      <button
        className={
          "flex py-1.5 px-2.5 justify-center items-center gap-1.5 shadow-md shadow-grey bg-black rounded-[6px] hover:scale-110 hover:cursor-pointer transition"
        }
      >
        <div className={"text-white text-[16px] font-[500]"}>Previous</div>
      </button>
      <button
        className={
          "flex py-1.5 px-2.5 justify-center items-center gap-1.5 shadow-md shadow-grey bg-black rounded-[6px] hover:scale-110 hover:cursor-pointer transition"
        }
      >
        <div className={"text-white text-[16px] font-[500]"}>1</div>
      </button>
      <button
        className={
          "flex py-1.5 px-2.5 justify-center items-center gap-1.5 shadow-md shadow-grey bg-black rounded-[6px] hover:scale-110 hover:cursor-pointer transition"
        }
      >
        <div className={"text-white text-[16px] font-[500]"}>2</div>
      </button>
      <button
        className={
          "flex py-1.5 px-2.5 justify-center items-center gap-1.5 shadow-md shadow-grey bg-black rounded-[6px] hover:scale-110 hover:cursor-pointer transition"
        }
      >
        <div className={"text-white text-[16px] font-[500]"}>3</div>
      </button>
      <button
        className={
          "flex py-1.5 px-2.5 justify-center items-center gap-1.5 shadow-md shadow-grey bg-black rounded-[6px] hover:scale-110 hover:cursor-pointer transition"
        }
      >
        <div className={"text-white text-[16px] font-[500]"}>4</div>
      </button>
      <button
        className={
          "flex py-1.5 px-2.5 justify-center items-center gap-1.5 shadow-md shadow-grey bg-black rounded-[6px] hover:scale-110 hover:cursor-pointer transition"
        }
      >
        <div className={"text-white text-[16px] font-[500]"}>5</div>
      </button>
      <button
        className={
          "flex py-1.5 px-2.5 justify-center items-center gap-1.5 shadow-md shadow-grey bg-black rounded-[6px] hover:scale-110 hover:cursor-pointer transition"
        }
      >
        <div className={"text-white text-[16px] font-[500]"}>Next</div>
      </button>
    </div>
  );
};

export default BrowseNavbar;
