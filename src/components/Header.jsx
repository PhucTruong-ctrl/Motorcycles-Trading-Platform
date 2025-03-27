import React from "react";
import { Link } from "react-router";
import Logo from "./Logo";
import AuthContext from "../contexts/AuthContext";

const Header = () => {
  return (
    <div className="flex justify-between items-center border-b-1 border-grey pb-5">
      <Logo></Logo>

      {/* Right Section */}
      <div className="flex justify-center items-center gap-5 lg:gap-10 md:gap-5">
        <Link to={"/browse"}>
          <div className="text-[18px] md:text-2xl text-nowrap">
            <img
              src="/icons/BlackSearch.svg"
              className="w-[39px] h-[42px] block md:hidden"
            ></img>
            <span className="hidden md:block">Browse All</span>
          </div>
        </Link>

        <Link to={"/sell"}>
          <div className="text-[18px] md:text-2xl text-nowrap">
            <img
              src="/icons/Sell.svg"
              className="w-[39px] h-[42px] block md:hidden"
            ></img>
            <span className="hidden md:block">Sell Your Motorcycle</span>
          </div>
        </Link>

        <Link to={"/about"}>
          <button className="text-[18px] md:text-2xl text-nowrap">
            <img
              src="/icons/About.svg"
              className="w-[39px] h-[42px] block md:hidden"
            ></img>
            <span className="hidden md:block">About Me</span>
          </button>
        </Link>

        <AuthContext />
      </div>
    </div>
  );
};

export default Header;
