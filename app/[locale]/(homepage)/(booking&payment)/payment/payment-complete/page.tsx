"use client";
import { Button, Divider } from "antd";
import axios from "axios";
import Image from "next/legacy/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";

interface UserInfo {
  email: string;
  phoneNum: string;
  fullName: string;
}

interface BookingInfo {
  hotelName: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  guests: any;
  rooms: any;
  totalPrice: any;
}
const url_deploy1 = "https://vootreeveevuu.up.railway.app";
const url_local = "http://localhost:8080";
export default function Page() {
  const [paymentValues, setPaymentValues] = useState({});
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [bookingInfo, setBookingInfo] = useState<BookingInfo>();
  const [emailReceipt, setEmailReceipt] = useState({});
  const [partnerEmail, setPartnerEmail] = useState();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const localStorageValues = localStorage.getItem("bookingInfo") || "";
    const data = JSON.parse(localStorageValues);
    const fromDate = data.check_in_date;
    const toDate = data.check_out_date;
    const checkInDateFormat = dayjs(fromDate).format("DD/MM/YYYY");
    const checkOutDateFormat = dayjs(toDate).format("DD/MM/YYYY");
    console.log("Data", data);
    const paymentValues = {
      amount: data.amount,
      bookingId: data.bookingId,
      userId: data.userId,
    };
    const userInfo = {
      fullName: data.fullName,
      phoneNum: data.phoneNum,
      email: data.email,
    };
    const bookingInfo = {
      hotelName: data.hotelName,
      roomType: data.roomType,
      checkIn: checkInDateFormat,
      checkOut: checkOutDateFormat,
      guests: data.num_of_guests,
      rooms: data.num_of_rooms,
      totalPrice: data.total_price,
    };
    const receiptInfo = {
      hotelName: data.hotelName,
      roomType: data.roomType,
      cusEmail: data.email,
      num_of_rooms: data.num_of_rooms,
      num_of_guests: data.num_of_guests,
      checkInDate: checkInDateFormat,
      checkOutDate: checkOutDateFormat,
      address: data.address,
      hotelPhoneNum: data.hotelPhoneNum,
      checkInTime: data.checkInTime,
      checkOutTime: data.checkOutTime,
      ownerEmail: data.ownerEmail,
      cusFullName: data.fullName,
      cusPhoneNum: data.phoneNum,
    };

    console.log(data);
    console.log(paymentValues);
    console.log(data);
    console.log(bookingInfo);
    console.log(receiptInfo);

    setEmailReceipt(receiptInfo);
    setBookingInfo(bookingInfo);
    setPaymentValues(paymentValues);
    setUserInfo(userInfo);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    // Chuyển hướng sau 10 giây
    const timer = setTimeout(() => {
      localStorage.removeItem("bookingData");
      window.location.href = "/home";
    }, 10000);

    // Dọn dẹp interval và timeout khi component bị unmount
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  });

  useEffect(() => {
    const param = new URLSearchParams(paymentValues).toString();
    if (param) {
      const fetch = async () => {
        const payment = await axios.post(
          `${url_local}/api/payment/save-payment?${param}`
        );
      };
      const emailReceiptSender = async () => {
        const callAPI = await axios.post(
          `${url_local}/api/email-sender/send-receipt`,
          emailReceipt
        );
      };
      const emailInfoSender = async () => {
        const callAPI = await axios.post(
          `${url_local}/api/email-sender/send-info`,
          emailReceipt
        );
      };
      emailInfoSender();
      emailReceiptSender();
      fetch();
      localStorage.removeItem("bookingInfo");
    }
  }, [paymentValues, emailReceipt]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <>
      <div className="items-center justify-center flex p-10">
        <div className="w-10/12 border rounded-lg flex">
          <div className="p-10 w-3/12 bg-blue-900">
            <div className="text-center">
              <Image
                src="/logo_preview_rev_2.png"
                width={200}
                height={70}
                alt=""
              />
            </div>
            <div className="mt-40 text-white">
              <p className="text-lg  font-semibold">Thông tin người đặt</p>
              <p className="mt-4">
                Họ và tên:{" "}
                <span className="font-semibold">{userInfo?.fullName}</span>
              </p>
              <p className="mt-4">
                Số điện thoại:{" "}
                <span className="font-semibold">{userInfo?.phoneNum}</span>
              </p>
              <p className="mt-4">
                Email: <span className="font-semibold">{userInfo?.email}</span>{" "}
              </p>
            </div>
          </div>
          <div className="p-10 w-9/12">
            <div className="text-end">
              <Image src="/images.png" width={200} height={70} alt="" />
            </div>
            <div className="text-center">
              <Image
                src="/success-icon-512x512-qdg1isa0.png"
                width={80}
                height={80}
                alt=""
              />
              <p className="text-xl">Thanh toán thành công!</p>
            </div>
            <Divider />
            <div>
              <p className="font-semibold text-xl">Thông tin</p>
              <div className="flex mt-4">
                <p className=" w-3/12">Khách sạn:</p>
                <span className="w-6/12 font-semibold">
                  {bookingInfo?.hotelName}
                </span>
              </div>
              <div className="flex mt-4">
                <p className="w-3/12">Phòng:</p>
                <span className="w-6/12 font-semibold">
                  {bookingInfo?.roomType}
                </span>
              </div>
              <div className="flex mt-4">
                <p className="w-3/12">Ngày nhận phòng:</p>

                <span className="w-6/12 font-semibold">
                  {bookingInfo?.checkIn}
                </span>
              </div>
              <div className="flex mt-4">
                <p className="w-3/12">Ngày trả phòng:</p>
                <span className="w-6/12 font-semibold">
                  {bookingInfo?.checkOut}
                </span>
              </div>
              <div className="flex mt-4">
                <p className="w-3/12">Số lượng phòng:</p>
                <span className="w-6/12 font-semibold">
                  {bookingInfo?.rooms}
                </span>
              </div>
              <div className="flex mt-4">
                <p className="w-3/12">Tổng tiền:</p>
                <span className="w-6/12 font-semibold text-emerald-500">
                  {formatCurrency(bookingInfo?.totalPrice)}
                </span>
              </div>
            </div>
            <div className="text-end mt-5">
              <Link
                href={"/home"}
                className="text-blue-500 text-xl font-semibold hover:text-blue-400 hover:underline"
                //onClick={handleDeleteBookingInfo}
              >
                Về trang chủ {countdown}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
