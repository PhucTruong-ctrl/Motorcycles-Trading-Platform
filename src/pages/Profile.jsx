import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import supabase from "../supabase-client";
import Select from "react-select";
import Modal from "react-modal";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import ProductCard from "../components/ProductCard";
import { ReputationMessage } from "../components/Profile/ReputationMessage";
import EditProfile from "./../components/Profile/EditProfile";
import { Message } from "../components/Message";
import Reputation from "../components/Profile/Reputation";
import LoadingFull from "./../components/LoadingFull";
import Loading from "../components/Loading";
import normalizeFileName from "../components/utils/normalizeFileName";

Modal.setAppElement("#root");

const Profile = () => {
  const { uid } = useParams();
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [moto, setMoto] = useState(null);
  const [reps, setReps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [atListing, setAtListing] = useState(true);
  const [repType, setRepType] = useState(true);
  const [alreadyRep, setAlreadyRep] = useState(false);
  const [repMessage, setRepMessage] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalUploadAvtIsOpen, setModalUploadAvtIsOpen] = useState(false);
  const [modalUploadBanIsOpen, setModalUploadBanIsOpen] = useState(false);

  const carouselRef = useRef(null);

  const ListingButton = () => {
    setAtListing(true);
  };
  const ReputationButton = () => {
    setAtListing(false);
  };

  const sendRep = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Please login to send reputation");
    }
    try {
      const { rep_data, rep_error } = await supabase.from("REPUTATION").insert([
        {
          uid_rep: uid,
          uid_send_rep: currentUser.id,
          rep_message: repMessage,
          is_positive_rep: repType,
        },
      ]);

      console.log("Reputation Data: ", rep_data);

      if (rep_error) throw rep_error;
      alert("Rep sended");
    } catch (error) {
      console.error("Rep send error", error);
    }
  };

  const handleAvatarUpload = async (e) => {
    setUploading(true);
    const file = e.target.files[0];
    if (!file) return;

    try {
      const safeFileName = normalizeFileName(file.name);
      const fileName = `avatar_${Date.now()}_${safeFileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("user-media")
        .upload(`${currentUser.id}/${fileName}`, file);

      console.log(uploadData);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("user-media")
        .getPublicUrl(`${currentUser.id}/${fileName}`);

      const newAvatarUrl = publicUrlData.publicUrl;

      if (user?.avatar_url) {
        const oldFileName = user.avatar_url.split("/").pop();
        const { error: deleteError } = await supabase.storage
          .from("user-media")
          .remove([`${currentUser.id}/${oldFileName}`]);

        if (deleteError) throw deleteError;
      }

      const { data: userData, error: userError } = await supabase
        .from("USER")
        .update({ avatar_url: newAvatarUrl })
        .eq("uid", uid)
        .select();
      console.log(userData);
      if (userError) throw userError;

      setUser({ ...user, avatar_url: newAvatarUrl });

      alert("Avatar updated successfully!");
      window.location.reload();
      setUploading(false);
      setModalUploadAvtIsOpen(false);
    } catch (error) {
      console.error("Error updating avatar:", error);
      setUploading(false);
      setModalUploadAvtIsOpen(false);
      alert("Failed to update avatar.");
    }
  };

  const handleBannerUpload = async (e) => {
    setUploading(true);
    const file = e.target.files[0];
    if (!file) return;

    try {
      const safeFileName = normalizeFileName(file.name);
      const fileName = `banner_${Date.now()}_${safeFileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("user-media")
        .upload(`${currentUser.id}/${fileName}`, file);

      console.log(uploadData);
      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("user-media")
        .getPublicUrl(`${currentUser.id}/${fileName}`);

      const newBannerUrl = publicUrlData.publicUrl;

      if (user?.banner_url) {
        const oldFileName = user.banner_url.split("/").pop();
        const { error: deleteError } = await supabase.storage
          .from("user-media")
          .remove([`${currentUser.id}/${oldFileName}`]);

        if (deleteError) throw deleteError;
      }

      const { data: userData, error: userError } = await supabase
        .from("USER")
        .update({ banner_url: newBannerUrl })
        .eq("uid", uid)
        .select();
      console.log(userData);
      if (userError) throw userError;

      setUser({ ...user, banner_url: newBannerUrl });

      alert("Banner updated successfully!");
      window.location.reload();
      setUploading(false);
      setModalUploadBanIsOpen(false);
    } catch (error) {
      console.error("Error updating Banner:", error);
      alert("Failed to update Banner.");
      setUploading(false);
      setModalUploadBanIsOpen(false);
    }
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setCurrentUser(session.user);
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (!uid) return;

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

        const { data: repData, error: repError } = await supabase
          .from("REPUTATION")
          .select("*")
          .eq("uid_rep", uid);

        if (repError) throw repError;
        setReps(repData || []);

        if (currentUser) {
          const { data: existingRep, error: checkError } = await supabase
            .from("REPUTATION")
            .select("*")
            .eq("uid_rep", uid)
            .eq("uid_send_rep", currentUser.id)
            .maybeSingle();

          if (checkError && checkError.code !== "PGRST116") {
            throw checkError;
          }

          if (existingRep) {
            setAlreadyRep(true);
          } else {
            setAlreadyRep(false);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [uid, currentUser]);

  useEffect(() => {
    if (user) {
      document.title = `${user.name}`;
    }
  }, [user]);

  if (loading) {
    return <LoadingFull />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <Message />
      <div className="flex flex-col gap-5 lg:pr-50 lg:pl-50">
        <Modal
          isOpen={modalUploadBanIsOpen}
          onRequestClose={() => {
            setModalUploadBanIsOpen(false);
          }}
          contentLabel="Edit Profile"
          className="absolute flex items-end justify-center md:hidden w-full bottom-0"
          overlayClassName="z-10 fixed inset-0 bg-[#fff]/75 block md:hidden pointer-events-auto"
          shouldCloseOnOverlayClick={true}
        >
          <div className="relative flex flex-col gap-5 justify-center items-center bg-white border-2 border-black p-5 w-full rounded-t-xl">
            <div className="font-semibold text-xl p-2 active:bg-grey active:scale-102 transition rounded-md w-full">
              {uploading ? (
                <Loading />
              ) : (
                <div>
                  <label
                    htmlFor="banner-upload"
                    className="flex flex-row gap-1 justify-start items-center cursor-pointer"
                  >
                    <img
                      src="/icons/UploadWhite.svg"
                      alt=""
                      className="bg-black rounded-full p-2"
                    />
                    <div>Choose cover photo</div>
                  </label>
                  <input
                    id="banner-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleBannerUpload}
                  />
                </div>
              )}
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={modalUploadAvtIsOpen}
          onRequestClose={() => {
            setModalUploadAvtIsOpen(false);
          }}
          contentLabel="Edit Profile"
          className="absolute flex items-end justify-center md:hidden w-full bottom-0"
          overlayClassName="z-10 fixed inset-0 bg-[#fff]/75 block md:hidden pointer-events-auto"
          shouldCloseOnOverlayClick={true}
        >
          <div className="relative flex flex-col gap-5 justify-center items-center bg-white border-2 border-black p-5 w-full rounded-t-xl">
            <div className="font-semibold text-xl p-2 active:bg-grey active:scale-102 transition rounded-md w-full">
              {uploading ? (
                <Loading />
              ) : (
                <div>
                  <label
                    htmlFor="avatar-upload"
                    className="flex flex-row gap-1 justify-start items-center cursor-pointer"
                  >
                    <img
                      src="/icons/UploadWhite.svg"
                      alt=""
                      className="bg-black rounded-full p-2"
                    />
                    <div>Choose avatar photo</div>
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                </div>
              )}
            </div>
          </div>
        </Modal>

        <div className="relative rounded-xl w-full max-h-[250px] md:h-[350px] overflow-hidden flex justify-center items-center">
          {user?.banner_url ? (
            <div className="w-full">
              <img
                onClick={() => setModalUploadBanIsOpen(true)}
                src={user?.banner_url}
                alt=""
                className="object-fill w-full rounded-xl active:scale-95 md:active:scale-100 transition"
              />
            </div>
          ) : (
            <button
              onClick={() => setModalUploadBanIsOpen(true)}
              className="bg-black text-white rounded-md p-5"
            >
              Upload cover photo
            </button>
          )}
          {currentUser?.id === uid && (
            <div className="absolute hidden md:block">
              <label htmlFor="banner-upload">
                <img
                  src="/icons/Upload.svg"
                  alt=""
                  className="w-30 opacity-0 hover:opacity-70 bg-white rounded-md cursor-pointer transition"
                />
              </label>
              <input
                id="banner-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleBannerUpload}
              />
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-6 w-full bg-white rounded-xl shadow-md relative p-5">
          <div className="relative flex justify-center items-center">
            {user?.avatar_url ? (
              <div>
                <img
                  onClick={() => setModalUploadAvtIsOpen(true)}
                  src={user?.avatar_url}
                  alt=""
                  className="w-[150px] h-[150px] rounded-xl active:scale-95 transition"
                />
              </div>
            ) : (
              <button
                onClick={() => setModalUploadAvtIsOpen(true)}
                className="bg-black text-white rounded-md p-5"
              >
                Upload avatar photo
              </button>
            )}
            {currentUser?.id === uid && (
              <div className="absolute hidden md:block">
                <label htmlFor="avt-upload" className="hidden md:block">
                  <img
                    src="/icons/Upload.svg"
                    alt=""
                    className="w-15 opacity-0 hover:opacity-70 bg-white rounded-md cursor-pointer transition"
                  />
                </label>
                <input
                  id="avt-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </div>
            )}
          </div>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <div className="flex flex-col justify-center items-center md:justify-start md:items-start gap-2.5 text-nowrap">
              <h2>{user?.name}</h2>
              <div className="flex flex-row gap-2 justify-start items-center">
                <img src="/icons/Location.svg" alt="" className="w-2.5" />
                <div className="font-light text-[16px]">
                  {user?.state}, {user?.city}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2.5">
              <Reputation reps={reps} />
              <div className="text-[16px] font-light text-grey">
                {user?.badge}
              </div>
            </div>
          </div>
          {currentUser?.id === uid && (
            <div>
              <button
                className="hidden md:block font-bold text-[24px] text-black absolute right-5 top-5"
                onClick={() => setModalIsOpen(true)}
              >
                Edit Profile
              </button>

              <button
                className="block md:hidden absolute right-5 top-5 border-1 border-grey p-2 rounded-sm"
                onClick={() => setModalIsOpen(true)}
              >
                <img src="/icons/Edit.svg" className="w-[30px]" />
              </button>
            </div>
          )}
        </div>

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          contentLabel="Edit Profile"
          className="fixed inset-0 flex items-center justify-center"
          overlayClassName=""
        >
          <EditProfile user={user} onClose={() => setModalIsOpen(false)} />
        </Modal>

        <div className="bg-white w-full h-20 rounded-xl shadow-md flex flex-row gap-12 justify-start items-center p-5">
          <button
            className={`font-bold text-[28px] text-blue ${atListing ? "border-b-2" : "border-b-0"}`}
            onClick={ListingButton}
          >
            Listing
          </button>
          <button
            className={`font-bold text-[28px] text-blue ${atListing === false ? "border-b-2" : "border-b-0"}`}
            onClick={ReputationButton}
          >
            Reputation
          </button>
        </div>
        {atListing ? (
          <div>
            {moto !== null ? (
              <div>
                <Carousel
                  ref={carouselRef}
                  additionalTransfrom={0}
                  arrows
                  className="w-full p-2 mb-5"
                  containerClass="carousel-container"
                  itemClass="carousel-item"
                  minimumTouchDrag={80}
                  responsive={{
                    desktop: {
                      breakpoint: { max: 3000, min: 1024 },
                      items: 8,
                    },
                    tablet: {
                      breakpoint: { max: 1024, min: 464 },
                      items: 4,
                    },
                    mobile: {
                      breakpoint: { max: 464, min: 0 },
                      items: 2,
                    },
                  }}
                  sliderClass=""
                  slidesToSlide={1}
                  swipeable
                >
                  {moto
                    .filter((motoItem) => motoItem.is_sold === false)
                    .map((moto) => (
                      <ProductCard key={moto.id} moto={moto} />
                    ))}
                </Carousel>
              </div>
            ) : (
              <span>No motorcycle listing</span>
            )}
          </div>
        ) : (
          <div className="w-full">
            {currentUser !== null &&
              currentUser.id !== uid &&
              alreadyRep === false && (
                <form
                  onSubmit={sendRep}
                  className="flex flex-col gap-3 items-center justify-center bg-white shadow-md p-10 rounded-[6px]"
                >
                  <div className="flex flex-row justify-start items-center gap-2 w-full">
                    <span className="font-bold text-xl">Write:</span>
                    <Select
                      options={[
                        { value: true, label: "+1 Positive" },
                        { value: false, label: "Report" },
                      ]}
                      placeholder="Send a reputation"
                      defaultValue={[{ value: true, label: "+1 Positive" }]}
                      onChange={(selected) => setRepType(selected?.value)}
                      isSearchable={false}
                      className="w-full"
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderColor: "#ccc",
                          boxShadow: "none",
                          "&:hover": { borderColor: "#888" },
                        }),
                      }}
                    />
                  </div>
                  <textarea
                    type="text"
                    className="w-full min-h-25 rounded-md border-1 border-grey p-2.5"
                    value={repMessage || ""}
                    onChange={(e) => setRepMessage(e.target.value)}
                    placeholder="Enter your reputation message"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-md bg-blue "
                  >
                    <span className="text-white font-medium">Submit</span>
                  </button>
                </form>
              )}
            <div className="flex flex-col gap-5 w-full mt-2">
              {reps && reps.length > 0 ? (
                reps.map((repItem) => (
                  <div key={repItem.id}>
                    <ReputationMessage
                      uid_send={repItem.uid_send_rep}
                      message={repItem.rep_message}
                      created_at={repItem.created_at}
                      type={repItem.is_positive_rep ? "Positive" : "Report"}
                    />
                  </div>
                ))
              ) : (
                <p>No reputation available.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
