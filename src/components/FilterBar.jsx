import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import FilterRangeSliderBar from "./FilterRangeSliderbar";
import { motorcycleData } from "../data/motorcycleData";
import Select from "react-dropdown-select";
import queryString from "query-string";

const FilterBar = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedTrim, setSelectedTrim] = useState("");

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

  useEffect(() => {
    updateURL();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType, selectedBrand, selectedModel, selectedTrim]);

  const updateURL = () => {
    const queryParams = {
      type: selectedType !== "" ? selectedType : undefined,
      brand: selectedBrand !== "" ? selectedBrand : undefined,
      model: selectedModel !== "" ? selectedModel : undefined,
      trim: selectedTrim !== "" ? selectedTrim : undefined,
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
    }
  };

  const handleModelChange = (selectedOptions) => {
    if (selectedOptions.length > 0) {
      const selectedModel = selectedOptions[0].value;
      setSelectedModel(selectedModel);
      setSelectedTrim("");
      updateURL();
    }
  };

  const handleTrimChange = (selectedOptions) => {
    if (selectedOptions.length > 0) {
      const selectedTrim = selectedOptions[0].value;
      setSelectedTrim(selectedTrim);
      updateURL();
    }
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

      <div className="flex flex-col items-start gap-1 self-stretch w-full">
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
            className="text-[18px]"
            disabled={!selectedModel}
          />
        </div>
      </div>

      <div className="flex flex-col items-start gap-1 self-stretch">
        <div className="font-bold text-[20px]">Condition</div>
        <div className="flex flex-row justify-start md:justify-between items-center gap-2.5 self-stretch">
          <button
            value={"All"}
            className="flex justify-center items-center px-6 py-2 max-w-[70px] rounded-sm font-light italic text-[18px] text-white bg-blue shadow-md shadow-grey"
          >
            All
          </button>
          <button
            value={"New"}
            className="flex justify-center items-center px-6 py-2 max-w-[70px] rounded-sm font-light italic text-[18px] text-white bg-black shadow-md shadow-grey"
          >
            New
          </button>
          <button
            value={"Used"}
            className="flex justify-center items-center px-6 py-2 max-w-[70px] rounded-sm font-light italic text-[18px] text-white bg-black shadow-md shadow-grey"
          >
            Used
          </button>
        </div>
      </div>

      <FilterRangeSliderBar
        title={"Price"}
        decimalFront={"$"}
        minVal={0}
        maxVal={100000}
      />
      <FilterRangeSliderBar title={"Year"} minVal={1895} maxVal={2025} />
      <FilterRangeSliderBar title={"Mileage"} minVal={0} maxVal={100000} />
      <FilterRangeSliderBar title={"Engine Size"} minVal={0} maxVal={100000} />
    </div>
  );
};

export default FilterBar;
