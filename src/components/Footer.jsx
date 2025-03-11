import React from "react";
import Logo from "./Logo";

const Footer = () => {
  return (
    <div>
      <div>
        <Logo />
        <div className="text-center text-black text-[14px] font-light">
          © 2025 RevNow Interactive | revnow.com
          <div>All Rights Reserved. </div>
          <div> This project was created by PhucTruong</div>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default Footer;
