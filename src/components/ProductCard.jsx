import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import EditDeleteButton from "../components/EditDeleteButton";

const ProductCard = ({ moto, currentUserId, isOwnerPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const showActions = isOwnerPage && currentUserId === moto.uid;
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const formatNumber = (number) => {
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 0,
    }).format(number);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

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
    <div className="relative home-card" ref={menuRef}>
      {showActions && (
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="absolute right-0 bottom-0 bg-black rounded-md w-10 shadow-md active:scale-140 transition"
        >
          <img src="/icons/More.svg" alt="" className="w-full" />
        </button>
      )}

      {isMenuOpen && showActions && (
        <EditDeleteButton
          motoUID={moto.uid}
          motoID={moto.id}
          currentUserId={currentUserId}
        />
      )}

      <div onClick={updateURL}>
        <div id="product">
          <div id="img">
            <img
              className="rounded-t-md h-[145px] object-cover"
              src={
                Array.isArray(moto.image_url) && moto.image_url.length > 0
                  ? moto.image_url[0]
                  : "/img/R7_Sample.jpg"
              }
              alt={moto.type}
            />
          </div>
          <div
            id="detail"
            className="flex flex-col justify-between gap-0.5 self-stretch p-2 h-full"
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
