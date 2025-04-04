import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motorcycleData } from "../../data/motorcycleData";
import queryString from "query-string";
import FilterRangeSlider from "./FilterRangeSlider";
import FilterSelect from "./FilterSelect";

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

  const [availableTypes, setAvailableTypes] = useState([]);
  const [availableModels, setAvailableModels] = useState([]);
  const [availableTrims, setAvailableTrims] = useState([]);

  const [isInitialMount, setIsInitialMount] = useState(true);

  const brandOptions = Object.keys(motorcycleData).map((brand) => ({
    label: brand,
    value: brand,
  }));

  useEffect(() => {
    const params = queryString.parse(window.location.search);
    if (params.brand) {
      setSelectedBrand(params.brand);
    }
  }, []);

  useEffect(() => {
    if (selectedBrand) {
      const typesForBrand = Object.keys(motorcycleData[selectedBrand] || []);
      setAvailableTypes(
        typesForBrand.map((type) => ({
          label: type.charAt(0).toUpperCase() + type.slice(1).replace("_", " "),
          value: type,
        }))
      );
    } else {
      setAvailableTypes([]);
    }

    setSelectedType("");
    setSelectedModel("");
    setSelectedTrim("");
    setAvailableModels([]);
    setAvailableTrims([]);
  }, [selectedBrand]);

  useEffect(() => {
    if (selectedBrand && selectedType) {
      const modelsForType = motorcycleData[selectedBrand]?.[selectedType] || [];
      setAvailableModels(
        modelsForType.map((model) => ({
          label: model.model,
          value: model.model,
        }))
      );
    } else {
      setAvailableModels([]);
    }

    setSelectedModel("");
    setSelectedTrim("");
    setAvailableTrims([]);
  }, [selectedType, selectedBrand]);

  useEffect(() => {
    if (selectedBrand && selectedType && selectedModel) {
      const modelData = motorcycleData[selectedBrand]?.[selectedType]?.find(
        (m) => m.model === selectedModel
      );
      setAvailableTrims(
        (modelData?.trims || []).map((trim) => ({
          label: trim.name,
          value: trim.name,
        }))
      );
    } else {
      setAvailableTrims([]);
    }

    setSelectedTrim("");
  }, [selectedModel, selectedBrand, selectedType]);

  const formatNumber = (number) => {
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 0,
    }).format(number);
  };

  useEffect(() => {
    if (isInitialMount) {
      setIsInitialMount(false);
      return;
    }
    updateURL();
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
    const queryParams = new Map([
      ["page", 1],
      ["brand", selectedBrand || undefined],
      ["type", selectedType || undefined],
      ["model", selectedModel || undefined],
      ["trim", selectedTrim || undefined],
      ["condition", condition || undefined],
      ["price_min", price[0] > 0 ? price[0] : undefined],
      ["price_max", price[1] < 100000 ? price[1] : undefined],
      ["mileage_min", mileage[0] > 0 ? mileage[0] : undefined],
      ["mileage_max", mileage[1] < 999999 ? mileage[1] : undefined],
      ["year_min", year[0] > 1895 ? year[0] : undefined],
      ["year_max", year[1] < new Date().getFullYear() ? year[1] : undefined],
      ["engine_size_min", engineSize[0] > 50 ? engineSize[0] : undefined],
      ["engine_size_max", engineSize[1] < 3000 ? engineSize[1] : undefined],
    ]);

    // Xóa các giá trị undefined khỏi Map
    for (let [key, value] of queryParams) {
      if (value === undefined) {
        queryParams.delete(key);
      }
    }

    // Tạo query string từ Map
    const query = new URLSearchParams(queryParams).toString();
    navigate(`/browse?${query}`);
  };

  const handleBrandChange = (selectedOptions) => {
    const newBrand = selectedOptions.length > 0 ? selectedOptions[0].value : "";
    setSelectedBrand(newBrand);

    if (!newBrand) {
      setSelectedType("");
      setSelectedModel("");
      setSelectedTrim("");
    }
    updateURL();
  };

  const handleTypeChange = (selectedOptions) => {
    const newType = selectedOptions.length > 0 ? selectedOptions[0].value : "";
    setSelectedType(newType);

    if (!newType) {
      setSelectedModel("");
      setSelectedTrim("");
    }
    updateURL();
  };

  const handleModelChange = (selectedOptions) => {
    const newModel = selectedOptions.length > 0 ? selectedOptions[0].value : "";
    setSelectedModel(newModel);

    if (!newModel) {
      setSelectedTrim("");
    }
    updateURL();
  };

  const handleTrimChange = (selectedOptions) => {
    const newTrim = selectedOptions.length > 0 ? selectedOptions[0].value : "";
    setSelectedTrim(newTrim);
    updateURL();
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

      <FilterSelect
        key={`brand-${selectedBrand}`}
        title="Brand"
        options={brandOptions}
        selectedValue={selectedBrand}
        onChange={handleBrandChange}
        placeholder="Select brand"
      />

      <FilterSelect
        key={`type-${selectedBrand}-${selectedType}`}
        title="Type"
        options={availableTypes}
        selectedValue={selectedType}
        onChange={handleTypeChange}
        disabled={!selectedBrand}
        placeholder={selectedBrand ? "Select type" : "Select brand first"}
      />

      <FilterSelect
        key={`model-${selectedBrand}-${selectedType}-${selectedModel}`}
        title="Model"
        options={availableModels}
        selectedValue={selectedModel}
        onChange={handleModelChange}
        disabled={!selectedType}
        placeholder={selectedType ? "Select model" : "Select type first"}
      />

      <FilterSelect
        key={`trim-${selectedBrand}-${selectedType}-${selectedModel}-${selectedTrim}`}
        title="Trim"
        options={availableTrims}
        selectedValue={selectedTrim}
        onChange={handleTrimChange}
        disabled={!selectedModel}
        placeholder={selectedModel ? "Select trim" : "Select model first"}
      />

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

      <FilterRangeSlider
        title="Price"
        value={price}
        onInput={setPrice}
        min={0}
        max={100000}
        formatValue={(val) => `$${formatNumber(val)}`}
      />

      <FilterRangeSlider
        title="Mileage"
        value={mileage}
        onInput={setMileage}
        min={0}
        max={999999}
        formatValue={(val) => `${formatNumber(val)}`}
      />

      <FilterRangeSlider
        title="Year"
        value={year}
        onInput={setYear}
        min={1895}
        max={new Date().getFullYear()}
        formatValue={(val) => `${formatNumber(val)}`}
      />

      <FilterRangeSlider
        title="Engine Size"
        value={engineSize}
        onInput={setEngineSize}
        min={50}
        max={3000}
        formatValue={(val) => `${formatNumber(val)}`}
      />
    </div>
  );
};

export default FilterBar;
