import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import supabase from "../supabase-client";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Select from "react-select";
import { NumericFormat } from "react-number-format";
import { motorcycleData } from "../data/motorcycleData";
import { Message } from "../components/Message";
import Loading from "../components/Loading";
import LoadingFull from "../components/LoadingFull";
import { compressImage } from "../components/imageCompresser";
import QuillEditor from "../components/QuillEditor";

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [moto, setMoto] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);

  const [filteredBrands, setFilteredBrands] = useState([]);
  const [filteredModels, setFilteredModels] = useState([]);
  const [filteredTrims, setFilteredTrims] = useState([]);

  const typeOptions = [
    { value: "naked", label: "Naked" },
    { value: "cruiser", label: "Cruiser" },
    { value: "touring", label: "Touring" },
    { value: "sport", label: "Sport" },
    { value: "offroad", label: "Offroad" },
    { value: "adventure", label: "Adventure" },
    { value: "sport_touring", label: "Sport Touring" },
    { value: "scooters", label: "Scooters" },
    { value: "underbones", label: "Underbones" },
  ];

  const initializeDropdowns = (motoData) => {
    const type = motoData.type;
    const brands = Object.keys(motorcycleData).filter((brand) =>
      Object.keys(motorcycleData[brand]).includes(type)
    );
    setFilteredBrands(brands);

    const brand = motoData.brand;
    const models = motorcycleData[brand]?.[type] || [];
    setFilteredModels(models);

    const model = motoData.model;
    const trims = models.find((m) => m.model === model)?.trims || [];
    setFilteredTrims(trims);
  };

  const handleTypeChange = (selectedOption) => {
    const type = selectedOption?.value;
    if (!type) return;

    const brands = Object.keys(motorcycleData).filter((brand) =>
      Object.keys(motorcycleData[brand]).includes(type)
    );

    setFilteredBrands(brands);
    setFilteredModels([]);
    setFilteredTrims([]);

    setMoto((prev) => ({
      ...prev,
      type,
      brand: "",
      model: "",
      trim: "",
    }));
  };

  const handleBrandChange = (selectedOption) => {
    const brand = selectedOption?.value;
    if (!brand) return;

    const models = motorcycleData[brand]?.[moto.type] || [];

    setFilteredModels(models);
    setFilteredTrims([]);

    setMoto((prev) => ({
      ...prev,
      brand,
      model: "",
      trim: "",
    }));
  };

  const handleTrimChange = (selectedOptions) => {
    if (selectedOptions.length > 0) {
      const selectedTrimName = selectedOptions[0].value;

      const selectedTrim = filteredTrims.find(
        (trim) => trim.name === selectedTrimName
      );
      setMoto((prevState) => ({
        ...prevState,
        trim: selectedTrimName,
        engine_size: selectedTrim ? selectedTrim.engine_size : "",
      }));
    }
  };

  const handleModelChange = (selectedOption) => {
    const model = selectedOption?.value;
    if (!model) return;

    const trims = filteredModels.find((m) => m.model === model)?.trims || [];

    setFilteredTrims(trims);
    setMoto((prev) => ({
      ...prev,
      model,
      trim: "",
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMoto((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileSelect = async (e) => {
    setSubmitting(true);
    const files = Array.from(e.target.files);
    const compressedFiles = await Promise.all(
      files.map(async (file) => {
        if (file.type.startsWith("image/")) {
          return await compressImage(file);
        }
        return file;
      })
    );

    setSelectedFiles((prevFiles) => {
      const uniqueFiles = compressedFiles.filter(
        (file) =>
          !prevFiles.some(
            (prevFile) =>
              prevFile.name === file.name &&
              prevFile.size === file.size &&
              prevFile.lastModified === file.lastModified
          )
      );
      return [...uniqueFiles, ...prevFiles];
    });
    setSubmitting(false);
  };

  const removeFile = (index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleDeleteImage = async (imageUrl) => {
    try {
      const pathParts = imageUrl.split("/");
      const fileName = pathParts[pathParts.length - 1];
      const filePath = `${moto.uid}/${fileName}`;

      const { error } = await supabase.storage
        .from("motorcycle-media")
        .remove([filePath]);

      if (error) throw error;

      setMoto((prev) => ({
        ...prev,
        image_url: prev.image_url.filter((url) => url !== imageUrl),
      }));

      setDeletedImages((prev) => [...prev, imageUrl]);
    } catch (error) {
      console.error("Image delete error:", error);
      alert("Image delete failed!");
    }
  };

  const uploadNewImages = async () => {
    if (!selectedFiles.length) return [];
    const reverseFiles = selectedFiles.toReversed();
    const newUrls = [];
    for (const file of reverseFiles) {
      const filePath = `${moto.uid}/${Date.now()}-${file.name}`;

      const { error } = await supabase.storage
        .from("motorcycle-media")
        .upload(filePath, file);

      if (error) throw error;

      const {
        data: { publicUrl },
      } = await supabase.storage
        .from("motorcycle-media")
        .getPublicUrl(filePath);

      newUrls.push(publicUrl);
    }
    return newUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const newImageUrls = await uploadNewImages();

      const payload = {
        ...moto,
        uid: moto.uid,
        image_url: [...moto.image_url, ...newImageUrls],
      };

      const { error } = await supabase
        .from("MOTORCYCLE")
        .update(payload)
        .eq("id", id)
        .eq("uid", moto.uid);

      if (error) throw error;

      if (deletedImages.length > 0) {
        const paths = deletedImages.map((url) => {
          const parts = url.split("/");
          return parts[parts.length - 1];
        });

        await supabase.storage.from("motorcycle-media").remove(paths);
      }

      if (!moto.type || !moto.brand || !moto.model) {
        alert("Please fill all the information");
        return;
      }

      alert("Update complete!");
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
    } catch (error) {
      console.error("Update error:", error);
      alert("Update failed!");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (moto) {
      document.title = `Edit ${moto.brand} ${moto.model} ${moto.trim}`;
    }
  }, [moto]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: motoData, error: motoError } = await supabase
          .from("MOTORCYCLE")
          .select("*")
          .eq("id", id)
          .single();

        if (motoError) throw motoError;

        initializeDropdowns(motoData);
        setMoto({
          ...motoData,
          image_url: motoData.image_url || [],
        });
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <LoadingFull />;
  if (error) return <div>Error: {error.message}</div>;
  if (!moto) return <div>Product not found</div>;

  return (
    <div>
      <main className="my-[15px] mx-[25px]">
        <Message />
        <header className="mb-5">
          <Header />
        </header>

        <div className="flex flex-row justify-evenly items-center">
          <form
            className="flex flex-col gap-3 items-center justify-center w-200 bg-white shadow-md shadow-grey p-10 rounded-[6px]"
            onSubmit={handleSubmit}
          >
            <div className="self-start flex flex-col gap-1 pb-5 border-b-1 border-grey">
              <div className="font-bold text-4xl">Edit Your Motorcycle</div>
              <div className="">
                Update your listing with the latest information and photos.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-5">
              <div className="flex flex-col w-full">
                <div className="font-bold text-xl p-2 text-center">Type</div>
                <Select
                  options={typeOptions}
                  onChange={handleTypeChange}
                  value={typeOptions.find((opt) => opt.value === moto.type)}
                  placeholder="Select type"
                  isSearchable={false}
                  className="text-[18px]"
                  required
                />
              </div>

              <div className="flex flex-col w-full">
                <div className="font-bold text-xl p-2 text-center">Brand</div>
                <Select
                  options={filteredBrands.map((b) => ({ label: b, value: b }))}
                  value={
                    filteredBrands.find((b) => b === moto.brand)
                      ? { label: moto.brand, value: moto.brand }
                      : null
                  }
                  onChange={handleBrandChange}
                  placeholder="Select brand"
                  isSearchable={false}
                  className="text-[18px]"
                  isDisabled={!moto.type}
                  required
                />
              </div>

              <div className="flex flex-col w-full">
                <div className="font-bold text-xl p-2 text-center">Model</div>
                <Select
                  options={filteredModels.map((m) => ({
                    label: m.model,
                    value: m.model,
                  }))}
                  value={
                    filteredModels.find((m) => m.model === moto.model)
                      ? { label: moto.model, value: moto.model }
                      : null
                  }
                  onChange={handleModelChange}
                  placeholder="Select model"
                  isSearchable={false}
                  className="text-[18px]"
                  isDisabled={!moto.brand}
                  required
                />
              </div>

              <div className="flex flex-col w-full">
                <div className="font-bold text-xl p-2 text-center">Trim</div>
                <Select
                  options={filteredTrims.map((trim) => ({
                    label: trim.name,
                    value: trim.name,
                  }))}
                  onChange={(selectedOption) =>
                    handleTrimChange([selectedOption])
                  }
                  value={filteredTrims
                    .map((trim) => ({ label: trim.name, value: trim.name }))
                    .find((option) => option.value === moto.trim)}
                  placeholder="Select trim"
                  isSearchable={false}
                  className="text-[18px]"
                  isDisabled={!moto.model}
                  required
                />
              </div>

              <div className="flex flex-col gap-3 justify-center items-center w-full">
                <div className="font-bold text-xl p-2 text-center">Year</div>
                <NumericFormat
                  className="border-2 border-grey rounded-[4px] p-2 w-full"
                  placeholder="Enter Manufacture Year"
                  onValueChange={(values) => {
                    setMoto({
                      ...moto,
                      year: values.value,
                    });
                  }}
                  value={moto.year}
                  required
                />
              </div>

              {moto.condition !== "New" && (
                <div className="flex flex-col gap-3 justify-center items-center w-full">
                  <div className="font-bold text-xl p-2 text-center">
                    Mileage
                  </div>
                  <NumericFormat
                    className="border-2 border-grey rounded-[4px] p-2 w-full"
                    thousandSeparator={true}
                    placeholder="Enter Current Mileages"
                    onValueChange={(values) => {
                      setMoto({
                        ...moto,
                        mile: values.value,
                      });
                    }}
                    required
                    value={moto.condition !== "New" ? moto.mile : 0}
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
                  value={moto.engine_num}
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
                  value={moto.chassis_num}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 justify-start items-center w-full">
              <div className="font-bold text-xl p-2 text-center">
                Description *
              </div>
              <div className="h-98 sm:h-70 md:h-62">
                <QuillEditor
                  value={moto.desc}
                  onChange={(html) => setMoto({ ...moto, desc: html })}
                />
              </div>
            </div>

            <div className="flex flex-row gap-3 justify-center items-center w-full">
              <div className="flex flex-col gap-3 justify-center items-center w-full">
                <div className="font-bold text-xl p-2 text-center">Price</div>
                <NumericFormat
                  className="border-2 border-grey rounded-[4px] p-2 w-full"
                  thousandSeparator={true}
                  placeholder="Enter Price"
                  prefix="$"
                  onValueChange={(values) => {
                    setMoto({
                      ...moto,
                      price: values.value,
                    });
                  }}
                  value={moto.price}
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
                  checked={moto.registration}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col w-full">
              <label
                htmlFor="current_images"
                className="block mb-2 font-bold text-xl p-2 text-center"
              >
                Current Images:
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {moto.image_url.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Preview ${index}`}
                      className="w-full h-30 object-cover rounded-[6px]"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(url)}
                      className="absolute top-0 right-0 bg-black text-white rounded-[6px] p-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col w-full">
              <label
                htmlFor="new_images"
                className="flex flex-row justify-center items-center gap-1 font-bold text-xl p-2 text-center text-black rounded-sm border-1 border-black cursor-pointer"
              >
                <img src="/icons/Upload.svg" alt="" className="w-10" />
                <span>Add New Images</span>
              </label>
              <input
                id="new_images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      className="w-full h-30 object-cover rounded-[6px]"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-0 right-0 bg-black text-white rounded-[6px] p-1"
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
              disabled={submitting}
            >
              {submitting ? <Loading /> : "Update Listing"}
            </button>
          </form>
        </div>

        <div className="mt-5">
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default EditProduct;
