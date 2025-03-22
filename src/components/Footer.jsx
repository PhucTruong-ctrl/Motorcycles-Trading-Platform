import React from "react";
import Logo from "./Logo";

const Footer = () => {
  return (
    <div className="">
      <div className="border-t-1 border-grey pt-5 flex flex-col items-center gap-5">
        <Logo />
        <div className="text-center text-black text-[14px] font-light">
          © 2025 RevNow Interactive | revnow.com
          <div>All Rights Reserved. </div>
          <div> This project was created by PhucTruong</div>
        </div>
      </div>
      <div className="flex justify-center items-center gap-5 mt-5">
        <img className="icon" src="/icons/Github.svg" alt="" />
      </div>
    </div>
  );
};

export default Footer;
