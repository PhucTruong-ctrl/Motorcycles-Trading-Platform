import React from "react";

const FilterTextboxDropdown = ({ title }) => {

  return (
    <div className="flex flex-col justify-center items-start gap-1 self-stretch">
      <div className="font-bold text-[20px]">{title}</div>
      <div className="flex items-center self-stretch gap-1 p-3.5 bg-bg-white rounded-[6px] shadow-md shadow-grey">
        <div>Any</div>
        <img src="/icons/Dropdown.svg" alt="" />
      </div>
    </div>
  );
};

export default FilterTextboxDropdown;
