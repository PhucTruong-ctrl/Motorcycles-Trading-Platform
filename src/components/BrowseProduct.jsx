import React from "react";
import { Link } from "react-router";

const BrowseProduct = () => {
  return (
    <Link to={"/product"}>
      {" "}
      <div
        id="BrowseProduct"
        className="flex flex-col md:flex-row justify-center items-center gap-3.5 bg-white rounded-[6px] p-6 shadow-md shadow-grey"
      >
        <img
          src="/img/R7_Sample.jpg"
          alt=""
          className="max-w-[250px] rounded-[6px]"
        />
        <div
          id="Detail"
          className="text-nowrap flex flex-col items-start justify-center gap-3.5 max-h-[200px] pr-3.5 md:border-r-1 border-grey"
        >
          <div id="Top" className="flex flex-col justify-end items-start gap-1">
            <div id="Name" className="font-extrabold text-2xl text-black">
              text name text name
            </div>
            <div
              id="Location"
              className="text-[13px] font-light text-black flex flex-row gap-1"
            >
              <img src="/icons/Location.svg" alt="" />
              some where on the goddamn earth
            </div>
          </div>
          <div id="Mid" className="flex flex-col justify-end items-start gap-1">
            <div id="Price" className="text-red text-2xl font-extrabold">
              $12,456
            </div>
            <div>
              <div id="Mileage" className="text-[14px] text-grey font-light">
                12,345 Miles
              </div>
              <div id="Year" className="text-[14px] text-grey font-light">
                2025
              </div>
            </div>
          </div>
          <div id="Bot" className="flex gap-1">
            <img src="/icons/Time.svg" alt="" className="opacity-70" />
            <div className="font-light text-[13px] text-grey">16/2/2025</div>
          </div>
        </div>

        <div id="Desc" class="text-black text-[13px] line-clamp-9">
          Lorem ipsum dolor sit amet consectetur. Risus nec risus vitae laoreet.
          Urna amet vestibulum a facilisis. Donec adipiscing eget lacus non.
          Integer libero quis amet nec elementum platea scelerisque. A sit lorem
          metus fames quis sit eget amet sit. Erat sapien massa molestie integer
          quis eu etiam duis ut. Semper sapien at nunc leo. Non mauris
          suspendisse amet adipiscing adipiscing. Facilisi amet risus cursus
          nisi mi integer. Purus aliquam pretium sit odio. Faucibus nec velit
          cursus donec ut in non porta. Fermentum vel velit mattis cras
          tincidunt aliquam. Nulla tortor sodales diam quam semper cras
          tincidunt metus. Varius sed id sit ipsum at dui porttitor leo. Sit
          urna risus egestas aliquam sit sit viverra. Ut dolor viverra tempus
          est egestas sed. Consectetur porttitor arcu mauris adipiscing
          dignissim. Dolor hac enim pellentesque blandit auctor nisl euismod.
          Metus auctor mi ut mollis donec quis. Rutrum id diam etiam ac
          tincidunt et. Dolor venenatis massa.
        </div>
      </div>
    </Link>
  );
};

export default BrowseProduct;
