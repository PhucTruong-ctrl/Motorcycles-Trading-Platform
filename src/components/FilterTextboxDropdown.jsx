import React from "react";
import Select from "react-dropdown-select";

const FilterTextboxDropdown = ({ title }) => {
  const options = [
    {
      id: 1,
      name: "Leanne Graham",
    },
    {
      id: 2,
      name: "Ervin Howell",
    },
  ];
  return (
    <div className="flex flex-col justify-center items-start gap-1 self-stretch">
      <div className="font-bold text-[20px]">{title}</div>
      <div className="flex items-center self-stretch gap-1 p-3.5 bg-bg-white rounded-[6px] shadow-md shadow-grey">
        <div>Any</div>
        <img src="/icons/Dropdown.svg" alt="" />
      </div>
      <Select
        options={options}
        labelField="name"
        valueField="id"
        onChange={(values) => this.setValues(values)}
      />
      ;
    </div>
  );
};

export default FilterTextboxDropdown;
