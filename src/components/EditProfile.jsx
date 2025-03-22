import React, { useState, useEffect } from "react";
import Select from "react-dropdown-select";
import geodata from "../data/US_States_and_Cities.json";

const EditProfile = ({ onClose }) => {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    const stateList = Object.keys(geodata).map((state) => ({
      value: state,
      label: state,
    }));
    setStates(stateList);
  }, []);

  const handleStateChange = (selected) => {
    if (selected.length === 0) {
      setSelectedState(null);
      setCities([]);
      setSelectedCity(null);
      return;
    }

    const stateName = selected[0]?.value;
    setSelectedState(stateName);

    const cityList = geodata[stateName].map((city) => ({
      value: city,
      label: city,
    }));
    setCities(cityList);

    setSelectedCity(null);
  };

  const handleCityChange = (selected) => {
    setSelectedCity(selected.length > 0 ? selected[0]?.value : null);
  };

  return (
    <div className="m-5 p-5 flex flex-col gap-5 border-2 w-150 h-fit rounded-xl bg-white">
      <div className="flex flex-row justify-between pb-2.5 border-b-1 border-grey">
        <div id="title" className="font-bold text-2xl">
          Edit Profile
        </div>
        <button onClick={onClose} id="title" className="font-bold text-2xl">
          <img src="/icons/Close.svg" alt="" />
        </button>
      </div>
      <form className="flex flex-col gap-5 justify-between pb-2.5">
        <div id="name" className="flex flex-col gap-1">
          <label htmlFor="nameInput" className="text-[16px] text-grey">
            Name
          </label>
          <input
            id="nameInput"
            type="text"
            required
            placeholder="Enter your name"
            className="p-2.5 border-1 border-grey rounded-sm w-full h-10 bg-bg-white"
          />
        </div>
        <div id="email" className="flex flex-col gap-1">
          <label htmlFor="nameInput" className="text-[16px] text-grey">
            Email
          </label>
          <input
            id="emailInput"
            type="text"
            required
            placeholder="Enter your email"
            className="p-2.5 border-1 border-grey rounded-sm w-full h-10 bg-bg-white"
          />
        </div>
        <div id="phoneNumber" className="flex flex-col gap-1">
          <label htmlFor="nameInput" className="text-[16px] text-grey">
            Phone Number
          </label>
          <input
            id="phoneInput"
            type="text"
            required
            placeholder="Enter your phone number"
            className="p-2.5 border-1 border-grey rounded-sm w-full h-10 bg-bg-white"
          />
        </div>
        <div id="citizenId" className="flex flex-col gap-1">
          <label htmlFor="nameInput" className="text-[16px] text-grey">
            Citizen ID
          </label>
          <input
            id="phoneInput"
            type="text"
            required
            placeholder="Enter your citizen id"
            className="p-2.5 border-1 border-grey rounded-sm w-full h-10 bg-bg-white"
          />
        </div>
        <div id="birthdate" className="flex flex-col gap-1">
          <label htmlFor="nameInput" className="text-[16px] text-grey">
            Birthdate
          </label>
          <input
            id="birthInput"
            type="date"
            required
            placeholder="Enter your phone number"
            className="p-2.5 border-1 border-grey rounded-sm w-full h-10 bg-bg-white"
          />
        </div>
        <div id="sex" className="flex flex-col gap-1">
          <label htmlFor="sexInput" className="text-[16px] text-grey">
            Sex
          </label>
          <div className="flex flex-row gap-5 justify-center items-center">
            <div className="flex flex-row gap-2 justify-start items-center">
              <label htmlFor="boy">Male</label>
              <input
                name="sexInput"
                id="male"
                type="radio"
                required
                value={"male"}
                className="w-6 h-6"
              />
            </div>
            <div className="flex flex-row gap-2 justify-start items-center">
              <label htmlFor="girl">Female</label>
              <input
                name="sexInput"
                id="female"
                type="radio"
                required
                value={"female"}
                className="w-6 h-6"
              />
            </div>
          </div>
        </div>

        <div
          id="location"
          className="flex flex-row justify-evenly items-center gap-5"
        >
          <div className="flex flex-col gap-1 w-full">
            <label className="text-[16px] text-grey">State</label>
            <Select
              options={states}
              onChange={handleStateChange}
              placeholder="Select a state"
              values={
                selectedState
                  ? [{ value: selectedState, label: selectedState }]
                  : []
              }
            />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label className="text-[16px] text-grey">City</label>
            <Select
              options={cities}
              onChange={handleCityChange}
              placeholder="Select a city"
              values={
                selectedCity
                  ? [{ value: selectedCity, label: selectedCity }]
                  : []
              }
              disabled={!selectedState}
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full p-2.5 bg-black rounded-sm text-white font-bold text-xl active:scale-110 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
