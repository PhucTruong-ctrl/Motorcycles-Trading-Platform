import React, { useState } from "react";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";

const FilterRangeSliderbar = ({title, decimalFront, decimalBack, minVal, maxVal}) => {
  const [value, setValue] = useState([minVal, maxVal]);
  const formatNumber = (number) => {
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 0,
    }).format(number);
  };
  return (
    <div className="flex flex-col justify-center items-start self-stretch gap-2">
      <div className="font-bold text-[20px]">{title}</div>
      <div className="flex justify-between self-stretch font-[400] text-[18px] text-black">
        <span>{decimalFront}{formatNumber(value[0])} {decimalBack}</span>
        <span>{decimalFront}{formatNumber(value[1])} {decimalBack}</span>
      </div>
      <RangeSlider id="range-slider" min={minVal} max={maxVal} value={value} onInput={setValue} />
    </div>
  );
};

export default FilterRangeSliderbar;
