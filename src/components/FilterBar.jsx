import React from "react";
import FilterTextboxDropdown from "./FilterTextboxDropdown";
import FilterRangeSliderBar from "./FilterRangeSliderbar";

const FilterBar = () => {
  return (
    <div className="w-full md:w-fit h-fit flex flex-col justify-start items-center gap-3.5 p-6 bg-white rounded-xl shadow-md shadow-grey">
      <div className="self-center md:self-start text-2xl font-extrabold text-black">
        Filter
      </div>

      <div className="flex lex-row justify-center items-start md:items-center self-stretch gap-2.5 ">
        <div className="flex justify-center items-center w-[80px] h-[45px] bg-blue rounded-sm shadow-md shadow-grey">
          <img src="/icons/Tune.svg" alt="" className="w-[35px]" />
        </div>
        <div className="flex justify-center items-center w-[80px] h-[45px] bg-black rounded-sm shadow-md shadow-grey">
          <img src="/icons/Bookmark.svg" alt="" className="w-[35px]" />
        </div>
        <div className="flex justify-center items-center w-[80px] h-[45px] bg-black rounded-sm shadow-md shadow-grey">
          <img src="/icons/History.svg" alt="" className="w-[35px]" />
        </div>
      </div>

      <FilterTextboxDropdown title={"Brand"} type={"make"} />
      <FilterTextboxDropdown title={"Model"} type={"model"}/>
      <FilterTextboxDropdown title={"Trim"} type={"trim"}/>
      <FilterTextboxDropdown title={"Type"} type={"type"}/>

      <div className="flex flex-col items-start gap-1 self-stretch">
        <div className="font-bold text-[20px]">Condition</div>
        <div className="flex flex-row justify-start md:justify-between items-center gap-2.5 self-stretch">
          <div className="flex justify-center items-center px-6 py-2 max-w-[70px] rounded-sm font-light italic text-[18px] text-white bg-blue shadow-md shadow-grey">
            All
          </div>
          <div className="flex justify-center items-center px-6 py-2 max-w-[70px] rounded-sm font-light italic text-[18px] text-white bg-black shadow-md shadow-grey">
            New
          </div>
          <div className="flex justify-center items-center px-6 py-2 max-w-[70px] rounded-sm font-light italic text-[18px] text-white bg-black shadow-md shadow-grey">
            Used
          </div>
        </div>
      </div>

      <FilterRangeSliderBar
        title={"Price"}
        decimalFront={"$"}
        minVal={0}
        maxVal={100000}
      />
      <FilterRangeSliderBar title={"Year"} minVal={1895} maxVal={2025} />
      <FilterRangeSliderBar title={"Mileage"} minVal={0} maxVal={100000} />
      <FilterRangeSliderBar title={"Engine Size"} minVal={0} maxVal={100000} />
    </div>
  );
};

export default FilterBar;
