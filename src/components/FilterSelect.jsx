import React from "react";
import Select from "react-dropdown-select";

const FilterSelect = ({
  title,
  options,
  selectedValue,
  onChange,
  disabled,
  placeholder,
}) => {
  return (
    <div className="flex flex-col items-start gap-1 w-full">
      <div className="font-bold text-xl">{title}</div>
      <div className="w-full">
        <Select
          options={options}
          onChange={onChange}
          values={
            selectedValue
              ? [{ value: selectedValue, label: selectedValue }]
              : []
          }
          placeholder={placeholder}
          searchable
          clearable
          className="text-[18px]"
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default FilterSelect;
