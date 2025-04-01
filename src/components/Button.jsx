import React from "react";
import { Link } from "react-router";

const Button = ({ textValue, bg_color, text_color, icons, link }) => {
  return (
    <Link to={`/${link}`} className="w-full">
      <button
        className={`w-full p-2.5 flex flex-row justify-center items-center gap-1.5 shadow-md shadow-grey bg-${bg_color} rounded-sm hover:scale-110 hover:cursor-pointer transition`}
      >
        <img className="w-7 h-auto" src={icons} alt="" />
        <span className={`text-${text_color} text-[22px] font-[500]`}>
          {textValue}
        </span>
      </button>
    </Link>
  );
};

export default Button;
