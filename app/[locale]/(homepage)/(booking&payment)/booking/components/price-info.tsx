import { Button, Col, Divider, Modal, Row, message } from "antd";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ConsoleSqlOutlined } from "@ant-design/icons";
import { CustomJWT } from "@/utils/jwtCustom";
export default function PriceInfo({
  roomData,
  rooms,
  daysCount,
  guests,
  checkInDate,
  checkOutDate,
  fullName,
  phoneNum,
  email,
}) {
  const roomType = roomData?.roomType?.typeName;
  const roomPrice = roomData?.price;
  const roomId = roomData?.id;
  const hotelName = roomData ? roomData?.hotel?.hotelName : "Không tồn tại";
  const hotelPhoneNum = roomData
    ? roomData?.hotel?.hotelPhoneNum
    : "Không tồn tại";
  const address = roomData ? roomData?.hotel?.address : "Không tồn tại";
  const checkInTime = roomData ? roomData?.hotel?.checkInTime : "không tồn tại";
  const checkOutTime = roomData
    ? roomData?.hotel?.checkOutTime
    : "không tồn tại";
  const ownerEmail = roomData?.ownerEmail;

  const [price, setPrice] = useState(0);
  const [tax, setTax] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [bookingId, setBookingId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter();

  const checkToken = () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decode = jwtDecode<CustomJWT>(token);
        const userId = decode?.user_id;
        const role = decode?.roles[0];
        console.log(userId, role);

        return { userId, role }; // Trả về id nếu cần
      } catch (error) {
        console.error("Lỗi giải mã token:", error);
        return null;
      }
    } else {
      return null;
    }
  };

  useEffect(() => {
    const price = roomPrice * rooms * daysCount;
    const tax = (price * 5) / 100;
    const total = price + tax;
    setTotalPrice(total);
    setTax(tax);
    setPrice(price);
  }, [rooms, daysCount, roomPrice]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const saveBookingData = (data) => {
    const timestamp = Date.now();
    const key = `bookingData_${timestamp}`;
    const expirationTime = timestamp + 45 * 60 * 1000; // 45 minutes in milliseconds
    const dataWithExpiration = {
      data: data,
      expiration: expirationTime,
    };
    localStorage.setItem(key, JSON.stringify(dataWithExpiration));
  };

  const handleBooking = async () => {
    const userId = checkToken()?.userId;
    const role = checkToken()?.role;
    console.log(userId, role);

    if (userId === null || role !== "CUSTOMER") {
      localStorage.setItem("bookingHref", window.location.href);
      message.error("Bạn cần đăng nhập để truy cập.");
      router.push("/login");
    } else {
      const bookingDate = dayjs().format("YYYY-MM-DD");
      const checkIn = checkInDate;
      const checkOut = checkOutDate;
      const values = {
        bookingDate: bookingDate,
        check_in_date: checkIn,
        check_out_date: checkOut,
        total_price: totalPrice,
        //  status: "PENDING",
        num_of_rooms: rooms,
        num_of_guest: guests,
        userId: userId,
        roomId: roomId,
      };
      console.log(values);
      try {
        const response = await axios.post(
          "http://localhost:8080/api/bookings",
          values
        );
        console.log(roomId);
        console.log(response.data.id);
        if (response.status === 201) {
          setBookingId(response.data.id);
          showModal();
        }
      } catch (error) {
        console.error("Failed to submit data:", error);
        message.error("Failed to submit data");
      }
    }
  };

  const handlePayment = async () => {
    const bookingDate = dayjs().format("YYYY-MM-DD");
    const checkIn = checkInDate;
    const checkOut = checkOutDate;
    const paymentValues = {
      amount: totalPrice.toString() || "",
      bookingId: bookingId || "",
      userId: checkToken()?.userId || "",
    };
    const paymentObject = {
      amount: totalPrice.toString(),
      bookingId: bookingId,
      userId: checkToken()?.userId,
      bookingDate: bookingDate,
      check_in_date: checkIn,
      check_out_date: checkOut,
      total_price: totalPrice,
      num_of_rooms: rooms,
      num_of_guests: guests,
      email: email,
      fullName: fullName,
      phoneNum: phoneNum,
      hotelName: hotelName,
      roomType: roomType,
      address: address,
      checkInTime: checkInTime,
      checkOutTime: checkOutTime,
      hotelPhoneNum: hotelPhoneNum,
      ownerEmail: ownerEmail,
    };
    console.log(paymentValues);

    localStorage.setItem("bookingInfo", JSON.stringify(paymentObject));
    const queryString = new URLSearchParams(paymentValues).toString();
    try {
      const payment = await axios.post(
        `http://localhost:8080/api/payment/create?${queryString}`
      );

      console.log(payment.data.data);
      if (payment.status === 200) {
        const paymentUrl = payment.data.data;
        console.log(payment.data);
        window.location.href = paymentUrl;
      }
    } catch (error) {
      console.error("Failed to create payment:", error);
      message.error("Failed to create payment");
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    handlePayment();
  };

  const handleCancel = () => {
    const bookingDate = dayjs().format("YYYY-MM-DD");
    const checkIn = checkInDate;
    const checkOut = checkOutDate;
    const bookingData = {
      userId: checkToken()?.userId,
      bookingId: bookingId,
      bookingDate: bookingDate,
      check_in_date: checkIn,
      check_out_date: checkOut,
      total_price: totalPrice,
      num_of_rooms: rooms,
      num_of_guests: guests,
      email: email,
      fullName: fullName,
      phoneNum: phoneNum,
      hotelName: hotelName,
      roomType: roomType,
      address: address,
      checkInTime: checkInTime,
      checkOutTime: checkOutTime,
      hotelPhoneNum: hotelPhoneNum,
      ownerEmail: ownerEmail,
    };
    saveBookingData(bookingData);
    setIsModalVisible(false);
    message.info("Dữ liệu đã được lưu lại trong vòng 45 phút.");
  };

  return (
    <>
      <div className="text-start items-center ">
        <div>
          <strong className="text-lg">Chi tiết giá</strong>
        </div>
        <div>
          <span className="text-sm text-blue-500">
            Thuế và phí là các khoản được Traveloka chuyển trả cho khách sạn.
            Mọi thắc mắc về thuế và hóa đơn, vui lòng tham khảo Điều khoản và
            Điều kiện của Traveloka để được giải đáp
          </span>
        </div>
      </div>
      <Divider />
      <Row className="w-full">
        <Col span={12}>
          <p className="text-lg">Giá phòng</p>
          <p>
            ({rooms}x) {roomType} ({daysCount} night)
          </p>
        </Col>
        <Col span={12} className="text-end justify-end items-center flex ">
          <p className="text-lg">{formatCurrency(price)}</p>
        </Col>
      </Row>
      <Row className="w-full mt-3">
        <Col span={12} className="text-start justify-start items-center flex">
          <p className="text-lg">Thuế & Phí</p>
        </Col>
        <Col span={12} className="text-end justify-end items-center flex ">
          <p className="text-lg">{formatCurrency(tax)}</p>
        </Col>
      </Row>
      <Divider />
      <Row className="w-full mt-3">
        <Col span={12} className="text-start justify-start items-center flex">
          <strong className="text-xl">Tổng tiền</strong>
        </Col>
        <Col span={12} className="text-end justify-end items-center flex ">
          <strong className="text-xl text-orange-600">
            {formatCurrency(totalPrice)}
          </strong>
        </Col>
      </Row>
      <Row className="justify-center mt-6">
        <Button
          style={{ width: "75%", height: "40px" }}
          type="primary"
          danger
          onClick={handleBooking}
        >
          <strong className="text-xl">Tiếp tục thanh toán</strong>
        </Button>
      </Row>
      <Modal
        title="Xác nhận thanh toán"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Có"
        cancelText="Không"
      >
        <p>Bạn có chắc chắn muốn tiếp tục thanh toán không?</p>
      </Modal>
    </>
  );
}
