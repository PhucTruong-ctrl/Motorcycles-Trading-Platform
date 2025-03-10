import React from "react";
import { Link } from "react-router";
import Home from "../pages/Home";
import Sell from "../pages/Sell";
import About from "../pages/About";
import Browse from "../pages/Browse";
import Login from "../pages/Login";

const Header = () => {
  return (
    <div className="flex justify-between items-center border-b-1 border-grey pb-4">
      <Link to={"/"}>
        <div className="flex justify-center items-center gap-1.5">
          <img src="/icons/black-logo.svg" alt="" />
          <div className="font-bold text-4xl hidden md:block">RevNow</div>
        </div>
      </Link>

      {/* Right Section */}
      <div className="flex justify-center items-center gap-10 md:gap-5">
        <Link to={"Browse"}>
          <div className="text-[18px] md:text-2xl text-nowrap">
            <img
              src="/icons/BlackSearch.svg"
              className="w-[39px] h-[42px] block md:hidden"
            ></img>
            <span className="hidden md:block">Browse All</span>
          </div>
        </Link>
        <Link to={"Sell"}>
          <div className="text-[18px] md:text-2xl text-nowrap">
            <img
              src="/icons/Sell.svg"
              className="w-[39px] h-[42px] block md:hidden"
            ></img>
            <span className="hidden md:block">Sell Your Motorcycle</span>
          </div>
        </Link>
        <Link to={"About"}>
          <button className="text-[18px] md:text-2xl text-nowrap">
            <img
              src="/icons/About.svg"
              className="w-[39px] h-[42px] block md:hidden"
            ></img>
            <span className="hidden md:block">About Us</span>
          </button>
        </Link>
        <Link to={"Login"}>
          <div className="text-[18px] md:text-2xl text-nowrap">
            <img
              src="/icons/User.svg"
              className="w-[39px] h-[42px] block md:hidden"
            ></img>
            <span className="hidden md:block">Sign In</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Header;
