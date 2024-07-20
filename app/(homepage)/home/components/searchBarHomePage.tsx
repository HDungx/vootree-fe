"use client";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { Form, InputNumber, Select, DatePicker, Button } from "antd";
import FormItem from "antd/es/form/FormItem";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import type { GetProps } from "antd";
import customParseFormat from "dayjs/plugin/customParseFormat";
import axios from "axios";
type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;
const { Option } = Select;
dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;

type FieldType = {
  search?: string;
  date?: string;
  guests?: number;
  rooms?: number;
};

// eslint-disable-next-line arrow-body-style
const disabledDate: RangePickerProps["disabledDate"] = (current) => {
  // Can not select days before today and today
  return current && current < dayjs().endOf("day");
};

const filterOption = (input, option) => {
  return (
    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
    option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
  );
};
export default function SearchBar() {
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [selectionData, setSelectionData] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/hotels");
        const data = response.data;
        const filteredHotelName = data.map((item) => item.hotelName);
        const citySet = new Set(data.map((item) => item.city));
        const hotelCities = [...citySet];
        const combinedData = filteredHotelName.concat(hotelCities);
        setSelectionData(combinedData);
        setFilteredOptions(combinedData.slice(0, 10));
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const searchValue = searchParams.get("search") || "";
    const checkInValue = searchParams.get("checkIn") || "";
    const checkOutValue = searchParams.get("checkOut") || "";
    const guestsValue = searchParams.get("guests") || "";
    const roomsValue = searchParams.get("rooms") || "";
    form.setFieldsValue({
      search: searchValue,
      date:
        checkInValue && checkOutValue
          ? [dayjs(checkInValue), dayjs(checkOutValue)]
          : [dayjs(), dayjs().add(1, "day")],
      guests: guestsValue || "1",
      rooms: roomsValue || "1",
    });
  });

  const onSearch = (value: string) => {
    const filteredData = selectionData.filter(
      (item) =>
        item.toLowerCase().includes(value.toLowerCase()) ||
        item.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOptions(filteredData.slice(0, 10)); // Hiển thị 10 phần tử tìm được
  };

  const onFinish = (values) => {
    const params = new URLSearchParams();

    if (values.search) {
      params.append("search", values.search);
    }
    if (values.date) {
      params.append("checkIn", dayjs(values.date[0]).format("YYYY-MM-DD"));
      params.append("checkOut", dayjs(values.date[1]).format("YYYY-MM-DD"));
    }
    if (values.guests) {
      params.append("guests", values.guests);
    }
    if (values.rooms) {
      params.append("rooms", values.rooms);
    }

    const queryString = params.toString();
    const newUrl = `/hotels?${queryString}`;

    // Điều hướng đến URL mới và reload lại trang
    window.location.assign(newUrl);
    // window.location.reload();
  };

  return (
    <>
      <div className="text-3xl items-center justify-center flex mt-6 font-bold text-white">
        <h1 className="items-center">
          From Southeast Asia to the World, All Yours.
        </h1>
      </div>
      <hr className="max-w-4xl mx-auto justify-center mt-4 border" />
      <div className="max-w-3xl h-56 bg-white mx-auto mt-6 border border-gray-400 rounded-lg ">
        <div className="relative">
          <Form
            form={form}
            className="mx-4 mt-3"
            layout="vertical"
            onFinish={onFinish}
          >
            <Form.Item<FieldType>
              label="Thành phố, địa điểm hoặc tên khách sạn:"
              name="search"
            >
              <Select
                size="large"
                className=" font-normal"
                suffixIcon={<MapPinIcon className="h-6 w-6 text-gray-500" />}
                showSearch
                placeholder="VD: Đà Lạt..., Khách sạn..."
                optionFilterProp="children"
                onSearch={onSearch}
                filterOption={filterOption}
              >
                {" "}
                {filteredOptions.map((item, index) => (
                  <Option key={index} value={item}>
                    {item}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <div className="justify-between flex">
              <Form.Item<FieldType>
                label="Ngày nhận phòng, ngày trả phòng"
                name="date"
              >
                <RangePicker
                  size="large"
                  className=" w-80"
                  disabledDate={disabledDate}
                />
              </Form.Item>

              <Form.Item<FieldType> label="Số lượng khách" name="guests">
                <InputNumber
                  size="large"
                  className=" w-40"
                  defaultValue={1}
                  //   value={1}
                  min={1}
                  max={10}
                />
              </Form.Item>
              <Form.Item<FieldType> label="Số lượng phòng" name="rooms">
                <InputNumber
                  size="large"
                  className=" w-40 "
                  defaultValue={1}
                  // value={1}
                  min={1}
                  max={10}
                />
              </Form.Item>
            </div>
            <div className="items-center justify-center flex">
              <Form.Item>
                <Button
                  size="large"
                  className="w-56"
                  type="primary"
                  htmlType="submit"
                >
                  Search
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}
