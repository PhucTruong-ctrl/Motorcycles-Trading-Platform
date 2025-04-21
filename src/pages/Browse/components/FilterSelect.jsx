import React from "react";
import Select from "react-select";

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
          onChange={(selectedOption) =>
            onChange(selectedOption ? [selectedOption] : [])
          }
          value={
            options.find((option) => option.value === selectedValue) || null
          }
          placeholder={placeholder}
          isSearchable
          isClearable
          className="text-[18px]"
          isDisabled={disabled}
        />
      </div>
    </div>
  );
};

export default FilterSelect;
