import React from "react";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";

const FilterRangeSlider = ({
  title,
  value,
  onInput,
  min,
  max,
  formatValue,
}) => {
  return (
    <div className="flex flex-col justify-center items-start self-stretch gap-2">
      <div className="font-bold text-[20px]">{title}</div>
      <div className="flex justify-between self-stretch font-[400] text-[18px] text-black">
        <span>{formatValue(value[0])}</span>
        <span>{formatValue(value[1])}</span>
      </div>
      <RangeSlider min={min} max={max} value={value} onInput={onInput} />
    </div>
  );
};

export default FilterRangeSlider;
