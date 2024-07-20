"use client";
import { useEffect, useState } from "react";
import Index from "./components/cardHotels";

import StarsCheckBox from "./components/starsCheckBox";
import PriceSlider from "./components/priceslider";
import SearchBar from "./components/searchBar";

export default function Page() {
  const [checkedValues, setCheckedValues] = useState([]);
  const [priceRange, setPriceRange] = useState([80000, 50000000]);

  return (
    <>
      <SearchBar />
      <div className="flex mt-4">
        <div className="w-1/4 px-10" style={{ height: 1000 }}>
          <PriceSlider priceRange={priceRange} setPriceRange={setPriceRange} />
          <StarsCheckBox setCheckedValues={setCheckedValues} />
        </div>
        <div className=" pe-10 w-3/4">
          <Index checkedValues={checkedValues} priceRange={priceRange} />
        </div>
      </div>
    </>
  );
}
