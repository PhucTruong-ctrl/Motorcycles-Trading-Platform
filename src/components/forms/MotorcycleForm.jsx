import React, { useState, useEffect, useCallback } from "react";
import Select from "react-select";
import { NumericFormat } from "react-number-format";
import motorcycleData from "../../data/motorcycleData.json";
import LoadingWhite from "../ui/LoadingWhite";
import QuillEditor from "../../lib/QuillEditor";
import { compressImage } from "../../utils/imageCompresser";
import Loading from "../ui/Loading";

const MotorcycleForm = ({
  initialData,
  onSubmit,
  isSubmitting,
  mode = "create",
  onDeleteImage,
}) => {
  const [formData, setFormData] = useState(initialData);
  const [imageLoading, setImageLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [filteredModels, setFilteredModels] = useState([]);
  const [filteredTrims, setFilteredTrims] = useState([]);

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

      setFormData((prevState) => ({
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
        motorcycleData[selectedBrand]?.[formData.type] || [];

      setFilteredModels(modelsForBrandAndType);
      setFilteredTrims([]);

      setFormData((prevState) => ({
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

      const modelDetails = motorcycleData[formData.brand]?.[
        formData.type
      ]?.find((model) => model.model === selectedModel);
      const trimsForModel = modelDetails?.trims || [];
      setFilteredTrims(trimsForModel);

      setFormData((prevState) => ({
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
      setFormData((prevState) => ({
        ...prevState,
        trim: selectedTrimName,
        engine_size: selectedTrim ? selectedTrim.engine_size : "",
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleDescChange = useCallback((html) => {
    setFormData((prev) => ({ ...prev, desc: html }));
  }, []);

  const handleFileSelect = async (e) => {
    setImageLoading(true);
    const newFiles = Array.from(e.target.files);
    const compressedFiles = await Promise.all(
      newFiles.map(async (file) => {
        if (file.type.startsWith("image/")) {
          return await compressImage(file);
        }
        return file;
      })
    );

    setSelectedFiles((prevFiles) => {
      const uniqueNewFiles = compressedFiles.filter(
        (newFile) =>
          !prevFiles.some(
            (prevFile) =>
              prevFile.name === newFile.name &&
              prevFile.size === newFile.size &&
              prevFile.lastModified === newFile.lastModified
          )
      );
      return [...uniqueNewFiles, ...prevFiles];
    });
    e.target.value = "";
    setImageLoading(false);
  };

  const removeFile = (index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.condition) {
      alert("Please select a condition (Used or New)");
      return;
    }

    console.log("Submitting:", { formData, selectedFiles });
    onSubmit({
      formData: formData,
      selectedFiles: selectedFiles,
    });
  };

  useEffect(() => {
    if (formData.mile > 5) {
      setFormData((prev) => ({ ...prev, condition: "Used" }));
    } else if (formData.mile === "" || formData.mile === 0) {
      setFormData((prev) => ({ ...prev, condition: "New" }));
    }
  }, [formData.mile]);

  return (
    <div className="flex flex-row justify-evenly items-center">
      <form
        className="flex flex-col gap-6 md:gap-3 items-center justify-center w-full md:w-200 bg-white shadow-md shadow-grey p-10 rounded-[6px]"
        onSubmit={handleSubmit}
      >
        <div className="self-start flex flex-col gap-1 pb-5 border-b-1 border-grey">
          <div className="font-bold text-4xl">Sell Your Motorcycle</div>
          <div>
            List with confidence. With fraud protection and first class customer
            service, you'll be protected every step of the way.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-5">
          <div className="flex flex-col w-full">
            <div className="font-bold text-xl p-2 text-center">Type *</div>
            <Select
              name="typeSelect"
              options={typeOptions}
              onChange={(selectedOption) => handleTypeChange([selectedOption])}
              value={typeOptions.find(
                (option) => option.value === formData.type
              )}
              placeholder="Select type"
              isSearchable={false}
              isDisabled={false}
              className="text-[18px]"
              required={!formData.type}
            />
          </div>

          <div className="flex flex-col w-full">
            <div className="font-bold text-xl p-2 text-center">Brand *</div>
            <Select
              name="brandSelect"
              options={filteredBrands.map((brand) => ({
                label: brand,
                value: brand,
              }))}
              onChange={(selectedOption) => handleBrandChange([selectedOption])}
              value={filteredBrands
                .map((brand) => ({ label: brand, value: brand }))
                .find((option) => option.value === formData.brand)}
              placeholder="Select brand"
              isSearchable={false}
              className="text-[18px]"
              required={formData.type && !formData.brand}
              isDisabled={!formData.type}
            />
          </div>

          <div className="flex flex-col w-full">
            <div className="font-bold text-xl p-2 text-center">Model *</div>
            <Select
              name="modelSelect"
              options={filteredModels.map((model) => ({
                label: model.model,
                value: model.model,
              }))}
              onChange={(selectedOption) => handleModelChange([selectedOption])}
              value={filteredModels
                .map((model) => ({
                  label: model.model,
                  value: model.model,
                }))
                .find((option) => option.value === formData.model)}
              placeholder="Select model"
              isSearchable={false}
              className="text-[18px]"
              required={formData.brand && !formData.model}
              isDisabled={!formData.brand}
            />
          </div>

          <div className="flex flex-col w-full">
            <div className="font-bold text-xl p-2 text-center">Trims *</div>
            <Select
              name="trimSelect"
              options={filteredTrims.map((trim) => ({
                label: trim.name,
                value: trim.name,
              }))}
              onChange={(selectedOption) => handleTrimChange([selectedOption])}
              value={filteredTrims
                .map((trim) => ({
                  label: trim.name,
                  value: trim.name,
                }))
                .find((option) => option.value === formData.trim)}
              placeholder="Select trim"
              isSearchable={false}
              className="text-[18px]"
              required={formData.model && !formData.trim}
              isDisabled={!formData.model}
            />
          </div>

          <div className="flex flex-col gap-3 justify-center items-center w-full">
            <div className="font-bold text-xl p-2 text-center">
              Stock Number *
            </div>
            <input
              type="text"
              name="engine_num"
              className="border-2 border-grey rounded-[4px] p-2 w-full"
              placeholder="Enter Engine Number"
              value={formData.engine_num}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex flex-col gap-3 justify-center items-center w-full">
            <div className="font-bold text-xl p-2 text-center">VIN *</div>
            <input
              type="text"
              name="chassis_num"
              className="border-2 border-grey rounded-[4px] p-2 w-full"
              placeholder="Enter Chassis Number"
              value={formData.chassis_num}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="flex flex-col gap-3 justify-center items-center w-full">
            <div className="font-bold text-xl p-2 text-center">Year *</div>
            <NumericFormat
              allowNegative={false}
              name="yearInput"
              className="border-2 border-grey rounded-[4px] p-2 w-full"
              placeholder="Enter Manufacture Year"
              onValueChange={(values) => {
                setFormData((prev) => ({
                  ...prev,
                  year: values.value,
                }));
              }}
              value={formData.year}
              maxLength={4}
              required
            />
          </div>
          <div className="flex flex-col gap-3 justify-center items-center w-full">
            <div className="font-bold text-xl p-2 text-center">Mileage *</div>
            <NumericFormat
              allowNegative={false}
              name="mileInput"
              className="border-2 border-grey rounded-[4px] p-2 w-full"
              thousandSeparator={true}
              placeholder="Enter Current Mileages"
              onValueChange={(values) => {
                setFormData((prev) => ({
                  ...prev,
                  mile: values.value,
                }));
              }}
              required={formData.condition !== "New"}
              value={formData.condition !== "New" ? formData.mile : 0}
              maxLength={7}
            />
          </div>
        </div>

        <div className="w-full flex flex-col gap-3 justify-center items-center">
          <div className="font-bold text-xl">Condition *</div>
          <ul className="grid w-full gap-6 grid-cols-2">
            <li className="">
              <input
                type="radio"
                id="used"
                name="condition"
                className="hidden peer"
                value="Used"
                checked={formData.condition === "Used"}
                onChange={handleInputChange}
              />
              <label
                htmlFor="used"
                className="inline-flex items-center justify-between w-full h-40 p-5 text-black border border-grey rounded-lg cursor-pointer peer-checked:bg-blue peer-checked:text-white hover:scale-105 active:scale-110 transition  "
              >
                <div className="block">
                  <div className="w-full text-xl font-semibold">Used</div>
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
                checked={formData.condition === "New"}
                onChange={handleInputChange}
              />
              <label
                htmlFor="new"
                className="inline-flex items-center justify-between w-full h-40 p-5 text-black border border-grey rounded-lg cursor-pointer peer-checked:bg-blue peer-checked:text-white hover:scale-105 active:scale-110 transition  "
              >
                <div className="relative block overflow-hidden">
                  <div className="w-full text-xl font-semibold">New</div>
                  <div className="w-full">
                    Brand new motorcycle without any thought!
                  </div>
                </div>
              </label>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-3 justify-start items-center w-full">
          <div className="font-bold text-xl p-2 text-center">Description *</div>
          <div className="h-98 sm:h-70 md:h-52">
            <QuillEditor
              value={formData.desc}
              onChange={handleDescChange}
              key="quill-editor"
            />
          </div>
        </div>

        <div className="flex flex-row gap-3 justify-center items-start w-full">
          <div className="flex flex-col gap-3 justify-center items-center w-full">
            <div className="font-bold text-xl p-2 text-center">Price *</div>
            <NumericFormat
              allowNegative={false}
              className="border-2 border-grey rounded-[4px] p-2 w-full"
              thousandSeparator={true}
              required
              placeholder="Enter Price"
              prefix="$"
              onValueChange={(values) => {
                setFormData((prev) => ({
                  ...prev,
                  price: values.value,
                }));
              }}
              value={formData.price}
              maxLength={8}
            />
          </div>
          <div className="flex flex-col gap-3 justify-center items-center w-full">
            <div className="font-bold text-xl p-2 text-center">
              Registration *
            </div>
            <input
              type="checkbox"
              name="registration"
              className="border-2 w-5 h-5"
              checked={formData.registration}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="w-full flex flex-col">
          <label
            htmlFor="img_input"
            className="flex flex-row justify-center items-center gap-1 font-bold text-xl p-2 text-center text-black rounded-sm border-1 border-black cursor-pointer hover:scale-105 disabled:opacity-75 transition"
          >
            {imageLoading ? (
              <Loading></Loading>
            ) : (
              <div className="flex justify-center items-center gap-1">
                <img src="/icons/Upload.svg" alt="" className="w-10" />{" "}
                <span>Upload Image *</span>
              </div>
            )}
          </label>
          <input
            id="img_input"
            type="file"
            accept="image/*"
            multiple
            placeholder=""
            onChange={handleFileSelect}
            className="hidden"
            disabled={imageLoading}
          />
          <div className="border-1 border-black grid grid-cols-2 md:grid-cols-5 w-full gap-2 mt-5 rounded-[6px] max-h-100 overflow-y-scroll">
            {mode === "edit" &&
              initialData.image_url?.map((url, index) => (
                <div key={`existing-${index}`} className="relative w-30">
                  <img
                    src={url}
                    alt={`Preview ${index}`}
                    className="w-30 h-30 object-cover rounded-[6px]"
                  />
                  <button
                    type="button"
                    onClick={() => onDeleteImage(url)}
                    className="absolute top-0 right-0 bg-black text-white rounded-[6px] p-1"
                  >
                    ✕
                  </button>
                </div>
              ))}

            {selectedFiles.map((file, index) => (
              <div key={index} className="relative w-30">
                <img
                  src={URL.createObjectURL(file)}
                  alt="Selected"
                  className="w-30 h-30 object-cover rounded-[6px]"
                />
                <button
                  type="button"
                  className="absolute top-0 right-0 bg-black text-white rounded-[6px] p-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-[6px] bg-black text-white text-2xl font-bold p-3 hover:scale-105 transition disabled:opacity-75"
        >
          {isSubmitting ? (
            <LoadingWhite />
          ) : mode === "create" ? (
            "Sell My Motorcycle"
          ) : (
            "Update Listing"
          )}
        </button>
      </form>
    </div>
  );
};

export default MotorcycleForm;
