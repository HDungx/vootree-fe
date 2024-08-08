"use client";
import React from "react";
import Image from "next/legacy/image";
import { Col, Row, Typography } from "antd";
import Link from "next/link";
import dayjs from "dayjs";

const cityInfo = [
  {
    name: "DN",
    image: "/static_images/cauvang-1654247842-9403-1654247849.jpg",
    title: "Đà nẵng",
    link: "/home",
  },
  {
    name: "QN",
    image: "/static_images/halongbay-3501.jpg.webp",
    title: "Quảng Ninh",
    link: "/home",
  },
  {
    name: "HU",
    image: "/static_images/hoi-an-1680591517857660432696.webp",
    title: "Huế",
    link: "/home",
  },
  {
    name: "DL",
    image: "/static_images/du-lich-Da-Lat-ivivu.jpg",
    title: "Đà Lạt",
    link: "/home",
  },
  {
    name: "NT",
    image: "/static_images/nhattrang3-16721128389061596602579.jpg",
    title: "Nha Trang",
    link: "/home",
  },
  {
    name: "HCM",
    image:
      "/static_images/tao-da-de-tphcm-phat-trien-thanh-do-thi-thong-minh1517188897.jpg",
    title: "Hồ Chí Minh",
    link: "/home",
  },
  {
    name: "HN",
    image: "/static_images/gioi-thieu-ve-ha-noi-banner.jpg",
    title: "Hà Nội",
    link: "/home",
  },
  {
    name: "PQ",
    image: "/static_images/dulichPhuQuoc-1649392573-9234-1649405369.jpg",
    title: "Phú Quốc",
    link: "/home",
  },
];
const checkInValue = dayjs().format("YYYY-MM-DD");
const checkOutValue = dayjs().add(1, "day").format("YYYY-MM-DD");
const guestsValue = "1";
const roomsValue = "1";
const Card = () => {
  return (
    <Row gutter={24} className="w-4/5">
      {cityInfo.map((item) => (
        <Col md={12} lg={6} xs={24} key={item.name} className="mt-5">
          <Link
            href={{
              pathname: `/hotels`,
              query: {
                search: item?.title,
                checkIn: checkInValue,
                checkOut: checkOutValue,
                guests: guestsValue,
                rooms: roomsValue,
              },
            }}
            className="w-44 h-0"
          >
            <div className="relative w-full h-40 bg-cover bg-center rounded-lg shadow-md overflow-hidden hover:shadow-md hover:shadow-slate-500">
              <Image
                src={item.image}
                alt={item.title}
                layout="fill"
                sizes="100vw,100vh"
                className="absolute inset-0"
              />
              <div className="absolute top-3 left-0 p-4">
                <Typography.Title
                  level={5}
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "large",
                    textDecoration: "",
                  }}
                >
                  <div className="flex">
                    {item.title}
                    {/* <Image
                      src="/icon/co-viet-nam.webp"
                      alt="Vietnam Flag"
                      width={28}
                      height={23}
                      className="ms-4"
                    /> */}
                  </div>
                </Typography.Title>
              </div>
            </div>
          </Link>
        </Col>
      ))}
    </Row>
  );
};
export default Card;
