import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { motion } from "framer-motion";
import supabase from "../supabase-client";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";

const MotoDetail = () => {
  const { uid, id } = useParams(); // Lấy uid và id từ URL
  const [moto, setMoto] = useState(null);
  const [user, setUser] = useState(null); // State để lưu thông tin người dùng
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentMainIndex, setCurrentMainIndex] = useState(0);
  const imagesPerView = 5;

  const formatNumber = (number) => {
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 0,
    }).format(number);
  };

  const handleNext = () => {
    if (currentIndex + imagesPerView < moto.image_url.length) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNextMain = () => {
    if (currentMainIndex < moto.image_url.length - 1) {
      setCurrentMainIndex((prev) => {
        const newIndex = prev + 1;
        setMainImage(moto.image_url[newIndex]); // Cập nhật ảnh chính

        // Kiểm tra nếu vượt quá imagesPerView, gọi handleNext
        if (newIndex >= currentIndex + imagesPerView) {
          handleNext();
        }

        return newIndex;
      });
    }
  };

  const handlePrevMain = () => {
    if (currentMainIndex > 0) {
      setCurrentMainIndex((prev) => {
        const newIndex = prev - 1;
        setMainImage(moto.image_url[newIndex]); // Cập nhật ảnh chính

        // Kiểm tra nếu vượt quá imagesPerView, gọi handlePrev
        if (newIndex < currentIndex) {
          handlePrev();
        }

        return newIndex;
      });
    } else {
      setCurrentMainIndex(0);
      setMainImage(moto.image_url[0]); // Cập nhật ảnh chính khi về đầu
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch thông tin xe máy
        const { data: motoData, error: motoError } = await supabase
          .from("MOTORCYCLE")
          .select("*")
          .eq("uid", uid)
          .eq("id", id)
          .single();

        if (motoError) {
          throw motoError;
        }

        setMoto(motoData);

        // Fetch thông tin người dùng dựa trên uid
        const { data: userData, error: userError } = await supabase
          .from("USER")
          .select("*")
          .eq("uid", uid)
          .single();

        if (userError) {
          throw userError;
        }

        setUser(userData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [uid, id]);

  useEffect(() => {
    if (moto?.image_url?.length > 0) {
      setMainImage(moto.image_url[0]);
    }
  }, [moto]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!moto) {
    return <div>Moto not found.</div>;
  }

  return (
    <div>
      <main className="my-[15px] mx-[25px]">
        <header className="mb-5">
          <Header />
        </header>

        <div className="font-light mb-4 ">
          {moto.type} / {moto.brand} / {moto.model} / {moto.trim} / {moto.year}
        </div>

        <div className="flex flex-col md:flex-row justify-evenly items-center self-stretch rounded-[6px]">
          <div className="flex flex-col gap-3.5 md:max-w-[700px] md:max-h-fit rounded-[6px]">
            <div className="relative flex flex-col justify-center items-center">
              <img
                id="mainImg"
                src={mainImage || "/img/R7_Sample.jpg"}
                className="w-full md:w-[700px] h-[650px] rounded-[6px] object-cover"
                alt="Main motorcycle"
              />
              <div className="absolute flex flex-row justify-between items-stretch w-full">
                <button
                  onClick={handlePrevMain}
                  className={`${currentMainIndex > 0 ? "opacity-100" : "opacity-0"}`}
                >
                  <img src="/icons/ArrowBack.svg" alt="Previous" />
                </button>
                <button
                  onClick={handleNextMain}
                  className={`${currentMainIndex < moto.image_url.length - 1 ? "opacity-100" : "opacity-0"}`}
                >
                  <img src="/icons/ArrowForward.svg" alt="Next" />
                </button>
              </div>
            </div>

            <div className="flex flex-col justify-center items-center rounded-[6px] overflow-hidden">
              {currentIndex > 0 && (
                <button onClick={handlePrev} className="absolute self-start">
                  <img src="/icons/ArrowBack.svg" alt="Previous" />
                </button>
              )}
              <div className="flex flex-row gap-3.5 overflow-hidden p-1">
                {moto.image_url
                  .slice(currentIndex, currentIndex + imagesPerView)
                  .map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className={`w-[130px] h-[100px] rounded-[6px] object-contain cursor-pointer hover:border-2 ${
                        img === mainImage ? "border-2 border-black" : "border-0"
                      }`}
                      onClick={() => setMainImage(img)}
                    />
                  ))}
              </div>
              {currentIndex + imagesPerView < moto.image_url.length && (
                <button onClick={handleNext} className="absolute self-end">
                  <img src="/icons/ArrowForward.svg" alt="Next" />
                </button>
              )}
            </div>
          </div>
          <div
            id="RightSection"
            className="flex flex-col justify-center items-center lg:justify-start lg:items-start self-stretch"
          >
            <div
              id="BikeDetail"
              className="flex flex-col items-start gap-1 self-stretch border-b-1 border-grey pb-5"
            >
              <div className="font-bold text-4xl">
                {moto.model} {moto.trim}
              </div>
              <div className="text-grey font-light flex flex-row gap-4">
                {moto.condition} {moto.year} {moto.brand} {moto.type}{" "}
                {moto.model} {moto.trim}
              </div>
              <div className="text-4xl font-extrabold text-red">
                ${formatNumber(moto.price)}
              </div>
            </div>

            <div id="ContactSeller" className="">
              <div
                id="SellerDetail"
                className="flex flex-col lg:flex-row justify-start items-center gap-3.5 self-stretch pt-5"
              >
                {user && (
                  <div className="flex items-center gap-2">
                    <img
                      src={user.avatar_url}
                      alt={user.name}
                      className="w-[60px] sm:w-[80px] md:w-[115px] h-auto rounded-full"
                    />
                    <div className="flex flex-col items-start gap-1">
                      <div className="font-bold text-2xl">{user.name}</div>
                      <div className="flex flex-row gap-1 font-light text-grey text-nowrap text-[15px]">
                        <img src="/icons/Location.svg" alt="" /> {moto.location}
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex flex-row gap-3.5">
                  <div className="flex items-center gap-1">
                    <Button
                      textValue={`${user.phone_num}`}
                      bg_color={"black"}
                      text_color={"white"}
                      icons={"/icons/Phone.svg"}
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      textValue={"Chat"}
                      bg_color={"blue"}
                      text_color={"white"}
                      icons={"/icons/Chat.svg"}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-5 pt-5 pb-5 border-b-1 border-grey">
                <div className="flex flex-row gap-5 text-grey">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="rounded-[6px] border-[1px] border-grey h-10 bg-white w-full px-5"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="rounded-[6px] border-[1px] border-grey h-10 bg-white w-full px-5"
                  />
                </div>
                <div className="flex flex-row gap-5 text-grey">
                  <input
                    type="text"
                    placeholder="Email Address"
                    defaultValue={user.email}
                    className="rounded-[6px] border-[1px] border-grey h-10 bg-white w-full px-5"
                  />
                  <input
                    type="text"
                    placeholder="Phone Number"
                    defaultValue={user.phone_num}
                    className="rounded-[6px] border-[1px] border-grey h-10 bg-white w-full px-5"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Message"
                  className="rounded-[6px] border-[1px] border-grey h-10 bg-white w-full px-5"
                  defaultValue={`Hi ${user.name}, I'm interested in your ${moto.brand} ${moto.model} ${moto.trim}. Please contact me.`}
                />
                <Button
                  textValue={"Send Email"}
                  bg_color={"black"}
                  text_color={"white"}
                  width={"full"}
                  icons={"/icons/Chat.svg"}
                />
              </div>
            </div>

            <div className="pt-5">
              <div>Popularity Stats</div>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default MotoDetail;