import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import supabase from "../supabase-client";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

const Profile = () => {
  const { uid } = useParams();
  const [user, setUser] = useState(null);
  const [moto, setMoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: userData, error: userError } = await supabase
          .from("USER")
          .select("*")
          .eq("uid", uid)
          .single();

        if (userError) throw userError;

        setUser(userData);

        const { data: motoData, error: motoError } = await supabase
          .from("MOTORCYCLE")
          .select("*")
          .eq("uid", uid);

        if (motoError) throw motoError;

        setMoto(motoData);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [uid, user]);

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
        <div className="flex flex-col gap-4">
          <div className="bg-red min-h-50 rounded-xl h-[265px] overflow-hidden">
            <img
              src="/img/bannerDefault.png"
              alt=""
              className="object-contain w-full"
            />
          </div>

          <div className="flex flex-row gap-6 w-full bg-white rounded-xl shadow-md relative">
            <div className="min-w-[100px] min-h-[100px] md:min-w-[150px] md:min-h-[150px]">
              <img
                src={user?.avatar_url}
                alt=""
                className="w-full h-full rounded-xl"
              />
            </div>
            <div className="flex flex-row gap-6 justify-center items-center">
              <div className="flex flex-col gap-2.5">
                <h2>{user?.name}</h2>
                <div className="flex flex-row gap-2 justify-start items-center">
                  <img src="/icons/Location.svg" alt="" className="w-2.5" />
                  <div className="font-light text-[16px]">{user?.address}</div>
                </div>
              </div>
              <div className="flex flex-col gap-2.5">
                <div className="text-2xl font-light text-grey">
                  +{user?.reputation} Reputation
                </div>
                <div className="text-[16px] font-light text-grey">
                  {user?.badge}
                </div>
              </div>
            </div>
            <Link
              to={`/${user?.uid}/profile/edit`}
              className="absolute right-5 top-5"
            >
              <button className="font-bold text-[24px] text-black">
                Edit Profile
              </button>
            </Link>
          </div>

          <div className="bg-white w-full h-20 rounded-xl shadow-md flex flex-row gap-12 justify-start items-center p-5">
            <Link to={`/${user?.uid}/profile`}>
              <button className="font-bold text-[28px] text-blue">
                Listing
              </button>
            </Link>
            <Link to={`/${user?.uid}/profile/reputation`}>
              <button className="font-bold text-[28px] text-blue">
                Reputation
              </button>
            </Link>
          </div>

          <div className="w-full">
            <div className="w-full flex flex-row flex-wrap justify-start items-start gap-8 overflow-hidden p-4">
              {moto.map((moto) => (
                <ProductCard key={moto.id} moto={moto} />
              ))}
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

export default Profile;
