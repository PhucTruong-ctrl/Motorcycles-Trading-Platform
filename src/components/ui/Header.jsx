import React from "react";
import { Link } from "react-router";
import Logo from "./Logo";
import SignInButton from "./SignInButton";

const Header = () => {
  return (
    <div className="flex justify-between items-center border-b-1 border-grey pb-5">
      <Logo></Logo>

      {/* Right Section */}
      <div className="flex justify-center items-center gap-5">
        <Link to={"/browse"}>
          <div className="text-[18px] md:text-2xl text-nowrap hover:underline hover:font-semibold transition">
            <img
              src="/icons/BlackSearch.svg"
              className="w-[39px] h-[42px] block md:hidden"
            ></img>
            <span className="hidden md:block">Browse All</span>
          </div>
        </Link>

        <Link to={"/sell"}>
          <div className="text-[18px] md:text-2xl text-nowrap hover:underline hover:font-semibold transition">
            <img
              src="/icons/Sell.svg"
              className="w-[39px] h-[42px] block md:hidden"
            ></img>
            <span className="hidden md:block">Sell Your Motorcycle</span>
          </div>
        </Link>
        
        <SignInButton />
      </div>
    </div>
  );
};

export default Header;
