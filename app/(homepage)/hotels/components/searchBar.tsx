"use client";
import { MagnifyingGlassIcon, MapPinIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Col,
  DatePicker,
  Form,
  FormProps,
  GetProps,
  Input,
  InputNumber,
  Row,
  Select,
} from "antd";
import dayjs from "dayjs";
import Image from "next/legacy/image";
import React, { useEffect, useState } from "react";
import provinces from "@/public/provinces.json";
import { redirect, useRouter } from "next/navigation";
import axios from "axios";
type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;
const { RangePicker } = DatePicker;
const { Option } = Select;
const provincesData = provinces.data.data;
const disabledDate: RangePickerProps["disabledDate"] = (current) => {
  // Can not select days before today and today
  return current && current < dayjs().endOf("day");
};

const filterOption = (input, option) => {
  const optionLabel = option.children || ""; // Ensure option.children is defined

  return (
    optionLabel.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
    option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
  );
};
type FieldType = {
  search?: string;
  date?: string;
  guests?: number;
  rooms?: number;
};

export default function SearchBar() {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
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
          : [],
      guests: guestsValue,
      rooms: roomsValue,
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
    let newUrl;

    if (window.location.pathname.startsWith("/detail")) {
      newUrl = `${window.location.pathname}?${queryString}`;
    } else {
      newUrl = `/hotels?${queryString}`;
    }

    // Điều hướng đến URL mới và reload lại trang
    window.location.assign(newUrl);
    // window.location.reload();
  };
  return (
    <>
      <div className="w-full p-4 h-20 bg-sky-600 flex justify-center sticky top-0 z-10 shadow-lg">
        <Row gutter={24} className="flex justify-center w-10/12">
          <Form
            form={form}
            className="flex justify-center w-full"
            onFinish={onFinish}
          >
            <Col span={8}>
              <Form.Item<FieldType> name="search">
                <Select
                  className="h-12 text-xl font-semibold"
                  suffixIcon={<MapPinIcon className="h-6 w-6 text-gray-500" />}
                  showSearch
                  placeholder="Thành phố, khách sạn, điểm đến"
                  onSearch={onSearch}
                  optionFilterProp="children"
                  //loading={loading}
                  filterOption={filterOption}
                >
                  {filteredOptions.map((item, index) => (
                    <Option key={index} value={item}>
                      <span className="font-semibold text-xl">{item}</span>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item<FieldType> name="date">
                <RangePicker
                  className="font-semibold h-12 text-xl"
                  disabledDate={disabledDate}
                />
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item name="guests">
                <Input
                  suffix={
                    <Image src="/icon/man.png" width={24} height={24} alt="" />
                  }
                  className="font-semibold h-12 text-xl w-full flex"
                  // defaultValue={1}
                  min={1}
                  max={10}
                />
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item name="rooms">
                <Input
                  suffix={
                    <Image src="/icon/door.png" width={24} height={24} alt="" />
                  }
                  className="font-semibold h-12 text-xl w-full flex"
                  // defaultValue={1}
                  min={1}
                  max={10}
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item>
                <Button
                  htmlType="submit"
                  size="large"
                  className="flex font-semibold h-12 text-xl"
                >
                  <MagnifyingGlassIcon className="h-8 w-8 " /> Tìm kiếm
                </Button>
              </Form.Item>
            </Col>
          </Form>
        </Row>
      </div>
    </>
  );
}
