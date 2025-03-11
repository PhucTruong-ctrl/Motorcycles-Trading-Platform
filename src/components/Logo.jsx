import React from "react";
import { Link } from "react-router";

const Logo = () => {
  return (
    <div>
      <Link to={"/"}>
        <div className="flex justify-center items-center gap-1.5">
          <img src="/icons/black-logo.svg" alt="" />
          <div className="font-bold text-4xl hidden md:block">RevNow</div>
        </div>
      </Link>
    </div>
  );
};

export default Logo;
