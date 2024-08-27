import { useState } from "react";

import { InputNumber, InputNumberProps, Slider } from "antd";

export default function PriceSlider({ priceRange, setPriceRange }) {
  const [minValue, setMinValue] = useState(priceRange[0]);
  const [maxValue, setMaxValue] = useState(priceRange[1]);

  // const handleChangeSlider = (value) => {
  //   setMinValue(value[0]);
  //   setMaxValue(value[1]);
  //   setPriceRange(value);
  // };

  // const onChangeComplete = (value) => {
  //   setPriceRange(value);
  // };

  // const handleChangeMinValue = (value) => {
  //   if (value > maxValue) {
  //     setMinValue(maxValue);
  //     return;
  //   }
  //   setMinValue(value);
  //   setPriceRange([value, maxValue]);
  // };

  // const handleChangeMaxValue = (value) => {
  //   if (value < minValue) {
  //     setMaxValue(minValue);
  //     return;
  //   }
  //   setMaxValue(value);
  //   setPriceRange([minValue, value]);
  // };
  const handleChangeSlider = (value) => {
    setMinValue(value[0]);
    setMaxValue(value[1]);
    setPriceRange(value);
  };

  const handleChangeMinValue = (value) => {
    if (value > maxValue) {
      setMinValue(maxValue);
      return;
    }
    setMinValue(value);
    setPriceRange([value, maxValue]);
  };

  const handleChangeMaxValue = (value) => {
    if (value < minValue) {
      setMaxValue(minValue);
      return;
    }
    setMaxValue(value);
    setPriceRange([minValue, value]);
  };

  const currencyFormatter = (value) =>
    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const currencyParser = (value) => value.replace(/\₫\s?|(,*)/g, "");
  return (
    <>
      <div className="border h-40 p-4 rounded-md shadow-md">
        <strong>Phạm vi giá</strong>
        <p className="text-xs text-gray-700">1 phòng, 1 đêm</p>
        <div style={{ marginTop: 16 }}>
          <InputNumber
            className="font-semibold"
            formatter={currencyFormatter}
            parser={currencyParser}
            prefix="VND"
            size="small"
            min={80000}
            max={50000000}
            value={minValue}
            onChange={handleChangeMinValue}
            style={{ minWidth: 120,paddingLeft:2 }}
          />
          <span style={{ margin: "0 5px" }}>-</span>
          <InputNumber
            className="font-semibold"
            formatter={currencyFormatter}
            parser={currencyParser}
            prefix="VND"
            size="small"
            min={minValue}
            max={50000000}
            value={maxValue}
            onChange={handleChangeMaxValue}
            style={{ minWidth: 120,paddingLeft:2 }}
          />
          <Slider
            tooltip={{ formatter: null }}
            range
            min={80000}
            max={50000000}
            step={500000}
            value={[minValue, maxValue]}
            onChange={handleChangeSlider}
          />
        </div>
      </div>
    </>
  );
}
