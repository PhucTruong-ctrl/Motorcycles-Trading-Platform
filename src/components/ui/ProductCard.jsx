import React from "react";
import { useNavigate } from "react-router";
import { formatNumber } from "../../utils/FormatThings";

const ProductCard = ({ moto }) => {
  const navigate = useNavigate();
  const updateURL = () => {
    const queryParams = new Map([
      ["uid", moto.uid || undefined],
      ["id", moto.id || undefined],
      ["year", moto.year || undefined],
      ["brand", moto.brand || undefined],
      ["model", moto.model || undefined],
      ["trim", moto.trim || undefined],
    ]);

    const query = new URLSearchParams(queryParams).toString();
    navigate(`/motorcycle-detail?${query}`);
  };

  return (
    <div className="relative home-card">
      <div onClick={updateURL} className="w-full">
        <div id="product" className="w-full">
          <img
            className="rounded-t-md w-full h-[145px] object-cover"
            src={
              Array.isArray(moto.image_url) && moto.image_url.length > 0
                ? moto.image_url[0]
                : "/img/R7_Sample.jpg"
            }
            alt={moto.type}
          />
          <div
            id="detail"
            className="flex flex-col justify-between gap-0.5 self-stretch p-2"
          >
            <div
              id="price-status"
              className="flex justify-between items-start self-stretch"
            >
              <span
                id="price"
                className="flex-[1,0,0] text-[16px] font-extrabold"
              >
                ${formatNumber(moto.price)}
              </span>
              <span
                id="status"
                className="text-[16px] font-[700] text-red stroke-2 stroke-black"
              >
                {moto.condition.toUpperCase()}
              </span>
            </div>

            <span id="name" className="text-[14px] text-grey font-[500]">
              {moto.brand} {moto.model} {moto.trim}
            </span>
            <div
              id="odo-year"
              className="flex justify-between items-start self-stretch text-[12px] text-grey font-[500]"
            >
              <span id="odo" className="flex-[1,0,0]">
                {formatNumber(moto.mile)} Miles
              </span>
              <span id="year">{moto.year}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
