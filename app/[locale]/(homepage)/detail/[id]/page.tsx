"use client";
import { Anchor, Card } from "antd";

import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import HotelInfo from "../components/hotelInfo";
import PolicyInfo from "../components/policyInfo";
import RateInfo from "../components/rateInfo";
import RoomInfo from "../components/roomInfo";
const url_deploy = "https://vootreeveevuu.up.railway.app";
const url_local = "http://localhost:8080";
export default function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const [data, setData] = useState([]);
  const [roomsQuantity, setRoomsQuantity] = useState("");
  const [hotelid, setHotelid] = useState("");

  const fetchData = useCallback(async () => {
    const searchParams = new URLSearchParams(window.location.search);
    const searchValue = searchParams.get("search");
    const checkInValue = searchParams.get("checkIn");
    const checkOutValue = searchParams.get("checkOut");
    const guestsValue = searchParams.get("guests");
    const roomsValue = searchParams.get("rooms") || "";
    const response = await axios.get(`${url_deploy}/api/hotels/${id}`, {
      params: {
        id: id,
        city: searchValue,
        hotelName: searchValue,
        capacity: guestsValue,
        checkinDate: checkInValue,
        checkoutDate: checkOutValue,
        rooms: roomsValue,
      },
    }); // API backend trả về toàn bộ giá trị
    const allData = await response.data;
    setHotelid(id);
    setData(allData); // Lưu trữ toàn bộ dữ liệu
    setRoomsQuantity(roomsValue);
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
            // height: "850px",
          }}
        >
          <HotelInfo data={data} />
        </div>
        <div
          id="part-2"
          style={{
            width: "100vw",
            //     height: "150vh",
          }}
          className="mt-10 "
        >
          <RoomInfo
            data={data}
            roomsQuantity={roomsQuantity}
            fetchData={fetchData}
            hotelid={hotelid}
          />
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
            height: "160vh",
          }}
          className="mb-10"
        >
          <RateInfo data={data} />
        </div>
      </div>
    </>
  );
}
