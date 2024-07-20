"use client";

import { useEffect, useState } from "react";
import BookingInfo from "../components/booking-info";
import CustomerInfo from "../components/customer-info";
import PriceInfo from "../components/price-info";
import SelectedInfo from "../components/selected-info";

export default function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const [daysCount, setDaysCount] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [guests, setGuests] = useState(2);
  const [roomData, setRoomData] = useState([]);

  const [checkInValue, setCheckInValue] = useState("");
  const [checkOutValue, setCheckOutValue] = useState("");
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const checkInValue = searchParams.get("checkIn") || "";
    const checkOutValue = searchParams.get("checkOut") || "";
    const guestValue = searchParams.get("guests") || "";
    const roomsValue = searchParams.get("rooms") || "";
    const roomsToNum = parseInt(roomsValue, 10);
    const guestToNum = parseInt(guestValue, 10);
    const fetchData = async () => {
      const response = await fetch(`http://localhost:8080/api/rooms/${id}`); // API backend trả về toàn bộ giá trị
      const allData = await response.json();
      setRoomData(allData); // Lưu trữ toàn bộ dữ liệu
    };
    fetchData();
    setCheckInValue(checkInValue);
    setCheckOutValue(checkOutValue);
    setRooms(roomsToNum);
    setGuests(guestToNum);
  }, [id]);

  return (
    <>
      <div className="mx-32 flex gap-5">
        <div
          style={{ width: "65%" }}
          className="border p-5 rounded-lg shadow-lg"
        >
          <CustomerInfo />
          <div className="rounded-sm shadow-sm border w-full p-5 mt-5">
            <PriceInfo
              roomData={roomData}
              daysCount={daysCount}
              rooms={rooms}
              guests={guests}
              checkInDate={checkInValue}
              checkOutDate={checkOutValue}
            />
          </div>
        </div>
        <div style={{ width: "35%" }} className="">
          <div className="border p-5 rounded-lg shadow-lg">
            <BookingInfo
              setDaysCount={setDaysCount}
              roomData={roomData}
              checkInValue={checkInValue}
              checkOutValue={checkOutValue}
            />
          </div>
          <div className="border p-5 rounded-lg shadow-lg mt-5">
            <div></div>
          </div>
        </div>
      </div>
    </>
  );
}
