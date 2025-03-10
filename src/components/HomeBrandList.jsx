import React from "react";
import HomeBrand from "./HomeBrand";

const HomeBrandList = () => {
  return (
    <div className="w-full flex justify-center border-2 border-grey">
      <div className="flex justify-start items-start overflow-hidden p-4 gap-8">
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
