import React from "react";

const Button = ({ textValue, bg_color, text_color, icons }) => {
  return (
    <div>
      <button
        className={`flex py-1.5 px-2.5 justify-center items-center gap-1.5 shadow-md shadow-grey bg-${bg_color} rounded-[6px] hover:scale-110 hover:cursor-pointer transition`}
      >
        <img className="w-7 h-auto" src={icons} alt="" />
        <div className={`text-${text_color} text-[28px] font-[500]`}>
          {textValue}
        </div>
      </button>
    </div>
  );
};

export default Button;
