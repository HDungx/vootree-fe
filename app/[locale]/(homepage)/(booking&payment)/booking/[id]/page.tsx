"use client";

import { useEffect, useState } from "react";
import BookingInfo from "../components/booking-info";
import CustomerInfo from "../components/customer-info";
import PriceInfo from "../components/price-info";
import SelectedInfo from "../components/selected-info";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "jwt-decode";
import axios from "axios";
import {
  ExceptionOutlined,
  ReconciliationOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import withAuth from "@/components/withAuth";
import { CustomJWT } from "@/utils/jwtCustom";

// interface CustomJWT extends JwtPayload {
//   user_id: string;
//   phoneNum: string;
//   email: string;
//   roles: string;
// }

const Homepage = ({ params }: { params: { id: string } }) => {
  const id = params.id;
  const [daysCount, setDaysCount] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [guests, setGuests] = useState(2);
  const [roomData, setRoomData] = useState([]);
  const [checkInValue, setCheckInValue] = useState("");
  const [checkOutValue, setCheckOutValue] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [role, setRole] = useState("");
  const [hotelData, setHotelData] = useState();
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
      if (response.status === 200) {
        const response = await axios.get(
          `http://localhost:8080/api/hotels/info/${id}`
        );
        setHotelData(response.data);
      }
    };
    fetchData();
    setCheckInValue(checkInValue);
    setCheckOutValue(checkOutValue);
    setRooms(roomsToNum);
    setGuests(guestToNum);
    console.log(hotelData);
  }, [hotelData, id]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decode = jwtDecode<CustomJWT>(token);
      const userId = decode?.user_id;
      const phoneNum = decode?.phoneNum;
      const email = decode?.email;
      const role = decode?.roles[0];
      const fetchAPI = async () => {
        const response = await axios.get(
          `http://localhost:8080/api/users/${userId}`
        );
        const data = response.data;
        const firstName = data.firstName;
        const lastName = data.lastName;
        const fullName = firstName + " " + lastName;
        setFullName(fullName);
      };
      fetchAPI();
      setEmail(email);
      setPhoneNum(phoneNum);
      setRole(role);
    }
  }, []);
  return (
    <>
      <div className="mx-32 flex gap-5">
        <div
          style={{ width: "65%" }}
          className="border p-5 rounded-lg shadow-lg"
        >
          <CustomerInfo
            fullName={fullName}
            phoneNum={phoneNum}
            email={email}
            role={role}
          />
          <div className="rounded-sm shadow-sm border w-full p-5 mt-5">
            <PriceInfo
              roomData={roomData}
              daysCount={daysCount}
              rooms={rooms}
              guests={guests}
              checkInDate={checkInValue}
              checkOutDate={checkOutValue}
              fullName={fullName}
              phoneNum={phoneNum}
              email={email}
            />
          </div>
        </div>
        <div style={{ width: "35%" }} className="">
          <div className="border p-5 rounded-lg shadow-lg">
            <BookingInfo
              setDaysCount={setDaysCount}
              roomData={roomData}
              hotelData={hotelData}
              checkInValue={checkInValue}
              checkOutValue={checkOutValue}
            />
          </div>
          <div className="border p-5 rounded-lg shadow-lg mt-5">
            <div>
              <p className="text-lg font-bold">
                <ReconciliationOutlined /> Chính sách lưu trú
              </p>
              <p className="text-base font-bold mt-5">
                <SolutionOutlined /> Giấy tờ bắt buộc
              </p>
              <p className="text-sm font-semibold mt-2 m-4">
                Khi nhận phòng, bạn cần cung cấp CMND/CCCD. Các giấy tờ cần
                thiết có thể ở dạng bản mềm.
              </p>
              <p className="text-base font-bold mt-5">
                <ExceptionOutlined /> Bữa sáng bổ sung
              </p>
              <p className="text-sm font-semibold mt-2 m-4">
                Cơ sở lưu trú sẽ thu VND 150,000/mỗi khách khi bạn đặt thêm bữa
                sáng bổ sung.
              </p>
              <a href="" className="text-base font-bold m-4 text-blue-900">
                Xem chi tiết
              </a>
            </div>
            <br />
          </div>
        </div>
      </div>
    </>
  );
};
export default Homepage;
