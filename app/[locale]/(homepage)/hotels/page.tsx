"use client";
import { useEffect, useState } from "react";
import Index from "./components/cardHotels";

import StarsCheckBox from "./components/starsCheckBox";
import PriceSlider from "./components/priceslider";
import SearchBar from "./components/searchBar";
import FacilityCheckBox from "./components/facilityCheckBox";

export default function Page() {
  const [checkedValues, setCheckedValues] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([80000, 50000000]);
  const [isLoaded, setIsLoaded] = useState(false); // Trạng thái cho biết đã tải xong hay chưa

  useEffect(() => {
    // Simulate loading delay
    const timeout = setTimeout(() => {
      setIsLoaded(true); // Đánh dấu đã tải xong sau 500ms
    }, 500);

    return () => clearTimeout(timeout); // Clear timeout nếu component unmount
  }, []);

  return (
    <>
      {isLoaded && ( // Chỉ hiển thị nếu đã tải xong
        <>
          <SearchBar />
          <div className="flex mt-4">
            <div className="w-1/4 px-10" style={{ height: 1000 }}>
              <PriceSlider
                priceRange={priceRange}
                setPriceRange={setPriceRange}
              />
              <StarsCheckBox setCheckedValues={setCheckedValues} />
              <FacilityCheckBox setCheckedValues={setCheckedValues} />
            </div>
            <div className="pe-10 w-3/4">
              <Index checkedValues={checkedValues} priceRange={priceRange} />
            </div>
          </div>
        </>
      )}
    </>
  );
}
