"use client";
import { Anchor, Card, message } from "antd";

import axios from "axios";
import React, { useEffect, useState } from "react";
import HotelInfo from "../components/hotelInfo";
import PolicyInfo from "../components/policyInfo";
import RateInfo from "../components/rateInfo";
import RoomInfo from "../components/roomInfo";
const { Meta } = Card;
const hotelImages = [
  { id: "1", img: "du-lich-Da-Lat-ivivu.jpg" },
  { id: "2", img: "dulichPhuQuoc-1649392573-9234-1649405369.jpg" },
  { id: "3", img: "halongbay-3501.jpg.webp" },
  { id: "4", img: "hoi-an-1680591517857660432696.webp" },
];

const gridStyle: React.CSSProperties = {
  width: "25%",
  justifyContent: "center",
  height: "30px",
};

export default function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const [data, setData] = useState([]);
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const searchValue = searchParams.get("search");
    const checkInValue = searchParams.get("checkIn");
    const checkOutValue = searchParams.get("checkOut");
    const guestsValue = searchParams.get("guests");
    const roomsValue = searchParams.get("rooms");
    const fetchData = async () => {
      const response = await axios.get(
        `http://localhost:8080/api/hotels/${id}`,
        {
          params: {
            id: id,
            city: searchValue,
            hotelName: searchValue,
            capacity: guestsValue,
            checkinDate: checkInValue,
            checkoutDate: checkOutValue,
            rooms: roomsValue,
          },
        }
      ); // API backend trả về toàn bộ giá trị
      const allData = await response.data;

      setData(allData); // Lưu trữ toàn bộ dữ liệu
    };

    fetchData();
  }, [id]);

  return (
    <>
      <div>
        <Anchor
          offsetTop={84}
          className="h-14 text-center items-center flex px-48 bg-white shadow-lg"
          direction="horizontal"
          items={[
            {
              key: "info",
              href: "#part-1",
              title: "Tổng quan",
              className: "text-base mx-3 font-bold",
            },
            {
              key: "room",
              href: "#part-2",
              title: "Phòng",
              className: "text-base mx-3 font-bold",
            },
            {
              key: "policy",
              href: "#part-3",
              title: "Chính sách",
              className: "text-base mx-3 font-bold",
            },
            {
              key: "feedback",
              href: "#part-4",
              title: "Đánh giá",
              className: "text-base mx-3 font-bold",
            },
          ]}
        />
      </div>
      <div className="justify-center items-center">
        <div
          id="part-1"
          style={{
            width: "100vw",
            height: "700px",
          }}
        >
          <HotelInfo data={data} />
        </div>
        <div
          id="part-2"
          style={{
            width: "100vw",
            height: "130vh",
          }}
          className="mt-10 "
        >
          <RoomInfo data={data} />
        </div>
        <div
          id="part-3"
          style={{
            width: "100vw",
            height: "50vh",
          }}
        >
          <PolicyInfo data={data} />
        </div>
        <div
          id="part-4"
          style={{
            width: "100vw",
            height: "140vh",
          }}
          className="mb-10"
        >
          <RateInfo data={data} />
        </div>
      </div>
    </>
  );
}
