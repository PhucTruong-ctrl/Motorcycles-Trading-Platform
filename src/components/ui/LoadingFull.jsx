import React from "react";

const LoadingFull = () => {
  return (
    <div className="w-[100vw] h-[100vh] bg-white flex justify-center items-center">
      <img src="/icons/BlackLoading.svg" alt="" className="animate-spin w-20" />
    </div>
  );
};

export default LoadingFull;
