import React from "react";
import { Link } from "react-router";

const Button = ({ textValue, bg_color, text_color, icons, link, width }) => {
  return (
    <Link to={`/${link}`}>
      <button
        className={`w-full md:w-${width} flex py-0.5 px-2.5 justify-center items-center gap-1.5 shadow-md shadow-grey bg-${bg_color} rounded-[6px] hover:scale-110 hover:cursor-pointer transition`}
      >
        <img className="w-7 h-auto" src={icons} alt="" />
        <div className={`text-${text_color} text-[23px] font-[500]`}>
          {textValue}
        </div>
      </button>
    </Link>
  );
};

export default Button;
