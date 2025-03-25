import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motorcycleData } from "../data/motorcycleData";
import Select from "react-dropdown-select";
import queryString from "query-string";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";

const FilterBar = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedTrim, setSelectedTrim] = useState("");
  const [condition, setCondition] = useState("");

  const [price, setPrice] = useState([0, 100000]);
  const [mileage, setMileage] = useState([0, 999999]);
  const [year, setYear] = useState([1895, new Date().getFullYear()]);
  const [engineSize, setEngineSize] = useState([0, 3000]);

  const [debouncedPrice, setDebouncedPrice] = useState(price);
  const [debouncedMileage, setDebouncedMileage] = useState(mileage);
  const [debouncedYear, setDebouncedYear] = useState(year);
  const [debouncedEngineSize, setDebouncedEngineSize] = useState(engineSize);

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
    { value: "sportTouring", label: "Sport Touring" },
    { value: "scooters", label: "Scooters" },
    { value: "underbones", label: "Underbones" },
  ];

  useEffect(() => {
    const brandsForType = Object.keys(motorcycleData).filter((brand) =>
      Object.keys(motorcycleData[brand]).includes(selectedType)
    );
    setFilteredBrands(brandsForType);
    const modelsForBrandAndType =
      motorcycleData[selectedBrand]?.[selectedType] || [];
    setFilteredModels(modelsForBrandAndType);
    const modelDetails = motorcycleData[selectedBrand]?.[selectedType]?.find(
      (model) => model.model === selectedModel
    );
    const trimsForModel = modelDetails?.trims || [];
    setFilteredTrims(trimsForModel);
  }, [selectedType, selectedBrand, selectedModel]);

  const formatNumber = (number) => {
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 0,
    }).format(number);
  };

  useEffect(() => {
    updateURL();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedType,
    selectedBrand,
    selectedModel,
    selectedTrim,
    condition,
    debouncedPrice,
    debouncedMileage,
    debouncedYear,
    debouncedEngineSize,
  ]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedPrice(price);
    }, 500);
    return () => clearTimeout(handler);
  }, [price]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedMileage(mileage);
    }, 500);
    return () => clearTimeout(handler);
  }, [mileage]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedYear(year);
    }, 500);
    return () => clearTimeout(handler);
  }, [year]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedEngineSize(engineSize);
    }, 500);
    return () => clearTimeout(handler);
  }, [engineSize]);

  const updateURL = () => {
    const queryParams = {
      type: selectedType !== "" ? selectedType : undefined,
      brand: selectedBrand !== "" ? selectedBrand : undefined,
      model: selectedModel !== "" ? selectedModel : undefined,
      trim: selectedTrim !== "" ? selectedTrim : undefined,
      condition: condition !== "" ? condition : undefined,
      price_min: price[0] > 0 ? price[0] : undefined,
      price_max: price[1] < 100000 ? price[1] : undefined,
      mileage_min: mileage[0] > 0 ? mileage[0] : undefined,
      mileage_max: mileage[1] < 999999 ? mileage[1] : undefined,
      year_min: year[0] > 1895 ? year[0] : undefined,
      year_max: year[1] < new Date().getFullYear() ? year[1] : undefined,
      engine_size_min: engineSize[0] > 50 ? engineSize[0] : undefined,
      engine_size_max: engineSize[1] < 3000 ? engineSize[1] : undefined,
    };

    const query = queryString.stringify(queryParams, { skipNull: true });
    navigate(`/browse?${query}`);
  };

  const handleTypeChange = (selectedOptions) => {
    if (selectedOptions.length > 0) {
      const selectedType = selectedOptions[0].value;
      setSelectedType(selectedType);
      setSelectedBrand("");
      setSelectedModel("");
      setSelectedTrim("");
      setFilteredModels([]);
      setFilteredTrims([]);
      updateURL();
    } else if (selectedOptions.length === 0) {
      setSelectedType("");
      setSelectedBrand("");
      setSelectedModel("");
      setSelectedTrim("");
      setFilteredBrands([]);
      setFilteredModels([]);
      setFilteredTrims([]);
      updateURL();
      return;
    }
  };

  const handleBrandChange = (selectedOptions) => {
    if (selectedOptions.length > 0) {
      const selectedBrand = selectedOptions[0].value;
      setSelectedBrand(selectedBrand);
      setSelectedModel("");
      setSelectedTrim("");
      setFilteredTrims([]);
      updateURL();
    } else if (selectedOptions.length === 0) {
      setSelectedBrand("");
      setSelectedModel("");
      setSelectedTrim("");
      setFilteredModels([]);
      setFilteredTrims([]);
      updateURL();
      return;
    }
  };

  const handleModelChange = (selectedOptions) => {
    if (selectedOptions.length > 0) {
      const selectedModel = selectedOptions[0].value;
      setSelectedModel(selectedModel);
      setSelectedTrim("");
      updateURL();
    } else if (selectedOptions.length === 0) {
      setSelectedModel("");
      setSelectedTrim("");
      setFilteredTrims([]);
      updateURL();
      return;
    }
  };

  const handleTrimChange = (selectedOptions) => {
    if (selectedOptions.length > 0) {
      const selectedTrim = selectedOptions[0].value;
      setSelectedTrim(selectedTrim);
      updateURL();
    } else if (selectedOptions.length === 0) {
      setSelectedTrim("");
      updateURL();
      return;
    }
  };

  const handleConditionChange = (e) => {
    const selectedCondition = e.target.value;
    setCondition(selectedCondition);
    updateURL();
  };

  return (
    <div className="w-full md:w-fit h-fit flex flex-col justify-start items-center gap-3.5 p-6 bg-white rounded-xl shadow-md shadow-grey">
      <div className="self-center md:self-start text-2xl font-extrabold text-black">
        Filter
      </div>

      <div className="flex lex-row justify-center items-start md:items-center self-stretch gap-2.5 ">
        <div className="flex justify-center items-center w-[80px] h-[45px] bg-blue rounded-sm shadow-md shadow-grey">
          <img src="/icons/Tune.svg" alt="" className="w-[35px]" />
        </div>
        <div className="flex justify-center items-center w-[80px] h-[45px] bg-black rounded-sm shadow-md shadow-grey">
          <img src="/icons/Bookmark.svg" alt="" className="w-[35px]" />
        </div>
        <div className="flex justify-center items-center w-[80px] h-[45px] bg-black rounded-sm shadow-md shadow-grey">
          <img src="/icons/History.svg" alt="" className="w-[35px]" />
        </div>
      </div>

      <div className="flex flex-col items-start gap-1 w-full">
        <div className="font-bold text-xl">Type</div>
        <div className="w-full">
          <Select
            key={selectedType}
            options={typeOptions}
            onChange={handleTypeChange}
            values={
              selectedType
                ? typeOptions.filter((option) => option.value === selectedType)
                : []
            }
            placeholder="Select type"
            searchable
            clearable
            className="text-[18px]"
          />
        </div>
      </div>

      <div className="flex flex-col items-start gap-1 self-stretch w-full">
        <div className="font-bold text-xl">Brand</div>
        <div className="w-full">
          <Select
            key={`${selectedType}-${selectedBrand}`}
            options={filteredBrands.map((brand) => ({
              label: brand,
              value: brand,
            }))}
            onChange={handleBrandChange}
            values={
              selectedBrand
                ? [{ value: selectedBrand, label: selectedBrand }]
                : []
            }
            placeholder="Select brand"
            searchable
            clearable
            className="text-[18px]"
            disabled={!selectedType}
          />
        </div>
      </div>

      <div className="flex flex-col items-start gap-1 self-stretch w-full">
        <div className="font-bold text-xl">Model</div>
        <div className="w-full">
          <Select
            key={`${selectedType}-${selectedBrand}-${selectedModel}`}
            options={filteredModels.map((model) => ({
              label: model.model,
              value: model.model,
            }))}
            onChange={handleModelChange}
            values={
              selectedModel
                ? [{ value: selectedModel, label: selectedModel }]
                : []
            }
            placeholder="Select model"
            searchable
            clearable
            className="text-[18px]"
            disabled={!selectedBrand}
          />
        </div>
      </div>

      <div className="flex flex-col items-start gap-1 self-stretch w-full">
        <div className="font-bold text-xl">Trims</div>
        <div className="w-full">
          <Select
            key={`${selectedType}-${selectedBrand}-${selectedModel}-${selectedTrim}`}
            options={filteredTrims.map((trim) => ({
              label: trim.name,
              value: trim.name,
            }))}
            onChange={handleTrimChange}
            values={
              selectedTrim ? [{ value: selectedTrim, label: selectedTrim }] : []
            }
            placeholder="Select trim"
            searchable
            clearable
            className="text-[18px]"
            disabled={!selectedModel}
          />
        </div>
      </div>

      <div className="w-full flex flex-col gap-3 justify-center items-center">
        <div className="font-bold text-xl">Condition</div>
        <ul className="grid w-full gap-6 grid-cols-3">
          <li>
            <input
              type="radio"
              id="all-condition"
              name="condition"
              className="hidden peer"
              value=""
              checked={condition === ""}
              onChange={handleConditionChange}
            />
            <label
              htmlFor="all-condition"
              className="inline-flex items-center justify-between text-center w-full p-3 text-black border border-grey rounded-lg cursor-pointer peer-checked:bg-blue peer-checked:text-white hover:scale-105 active:scale-110 transition"
            >
              <div className="w-full text-[16px] font-semibold">All</div>
            </label>
          </li>
          <li className="">
            <input
              type="radio"
              id="used-condition"
              name="condition"
              className="hidden peer"
              value="Used"
              checked={condition === "Used"}
              onChange={handleConditionChange}
            />
            <label
              htmlFor="used-condition"
              className="inline-flex items-center justify-between text-center w-full p-3 text-black border border-grey rounded-lg cursor-pointer peer-checked:bg-blue peer-checked:text-white hover:scale-105 active:scale-110 transition"
            >
              <div className="w-full text-[16px] font-semibold">Used</div>
            </label>
          </li>
          <li>
            <input
              type="radio"
              id="new-condition"
              name="condition"
              className="hidden peer"
              value="New"
              checked={condition === "New"}
              onChange={handleConditionChange}
            />
            <label
              htmlFor="new-condition"
              className="inline-flex items-center justify-between text-center w-full p-3 text-black border border-grey rounded-lg cursor-pointer peer-checked:bg-blue peer-checked:text-white hover:scale-105 active:scale-110 transition"
            >
              <div className="w-full text-[16px] font-semibold">New</div>
            </label>
          </li>
        </ul>
      </div>

      <div className="flex flex-col justify-center items-start self-stretch gap-2">
        <div className="font-bold text-[20px]">Price</div>
        <div className="flex justify-between self-stretch font-[400] text-[18px] text-black">
          <span>${formatNumber(price[0])}</span>
          <span>${formatNumber(price[1])}</span>
        </div>
        <RangeSlider
          id="range-slider"
          min={0}
          max={100000}
          value={price}
          onInput={(value) => setPrice(value)}
        />
      </div>

      <div className="flex flex-col justify-center items-start self-stretch gap-2">
        <div className="font-bold text-[20px]">Mileage</div>
        <div className="flex justify-between self-stretch font-[400] text-[18px] text-black">
          <span>{formatNumber(mileage[0])}</span>
          <span>{formatNumber(mileage[1])}</span>
        </div>
        <RangeSlider
          id="range-slider"
          min={0}
          max={999999}
          value={mileage}
          onInput={(value) => setMileage(value)}
        />
      </div>

      <div className="flex flex-col justify-center items-start self-stretch gap-2">
        <div className="font-bold text-[20px]">Year</div>
        <div className="flex justify-between self-stretch font-[400] text-[18px] text-black">
          <span>{formatNumber(year[0])}</span>
          <span>{formatNumber(year[1])}</span>
        </div>
        <RangeSlider
          id="range-slider"
          min={1895}
          max={new Date().getFullYear()}
          value={year}
          onInput={(value) => setYear(value)}
        />
      </div>

      <div className="flex flex-col justify-center items-start self-stretch gap-2">
        <div className="font-bold text-[20px]">Engine Size</div>
        <div className="flex justify-between self-stretch font-[400] text-[18px] text-black">
          <span>{formatNumber(engineSize[0])}</span>
          <span>{formatNumber(engineSize[1])}</span>
        </div>
        <RangeSlider
          id="range-slider"
          min={50}
          max={3000}
          value={engineSize}
          onInput={(value) => setEngineSize(value)}
        />
      </div>
    </div>
  );
};

export default FilterBar;
