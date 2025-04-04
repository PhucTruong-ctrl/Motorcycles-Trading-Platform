import React, { useState, useEffect } from "react";
import supabase from "../supabase-client";
import Select from "react-select";
import { motorcycleData } from "../data/motorcycleData";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Loading from "../components/Loading";
import { Message } from "../components/Message";

const Sell = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [NewMoto, setNewMoto] = useState({
    uid: "",
    brand: "",
    type: "",
    model: "",
    trim: "",
    mile: "",
    year: "",
    engine_size: "",
    engine_num: "",
    chassis_num: "",
    registration: false,
    condition: "",
    desc: "",
    price: "",
    image_url: [],
  });
  const [selectedFile, setSelectedFile] = useState([]);
  const [brands, setBrands] = useState([]);

  const typeOptions = [
    { value: "naked", label: "Naked" },
    { value: "classic", label: "Classic" },
    { value: "scrambler", label: "Scrambler" },
    { value: "cruiser", label: "Cruiser" },
    { value: "touring", label: "Touring" },
    { value: "sport", label: "Sport" },
    { value: "offroad", label: "Offroad" },
    { value: "adventure", label: "Adventure" },
    { value: "sport_touring", label: "Sport Touring" },
    { value: "scooters", label: "Scooters" },
    { value: "underbones", label: "Underbones" },
  ];

  const [filteredBrands, setFilteredBrands] = useState([]);
  const [filteredModels, setFilteredModels] = useState([]);
  const [filteredTrims, setFilteredTrims] = useState([]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const user = session?.user || null;
        setCurrentUser(user);
        if (user) {
          setNewMoto((prevState) => ({
            ...prevState,
            uid: user.id,
          }));
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
        setCurrentUser(null);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;

      setLoading(true);
      try {
        const { data: userData, error: userError } = await supabase
          .from("USER")
          .select("*")
          .eq("uid", currentUser.id)
          .single();

        if (userError) throw userError;

        setUser(userData);

        const { data: brandData, error: brandError } = await supabase
          .from("BRAND")
          .select("*");

        if (brandError) throw brandError;

        setBrands(brandData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  const handleTypeChange = (selectedOptions) => {
    if (selectedOptions.length > 0) {
      const selectedType = selectedOptions[0].value;

      const brandsForType = Object.keys(motorcycleData).filter((brand) =>
        Object.keys(motorcycleData[brand]).includes(selectedType)
      );

      console.log("Filtered brands for type:", brandsForType);
      setFilteredBrands(brandsForType);
      setFilteredModels([]);
      setFilteredTrims([]);

      setNewMoto((prevState) => ({
        ...prevState,
        type: selectedType,
        brand: "",
        model: "",
        trim: "",
      }));
    }
  };

  const handleBrandChange = (selectedOptions) => {
    if (selectedOptions.length > 0) {
      const selectedBrand = selectedOptions[0].value;

      console.log("Selected brand:", selectedBrand);

      const modelsForBrandAndType =
        motorcycleData[selectedBrand]?.[NewMoto.type] || [];

      setFilteredModels(modelsForBrandAndType);
      setFilteredTrims([]);

      setNewMoto((prevState) => ({
        ...prevState,
        brand: selectedBrand,
        model: "",
        trim: "",
      }));
    }
  };

  const handleModelChange = (selectedOptions) => {
    if (selectedOptions.length > 0) {
      const selectedModel = selectedOptions[0].value;

      const modelDetails = motorcycleData[NewMoto.brand]?.[NewMoto.type]?.find(
        (model) => model.model === selectedModel
      );
      const trimsForModel = modelDetails?.trims || [];
      setFilteredTrims(trimsForModel);

      setNewMoto((prevState) => ({
        ...prevState,
        model: selectedModel,
        trim: "",
        engine_size: "",
      }));
    }
  };

  const handleTrimChange = (selectedOptions) => {
    if (selectedOptions.length > 0) {
      const selectedTrimName = selectedOptions[0].value;

      const selectedTrim = filteredTrims.find(
        (trim) => trim.name === selectedTrimName
      );
      setNewMoto((prevState) => ({
        ...prevState,
        trim: selectedTrimName,
        engine_size: selectedTrim ? selectedTrim.engine_size : "",
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewMoto({
      ...NewMoto,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFile((prevFiles) => [...files.toReversed(), ...prevFiles]);
  };

  const removeFile = (index) => {
    setSelectedFile((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const uploadFiles = async (files) => {
    if (!files || files.length === 0) return [];

    const urls = [];

    for (const file of files) {
      const fileName = `${currentUser.id}-${Date.now()}-${file.name}`;
      const filePath = `${currentUser.id}/${fileName}`;
      try {
        const { error } = await supabase.storage
          .from("motorcycle-media")
          .upload(filePath, file);

        if (error) throw error;

        const { data } = supabase.storage
          .from("motorcycle-media")
          .getPublicUrl(filePath);

        urls.push(data.publicUrl);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }

    return urls;
  };

  const addButton = () => {
    setLoadingSubmit(true);
  };

  const addMoto = async (e) => {
    e.preventDefault();

    console.log("NewMoto before submission:", NewMoto);

    if (!NewMoto.uid) {
      alert("User not found. Please log in again.");
      return;
    }

    try {
      let imageUrls = NewMoto.image_url;

      if (selectedFile && selectedFile.length > 0) {
        imageUrls = await uploadFiles(selectedFile);
        if (imageUrls.length === 0) {
          alert("Error uploading images. Please try again.");
          return;
        }
      }

      const selectedBrand = brands.find(
        (brand) => brand.name === NewMoto.brand
      );
      console.log("Selected brand:", selectedBrand);

      if (!selectedBrand) {
        alert("Invalid brand selected. Please try again.");
        return;
      }

      const brandName = selectedBrand.name;

      const { data, error } = await supabase.from("MOTORCYCLE").insert([
        {
          ...NewMoto,
          brand: brandName,
          model: NewMoto.model,
          trim: NewMoto.trim,
          image_url: imageUrls,
        },
      ]);

      if (error) {
        throw error;
      }

      console.log("Motorcycle added successfully:", data);
      alert("Motorcycle added successfully!");

      setNewMoto({
        uid: currentUser.id,
        brand: "",
        type: "",
        model: "",
        trim: "",
        mile: "",
        year: "",
        engine_size: "",
        engine_num: "",
        chassis_num: "",
        registration: false,
        condition: "",
        desc: "",
        price: "",
        image_url: [],
      });
      setSelectedFile([]);
      setLoadingSubmit(false);
    } catch (error) {
      console.error("Error adding motorcycle:", error);
      setLoadingSubmit(false);
      alert("Error adding motorcycle. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading</div>;
  }
  if (!currentUser) {
    return <div>Please log in to sell a motorcycle</div>;
  }

  if (!user) {
    return <Loading />;
  }
  return (
    <div>
      <main className="my-[15px] mx-[25px]">
        <Message />
        <header className="mb-5">
          <Header />
        </header>

        {user.citizen_id === null && <div>Please update your citizen id!</div>}

        {user.phone_num === null && <div>Please update your phone number!</div>}

        {user.email === null && <div>Please update your email!</div>}

        {user.state === null && <div>Please update your state!</div>}

        {user.city === null && <div>Please update your city!</div>}

        {user.citizen_id != null &&
          user.phone_num != null &&
          user.email != null &&
          user.state != null &&
          user.city != null && (
            <div className="flex flex-row justify-evenly items-center">
              <form
                className="flex flex-col gap-3 items-center justify-center w-200 bg-white shadow-md shadow-grey p-10 rounded-[6px]"
                onSubmit={addMoto}
              >
                <div className="self-start flex flex-col gap-1 pb-5 border-b-1 border-grey">
                  <div className="font-bold text-4xl">Sell Your Motorcycle</div>
                  <div className="">
                    List with confidence. With fraud protection and first class
                    customer service, you'll be protected every step of the way.
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-5">
                  <div className="flex flex-col w-full">
                    <div className="font-bold text-xl p-2 text-center">
                      Type
                    </div>
                    <Select
                      options={typeOptions}
                      onChange={(selectedOption) =>
                        handleTypeChange([selectedOption])
                      }
                      value={typeOptions.find(
                        (option) => option.value === NewMoto.type
                      )}
                      placeholder="Select type"
                      isSearchable
                      className="text-[18px]"
                      required
                    />
                  </div>

                  <div className="flex flex-col w-full">
                    <div className="font-bold text-xl p-2 text-center">
                      Brand
                    </div>
                    <Select
                      options={filteredBrands.map((brand) => ({
                        label: brand,
                        value: brand,
                      }))}
                      onChange={(selectedOption) =>
                        handleBrandChange([selectedOption])
                      }
                      value={filteredBrands
                        .map((brand) => ({ label: brand, value: brand }))
                        .find((option) => option.value === NewMoto.brand)}
                      placeholder="Select brand"
                      isSearchable
                      className="text-[18px]"
                      isDisabled={!NewMoto.type}
                      required
                    />
                  </div>

                  <div className="flex flex-col w-full">
                    <div className="font-bold text-xl p-2 text-center">
                      Model
                    </div>
                    <Select
                      options={filteredModels.map((model) => ({
                        label: model.model,
                        value: model.model,
                      }))}
                      onChange={(selectedOption) =>
                        handleModelChange([selectedOption])
                      }
                      value={filteredModels
                        .map((model) => ({
                          label: model.model,
                          value: model.model,
                        }))
                        .find((option) => option.value === NewMoto.model)}
                      placeholder="Select model"
                      isSearchable
                      className="text-[18px]"
                      isDisabled={!NewMoto.brand}
                      required
                    />
                  </div>

                  <div className="flex flex-col w-full">
                    <div className="font-bold text-xl p-2 text-center">
                      Trims
                    </div>
                    <Select
                      options={filteredTrims.map((trim) => ({
                        label: trim.name,
                        value: trim.name,
                      }))}
                      onChange={(selectedOption) =>
                        handleTrimChange([selectedOption])
                      }
                      value={filteredTrims
                        .map((trim) => ({
                          label: trim.name,
                          value: trim.name,
                        }))
                        .find((option) => option.value === NewMoto.trim)}
                      placeholder="Select trim"
                      isSearchable
                      className="text-[18px]"
                      isDisabled={!NewMoto.model}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-3 justify-center items-center w-full">
                    <div className="font-bold text-xl p-2 text-center">
                      Year
                    </div>
                    <input
                      type="number"
                      name="year"
                      className="border-2 border-grey rounded-[4px] p-2 w-full"
                      placeholder="Enter Manufacture Year"
                      value={NewMoto.year}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  {NewMoto.condition !== "New" && (
                    <div className="flex flex-col gap-3 justify-center items-center w-full">
                      <div className="font-bold text-xl p-2 text-center">
                        Mileage
                      </div>
                      <input
                        type="number"
                        name="mile"
                        className="border-2 border-grey rounded-[4px] p-2 w-full"
                        placeholder="Enter Current Mileage"
                        value={NewMoto.mile}
                        onChange={handleInputChange}
                      />
                    </div>
                  )}
                  <div className="flex flex-col gap-3 justify-center items-center w-full">
                    <div className="font-bold text-xl p-2 text-center">
                      Engine Number
                    </div>
                    <input
                      type="text"
                      name="engine_num"
                      className="border-2 border-grey rounded-[4px] p-2 w-full"
                      placeholder="Enter Engine Number"
                      value={NewMoto.engine_num}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-3 justify-center items-center w-full">
                    <div className="font-bold text-xl p-2 text-center">
                      Chassis Number
                    </div>
                    <input
                      type="text"
                      name="chassis_num"
                      className="border-2 border-grey rounded-[4px] p-2 w-full"
                      placeholder="Enter Chassis Number"
                      value={NewMoto.chassis_num}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="w-full flex flex-col gap-3 justify-center items-center">
                  <div className="font-bold text-xl">Condition</div>
                  <ul className="grid w-full gap-6 grid-cols-2">
                    <li className="">
                      <input
                        type="radio"
                        id="used"
                        name="condition"
                        className="hidden peer"
                        value="Used"
                        checked={NewMoto.condition === "Used"}
                        onChange={handleInputChange}
                        required
                      />
                      <label
                        htmlFor="used"
                        className="inline-flex items-center justify-between w-full h-40 p-5 text-black border border-grey rounded-lg cursor-pointer peer-checked:bg-blue peer-checked:text-white hover:scale-105 active:scale-110 transition  "
                      >
                        <div className="block">
                          <div className="w-full text-xl font-semibold">
                            Used
                          </div>
                          <div className="w-full">
                            Pre-loved motorcycle with stories to tell
                          </div>
                        </div>
                      </label>
                    </li>
                    <li>
                      <input
                        type="radio"
                        id="new"
                        name="condition"
                        className="hidden peer"
                        value="New"
                        checked={NewMoto.condition === "New"}
                        onChange={handleInputChange}
                        required
                      />
                      <label
                        htmlFor="new"
                        className="inline-flex items-center justify-between w-full h-40 p-5 text-black border border-grey rounded-lg cursor-pointer peer-checked:bg-blue peer-checked:text-white hover:scale-105 active:scale-110 transition  "
                      >
                        <div className="relative block overflow-hidden">
                          <div className="w-full text-xl font-semibold">
                            New
                          </div>
                          <div className="w-full">
                            Brand new motorcycle without any thought!
                          </div>
                        </div>
                      </label>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col gap-3 justify-center items-center w-full">
                  <div className="font-bold text-xl p-2 text-center">
                    Description
                  </div>
                  <input
                    type="text"
                    name="desc"
                    className="border-2 border-grey rounded-[4px] p-2 w-full min-h-50"
                    placeholder="Enter Description"
                    value={NewMoto.desc}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="flex flex-row gap-3 justify-center items-center w-full">
                  <div className="flex flex-col gap-3 justify-center items-center w-full">
                    <div className="font-bold text-xl p-2 text-center">
                      Price
                    </div>
                    <input
                      type="number"
                      name="price"
                      className="border-2 border-grey rounded-[4px] p-2 w-full"
                      placeholder="Enter Price"
                      value={NewMoto.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-3 justify-center items-center w-full">
                    <div className="font-bold text-xl p-2 text-center">
                      Registration
                    </div>
                    <input
                      type="checkbox"
                      name="registration"
                      className="border-2 w-5 h-5"
                      checked={NewMoto.registration}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="img_input"
                    className="block mb-2 font-bold text-xl p-2 text-center"
                  >
                    Upload Images:
                  </label>
                  <input
                    id="img_input"
                    type="file"
                    accept="image/*"
                    multiple
                    placeholder=""
                    onChange={handleFileSelect}
                    className="p-5 text-sm text-gray-900 border-2 border-gray rounded-[6px] cursor-pointer bg-gray-50 hover:scale-105 transition"
                    required
                  />
                  <div className="grid grid-cols-2 md:grid-cols-4 w-full gap-2 mt-5 rounded-[6px] max-h-100 overflow-y-scroll">
                    {selectedFile.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt="Selected"
                          className="w-30 h-30 object-cover rounded-[6px]"
                        />
                        <button
                          className="absolute top-0 right-0 bg-black text-white rounded-[6px] p-1"
                          onClick={() => removeFile(index)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-[6px] bg-black text-white text-2xl font-bold p-3 hover:scale-105 transition"
                  onClick={addButton}
                >
                  {loadingSubmit === false && <div>Sell My Motorcycle</div>}
                  {loadingSubmit === true && <Loading />}
                </button>
              </form>
            </div>
          )}
        <div className="mt-5">
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default Sell;
