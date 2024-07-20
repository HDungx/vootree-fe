import React, { useState, useEffect } from "react";
import { Card, Pagination } from "antd";
import {
  CalendarOutlined,
  TeamOutlined,
  HomeOutlined,
  EuroCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import axios from "axios";
import {jwtDecode} from "jwt-decode";

export default function HistoryBooking() {
  const [bookings, setBookings] = useState([]);
  const [userId, setUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 4;

  useEffect(() => {
    const token = localStorage.getItem("token"); // Thay thế bằng phương thức lưu trữ token của bạn

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const userId = decoded.id; // Điều chỉnh theo cấu trúc của JWT của bạn
        setUserId(userId);

        const fetchData = async () => {
          try {
            const response = await axios.get(
              `http://localhost:8080/api/bookings/${userId}/booking-history`
            );
            setBookings(response.data);
          } catch (error) {
            console.error(
              "Có lỗi xảy ra khi lấy dữ liệu đặt phòng!",
              error
            );
          }
        };

        fetchData();
      } catch (error) {
        console.error("Token không hợp lệ");
      }
    } else {
      console.error("Không tìm thấy token");
    }
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Tính toán các thẻ sẽ hiển thị trên trang hiện tại
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentBookings = bookings.slice(indexOfFirstCard, indexOfLastCard);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-4">
        {currentBookings.map((booking) => {
          const {
            id,
            hotelName,
            checkInDate,
            checkOutDate,
            numOfGuest,
            numOfRoom,
            totalPrice,
            status,
            roomType,
            bookingDate,
          } = booking;
          return (
            <Card
              key={id}
              title={<span className="text-black "><HomeOutlined /> {hotelName}</span>}
              style={{ width: "100%" }}
              className="border-2 border-sky-500 shadow-lg "
            >
              <div className="grid grid-cols-3 gap-4">
                <p className="text-lg font-semibold mb-2">
                  <CalendarOutlined /> Ngày đặt:{" "}
                  <span className="text-blue-500">{bookingDate}</span>
                </p>
                <p className="text-lg font-semibold mb-2">
                  <CalendarOutlined /> Ngày nhận phòng:{" "}
                  <span className="text-blue-500">{checkInDate}</span>
                </p>
                <p className="text-lg font-semibold mb-2">
                  <CalendarOutlined /> Ngày trả phòng:{" "}
                  <span className="text-blue-500">{checkOutDate}</span>
                </p>
                <p className="text-lg font-semibold mb-2">
                  <TeamOutlined /> Số khách:{" "}
                  <span className="text-blue-500">{numOfGuest}</span>
                </p>
                <p className="text-lg font-semibold mb-2">
                  <HomeOutlined /> Số phòng:{" "}
                  <span className="text-blue-500">{numOfRoom}</span>
                </p>
                <p className="text-lg font-semibold mb-2">
                  <HomeOutlined /> Loại phòng:{" "}
                  <span className="text-blue-500">{roomType}</span>
                </p>
                <p className="text-lg font-semibold mb-2">
                  <EuroCircleOutlined /> Tổng giá:{" "}
                  <span className="text-blue-500">{formatPrice(totalPrice)}</span>
                </p>
                <p className="text-lg font-semibold mb-2">
                  <FileTextOutlined /> Trạng thái:{" "}
                  <span className="text-blue-500">{status}</span>
                </p>
              </div>
            </Card>
          );
        })}
      </div>
      <Pagination
        current={currentPage}
        pageSize={cardsPerPage}
        total={bookings.length}
        onChange={handlePageChange}
        style={{ textAlign: "center", marginTop: "20px" }}
      />
    </div>
  );
}
