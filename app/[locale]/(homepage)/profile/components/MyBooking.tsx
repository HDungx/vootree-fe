import React, { useEffect, useState } from "react";
import { Button, Card, Col, Collapse, message, Row } from "antd";
import dayjs from "dayjs";
import CountdownTimer from "./CountdownTimer";
import axios from "axios";

interface BookingData {
  key: string;
  data: any; // Thay thế 'any' bằng kiểu dữ liệu chính xác nếu có thể
  expiration: any; // Thay thế 'any' bằng kiểu dữ liệu chính xác nếu có thể
}
const url_deploy1 = "https://vootreeveevuu.up.railway.app";
const url_local = "http://localhost:8080";
const MyBooking = () => {
  const [bookings, setBookings] = useState<BookingData[]>([]);

  useEffect(() => {
    const loadBookings = () => {
      const bookingsArray: BookingData[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i) || "";
        // if (key.startsWith("bookingData_")) {

        //   const bookingData = JSON.parse(localStorage.getItem(key));
        //   bookingsArray.push({
        //     key: key,
        //     data: bookingData.data,
        //     expiration: bookingData.expiration,
        //   });
        // }

        if (key.startsWith("bookingData_")) {
          const storedData = localStorage.getItem(key);

          if (storedData !== null) {
            try {
              const bookingData = JSON.parse(storedData);
              bookingsArray.push({
                key: key,
                data: bookingData.data,
                expiration: bookingData.expiration,
              });
            } catch (error) {
              console.error("Error parsing JSON from localStorage:", error);
            }
          } else {
            console.warn(`No data found for key: ${key}`);
          }
        }
      }
      setBookings(bookingsArray);
    };

    loadBookings();
  }, []);

  useEffect(() => {
    clearExpiredBookings(); // Xóa dữ liệu hết hạn khi component được render
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const clearExpiredBookings = () => {
    const now = Date.now();
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i) || "";
      if (key.startsWith("bookingData_")) {
        const storedData = localStorage.getItem(key);
        if (storedData !== null) {
          try {
            const item = JSON.parse(storedData);
            if (item && item.expiration < now) {
              localStorage.removeItem(key); // Xóa dữ liệu đã hết hạn
            }
          } catch (error) {
            console.error("Error parsing JSON from localStorage:", error);
          }
        } else {
          console.warn(`No data found for key: ${key}`);
        }
      }
    }
  };

  const handlePayment = async (bookingData, bookingKey) => {
    const paymentData = {
      amount: bookingData.total_price.toString(),
      ...bookingData,
    };
    const paymentValues = {
      amount: bookingData.total_price.toString(),
      bookingId: bookingData.bookingId,
      userId: bookingData.userId,
    };
    localStorage.setItem("selectedKey",bookingKey);
    localStorage.setItem("bookingInfo", JSON.stringify(paymentData));
    const queryString = new URLSearchParams(paymentValues).toString();
    try {
      const payment = await axios.post(
        `${url_local}/api/payment/create?${queryString}`
      );

      console.log(payment.data.data);
      if (payment.status === 200) {
        const paymentUrl = payment.data.data;
        window.location.href = paymentUrl;
      }
    } catch (error) {
      console.error("Failed to create payment:", error);
      message.error("Failed to create payment");
    }
  };

  return (
    <div className="p-10">
      {bookings?.length > 0 ? (
        <div className="border rounded-md shadow-md p-5">
          <div>
            <p className="text-2xl font-bold">Đang mua hàng</p>
          </div>

          <div className="mt-5 p-5">
            {bookings.map((booking: any) => (
              <Collapse
                key={booking.key}
                items={[
                  {
                    showArrow: false,
                    key: `${booking.key}`,
                    label: (
                      <div className="p-2 flex">
                        <div className="w-6/12">
                          <span className="text-lg text-sky-600 font-semibold">
                            {booking.data.hotelName}
                          </span>
                          <p className="text-sky-500 font-semibold">
                            Phòng: {booking.data.roomType}
                          </p>
                          <p className="text-stone-500 font-semibold">
                            Mã đặt chỗ VooTreeVeeVuu:{" "}
                            <span className="font-bold">
                              {" "}
                              {booking.data.bookingId}
                            </span>
                          </p>
                          <div className="mt-2">
                            <CountdownTimer expiration={booking.expiration} />
                          </div>
                        </div>
                        <div className="w-6/12 text-end items-center pt-5">
                          <p className="text-red-500 text-lg font-bold">
                            {formatPrice(booking.data.total_price)}
                          </p>
                          <Button
                            type="text"
                            className="text-sky-600 font-bold hover:underline"
                            onClick={() =>
                              handlePayment(booking.data, booking.key)
                            }
                          >
                            Tiếp tục thanh toán
                          </Button>
                        </div>
                      </div>
                    ),
                    children: (
                      <div className="font-semibold">
                        <div>
                          <div>
                            <span>Ngày nhận/trả phòng:</span>{" "}
                            <span className="text-sky-500">
                              {dayjs(booking.data.check_in_date).format(
                                "DD-MM-YYYY"
                              )}{" "}
                              /{" "}
                              {dayjs(booking.data.check_out_date).format(
                                "DD-MM-YYYY"
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <span>Số người/phòng:</span>{" "}
                          <span className="text-sky-500">
                            {booking.data.num_of_guests} Người /{" "}
                            {booking.data.num_of_rooms} Phòng
                          </span>
                        </div>
                      </div>
                    ),
                  },
                ]}
              />
            ))}
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="border rounded-md shadow-md p-5">
        <div>
          <p className="text-2xl font-bold">
            Vé điện tử & phiếu thanh toán hiện hành
          </p>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default MyBooking;
