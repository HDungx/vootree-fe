import { UserIcon } from "@heroicons/react/24/outline";
import { Button, Card, Col, message, Row } from "antd";
import Image from "next/legacy/image";
import React, { useEffect, useState } from "react";
import RoomFacilities from "./roomFacilities";
import { url } from "inspector";
import Link from "next/link";
import axios from "axios";

const url_deploy1 = "https://vootreeveevuu.up.railway.app";
const url_local = "http://localhost:8080";
export default function RoomInfo({ data, roomsQuantity, fetchData, hotelid }) {
  const validateRoom = data?.rooms?.length > 0;
  const validateImg = data?.rooms?.room_images?.length > 0;
  const [availableRooms, setAvailableRooms] = useState();

  useEffect(() => {
    console.log(data?.rooms);
  });

  const formatNumber = (number) => {
    return number?.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    });
  };

  const handleButtonClick = async (item) => {
    try {
      const fetchDataRoom = async () => {
        const searchParams = new URLSearchParams(window.location.search);
        const searchValue = searchParams.get("search");
        const checkInValue = searchParams.get("checkIn");
        const checkOutValue = searchParams.get("checkOut");
        const guestsValue = searchParams.get("guests");
        const roomsValue = searchParams.get("rooms") || "";
        const response = await axios.get(
          `${url_local}/api/hotels/${hotelid}`,
          {
            params: {
              id: hotelid,
              city: searchValue,
              hotelName: searchValue,
              capacity: guestsValue,
              checkinDate: checkInValue,
              checkoutDate: checkOutValue,
              rooms: roomsValue,
            },
          }
        ); // API backend trả về toàn bộ giá trị
        const allData = await response.data;

        const rooms = allData.rooms;
        const room = rooms.filter((room) => room.id == item.id);
        console.log(room);
        if (room === undefined) {
          message.error("Not enough available rooms");
        } else {
          const available = room[0]?.availableRooms;
          console.log(available);
          if (roomsQuantity > available || available === undefined) {
            message.error("Not enough available rooms");
          } else {
            // alert("Not enough available rooms");
            console.log(available);
            const query = new URLSearchParams(
              window.location.search
            ).toString();
            window.location.href = `/booking/${item.id}?${query}`;
          }
        }
      };

      fetchDataRoom();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div
      className="mx-52 border h-full p-5 shadow-lg"
      style={{
        backgroundImage:
          "/static_images/simple-geometric-white-small-fresh-powerpoint-background_fd68981dc3__960_540.avif",
        backgroundSize: "fill",
      }}
    >
      <strong className="text-lg">Các loại phòng của {data.hotelName}</strong>
      {validateRoom
        ? data.rooms.map((item) => (
            <div className="border mt-2 p-4" key={item.roomId}>
              <strong className="text-lg">{item.roomType.typeName}</strong>
              <Row className="mt-2">
                <Col span={7} className="h-52">
                  <img
                    src={`${url_local}${item.room_images
                      .map((img) => img.imageUrl)
                      .slice(0, 1)}`}
                    // width={300}
                    // height={235}
                    style={{width:300,height:200}}
                    alt=""
                    className="rounded-lg"
                  />
                </Col>
                <Col span={17}>
                  <div className="w-full">
                    <Card hoverable={false} className="shadow-sm">
                      <Card.Grid
                        hoverable={false}
                        style={{ width: "40%", height: "20px" }}
                        className="items-center text-start flex"
                      >
                        <strong>Dịch vụ/Tiện ích phòng</strong>
                      </Card.Grid>
                      <Card.Grid
                        hoverable={false}
                        style={{ width: "15%", height: "20px" }}
                        className="items-center text-start flex"
                      >
                        <strong>Khách</strong>
                      </Card.Grid>
                      <Card.Grid
                        hoverable={false}
                        style={{ width: "25%", height: "20px" }}
                        className="items-center text-start flex"
                      >
                        <strong>Giá/phòng/đêm</strong>
                      </Card.Grid>
                      <Card.Grid
                        hoverable={false}
                        style={{ width: "20%", height: "20px" }}
                        className="items-center text-start flex"
                      ></Card.Grid>
                    </Card>
                  </div>
                  <div className="w-full">
                    <Card hoverable={false} className="shadow-sm">
                      <Card.Grid
                        hoverable={false}
                        style={{ width: "40%", height: 152 }}
                        className="items-center text-start flex"
                      >
                        <div>
                          <RoomFacilities
                            data={item.roomFacilities}
                            size={item.roomSize}
                          />
                        </div>
                      </Card.Grid>
                      <Card.Grid
                        hoverable={false}
                        style={{ width: "15%" }}
                        className="items-center text-start flex"
                      >
                        <UserIcon className="h-6 w-6 text-gray-500" />{" "}
                        <strong>x{item.capacity}</strong>
                      </Card.Grid>
                      <Card.Grid
                        hoverable={false}
                        style={{ width: "25%" }}
                        className="items-center text-start flex"
                      >
                        <strong className="text-orange-600 text-lg">
                          {formatNumber(item.price)}
                        </strong>
                      </Card.Grid>
                      <Card.Grid
                        hoverable={false}
                        style={{ width: "20%" }}
                        className="flex flex-col items-center text-start justify-center"
                      >
                        {/* <Link
                          href={{
                            pathname: `/booking/${item.id}`,
                            query: {
                              ...Object.fromEntries(
                                new URLSearchParams(window.location.search)
                              ),
                            },
                          }}
                        > */}
                        <Button
                          size="large"
                          type="primary"
                          danger
                          onClick={() => handleButtonClick(item)}
                        >
                          Chọn phòng
                        </Button>
                        {/* </Link> */}
                        <strong className="my-2 text-orange-600 text-sm">
                          Chỉ còn {item.availableRooms} phòng
                        </strong>
                      </Card.Grid>
                    </Card>
                  </div>
                </Col>
              </Row>
            </div>
          ))
        : "chưa có database"}
    </div>
  );
}
