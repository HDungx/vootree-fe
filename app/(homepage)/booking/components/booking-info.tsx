import { Col, Divider, Image, Row, message } from "antd";

import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
export default function BookingInfo({
  roomData,
  checkInValue,
  checkOutValue,
  setDaysCount,
}) {
  const hotelName = roomData ? roomData?.hotel?.hotelName : "Không tồn tại";
  const roomType = roomData?.roomType?.typeName;
  const hotelImage = roomData?.hotel?.hotelImages[1]?.path;
  const roomPrice = roomData?.price;
  const capacity = roomData?.capacity;
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");

  const [bookingPrice, setBookingPrice] = useState(0);
  const [tax, setTax] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const formatCheckInDate = dayjs(checkInValue).format("DD/MM/YYYY");
    const formatCheckOutDate = dayjs(checkOutValue).format("DD/MM/YYYY");
    const count = dayjs(checkOutValue).diff(dayjs(checkInValue), "days");
    setDaysCount(count);
    setCheckInDate(formatCheckInDate);
    setCheckOutDate(formatCheckOutDate);
  }, [checkInValue, checkOutValue, setDaysCount]);

  // useEffect(() => {
  //   const bookingPrice = roomsValue * roomPrice * daysCount;
  //   const tax = (bookingPrice * 5) / 100;
  //   const total = bookingPrice + tax;
  //   setTotalPrice(total);
  //   setTax(tax);
  //   setBookingPrice(bookingPrice);
  // }, [rooms, roomPrice, daysCount]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };
  return (
    <>
      <Row className="h-24 ">
        <Col span={8}>
          <Image src={`/hotelImg/${hotelImage}`} alt="" layout="fill" />
        </Col>
        <Col span={16} className="px-4">
          <strong className="text-lg text-sky-600">{hotelName}</strong>
          <p className="font-semibold">{roomType}</p>
        </Col>
      </Row>
      <Divider />
      <Row>
        <Col span={12} className="flex justify-start items-center">
          <Image src="/icon/check-in (1).png" width={30} height={30} alt="" />
          <span className="font-semibold ms-2  text-stone-500">
            Ngày nhận phòng
          </span>
        </Col>
        <Col span={12} className="flex justify-end items-center">
          <span className="font-semibold  ">{checkInDate}</span>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col span={12} className="flex justify-start items-center">
          <Image src="/icon/check-out (1).png" width={30} height={30} alt="" />
          <span className="font-semibold ms-2 text-stone-500">
            Ngày trả phòng
          </span>
        </Col>
        <Col span={12} className="flex justify-end items-center">
          <span className="font-semibold  0">{checkOutDate}</span>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col span={12} className="flex justify-start items-center">
          <Image src="/icon/user (2).png" width={30} height={30} alt="" />
          <span className="font-semibold ms-2  text-stone-500">
            Số lượng khách
          </span>
        </Col>
        <Col span={12} className="flex justify-end items-center">
          <span className="font-semibold 0"> {capacity} khách/phòng</span>
        </Col>
      </Row>
      <Divider />
      <Row gutter={24}>
        <Col>
          <span className="font-semibold"> Tổng giá phòng</span>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col span={12} className="text-start">
          <span className="font-semibold text-stone-500 ms-2">
            <span className="underline text-black font-bold">1</span> phòng(s) x{" "}
            <span className="underline text-black font-bold">1</span> đêm(s)
          </span>
        </Col>
        <Col span={12} className="text-end">
          <span className="font-bold">{formatCurrency(roomPrice)}</span>
        </Col>
      </Row>
      {/* <Row className="mt-4">
        <Col span={12} className="text-start">
          <span className="font-semibold text-stone-500 ms-2">Tax & fee</span>
        </Col>
        <Col span={12} className="text-end">
          <span className="font-bold">{formatCurrency(tax)}</span>
        </Col>
      </Row> */}
      {/* <Divider />
      <Row className="mt-4">
        <Col span={12} className="text-start">
          <span className="font-bold   ms-2">Tổng tiền</span>
        </Col>
        <Col span={12} className="text-end">
          <span className="font-bold text-orange-600 ">
            {formatCurrency(totalPrice)}
          </span>
        </Col>
      </Row> */}
      <div className="w-full h-12 bg-neutral-200 mt-4 rounded-md flex items-center justify-center">
        <Image src="/icon/call (1).png" width={30} height={30} alt="" />
        <span className="text-sm font-semibold ms-2">
          Gọi 1900 1234 để được hỗ trợ 24/7
        </span>
      </div>
    </>
  );
}
