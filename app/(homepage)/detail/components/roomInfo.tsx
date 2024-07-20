import { UserIcon } from "@heroicons/react/24/outline";
import { Button, Card, Col, Row } from "antd";
import Image from "next/legacy/image";
import React from "react";
import RoomFacilities from "./roomFacilities";
import { url } from "inspector";
import Link from "next/link";

export default function RoomInfo({ data }) {
  const validateRoom = data?.rooms?.length > 0;
  const validateImg = data?.rooms?.room_images?.length > 0;

  const formatNumber = (number) => {
    return number?.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    });
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
      <strong className="text-lg">Các loại phòng của khách sạn A</strong>
      {validateRoom
        ? data.rooms.map((item) => (
            <div className="border mt-2 p-4" key={item.roomId}>
              <strong className="text-lg">{item.roomType.typeName}</strong>
              <Row className="mt-2">
                <Col span={7} className="h-52">
                  <Image
                    src={`/hotelImg/${item.room_images
                      .map((img) => img.path)
                      .slice(0, 1)}`}
                    width={300}
                    height={200}
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
                        className="items-center text-start justify-center flex"
                      >
                        <Link
                          href={{
                            pathname: `/booking/${item.id}`,
                            query: {
                              ...Object.fromEntries(
                                new URLSearchParams(window.location.search)
                              ),
                            },
                          }}
                        >
                          <Button
                            size="large"
                            type="primary"
                            danger
                            //href={}
                          >
                            Chọn phòng
                          </Button>
                        </Link>
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
