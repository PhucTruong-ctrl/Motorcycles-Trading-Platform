import React from "react";
import HomeBrand from "./HomeBrand";

const HomeBrandList = () => {
  return (
    <div className="w-full flex justify-center border-b-1 border-grey ">
      <div className="flex justify-start items-start overflow-hidden px-4 pb-5 gap-8">
        <HomeBrand/>
        <HomeBrand/>
        <HomeBrand/>
        <HomeBrand/>
        <HomeBrand/>
        <HomeBrand/>
        <HomeBrand/>
        <HomeBrand/>
      </div>
    </div>
  );
};

export default HomeBrandList;
