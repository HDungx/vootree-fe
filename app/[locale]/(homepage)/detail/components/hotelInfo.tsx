import { MapPinIcon } from "@heroicons/react/24/outline";
import { Col, Image, Rate, Row, Tag } from "antd";
import React, { useEffect, useState } from "react";
import HotelFacilities from "./hotelFacilities";

interface Room {
  roomId: string;
  capacity: number;
  price: number;
  quantity: number;
  roomSize: number;
  description: string;
  roomType: {
    typeId: string;
    typeName: string;
  };
  room_images: {
    id: number;
    path: string;
  }[];
}

interface HotelData {
  id: string;
  address: string;
  hotelName: string;
  city: string;
  hotelPhoneNum: string;
  hotelStars: number;
  hotelDescription: string;
  status: string;
  checkInTime: string;
  checkOutTime: string;
  accommodationType: {
    typeId: string;
    typeName: string;
  };
  hotelImages: {
    id: number;
    imageUrl: string;
  }[];
  rooms: Room[];
  hotelFacilities: any[]; // Placeholder for any type
  listRating: any[]; // Placeholder for any type
}

// interface HotelInfoProps {
//   data: HotelData;
// }
const url_deploy1 = "https://vootreeveevuu.up.railway.app";
const url_local = "http://localhost:8080";
export default function HotelInfo({ data }) {
  const [img, setImg] = useState<string[]>([]);

  useEffect(() => {
    if (data?.hotelImages?.length > 0) {
      setImg(data.hotelImages.map((img) => `${url_local}${img.imageUrl}`));
    }
  }, [data]);

  const type = data.accommodationType?.typeName;
  const minPrice: number | undefined =
    data?.rooms?.length > 0
      ? data.rooms.reduce((min, room) => Math.min(min, room.price), Infinity)
      : undefined;
  const formatNumber = (number: number | undefined) => {
    return number?.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    });
  };
  const stars = data.hotelStars;

  return (
    <div className="mx-40 mt-10 h-full shadow-lg rounded-xl pb-3">
      <div className="m-5 ">
        <Row gutter={24}>
          <Col span={19}>
            <strong className="text-xl">{data.hotelName}</strong>
            <div className="mt-2 flex">
              <Tag color="#2db7f5">{type}</Tag>
              <Rate disabled value={stars} />
            </div>
            <div className="flex mt-2">
              <MapPinIcon className="h-6 w-6 text-sky-600 flex" />
              {data.address}
            </div>
          </Col>
          <Col span={5}>
            <div className="justify-end block text-end mt-10">
              <p className="text-sm text-gray-500">Giá/Phòng/Đêm từ</p>
              <p className="text-2xl font-bold text-orange-600">
                {formatNumber(minPrice)}
              </p>
            </div>
          </Col>
        </Row>
      </div>
      <div className="m-5">
        <Row gutter={24}>
          <Col span={12}>
            <Image.PreviewGroup>
              <Image
                src={img.length > 0 ? img[0] : ""}
                width={580}
                height={384}
                alt=""
                className="rounded-l-lg"
              />
            </Image.PreviewGroup>
          </Col>
          <Col span={12} className="h-48">
            <Row className="gap-4 justify-end">
              <Image.PreviewGroup>
                {img.slice(1, 5).map((path, index) => (
                  <Col key={index}>
                    <Image
                      src={path}
                      width={280}
                      height={182}
                      alt=""
                      className="rounded-sm"
                    />
                  </Col>
                ))}
              </Image.PreviewGroup>
            </Row>
          </Col>
        </Row>
      </div>
      <div className="m-5">
        <Row className="justify-between">
          <div
            style={{ width: 580, height: 150 }}
            className="px-4 py-2 rounded-md border shadow-sm"
          >
            <strong>Thông tin khách sạn</strong>
            <p className="mt-2">{data.hotelDescription}</p>
          </div>
          <div
            style={{ width: 580, height: 150 }}
            className="px-4 py-2 rounded-md border shadow-sm"
          >
            <strong>Dịch vụ/Tiện ích chính</strong>
            <div>
              <HotelFacilities data={data.hotelFacilities} />
            </div>
          </div>
        </Row>
      </div>
    </div>
  );
}
