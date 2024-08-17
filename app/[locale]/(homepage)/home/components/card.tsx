"use client";
import "@/app/[locale]/(homepage)/home/style.module.css";
import { Card, Carousel, Col, Rate, Row, Skeleton, message } from "antd";
import dayjs from "dayjs";
import Image from "next/legacy/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const formatNumber = (number) => {
  return number.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
};

const checkInValue = dayjs().format("YYYY-MM-DD");
const checkOutValue = dayjs().add(1, "day").format("YYYY-MM-DD");
const guestsValue = "1";
const roomsValue = "1";
const url_deploy = "https://vootreeveevuu.up.railway.app";
const url_local = "http://localhost:8080";
const CardHotel = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${url_deploy}/api/hotels`); // API backend trả về toàn bộ giá trị
        const allData = await response.json();
        setData(allData); // Lưu trữ toàn bộ dữ liệu
      } catch (error) {
        message.error("Lỗi");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="justify-center flex mx-3 my-3">
        <Row gutter={24}>
          <Carousel
            autoplay
            arrows
            slidesToShow={4}
            slidesToScroll={1}
            style={{ width: 1000, height: 400 }}
          >
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <Col md={12} lg={6} xs={24} key={index} className="mt-3">
                  <Card hoverable style={{ width: 240 }}>
                    <Skeleton.Image style={{ width: 240, height: 150 }} />
                    <Skeleton active paragraph={{ rows: 3 }} />
                  </Card>
                </Col>
              ))
            ) : data.length > 0 ? (
              data?.slice(0, 5).map((item: any) => (
                <Col md={12} lg={6} xs={24} key={item.id} className="mt-3">
                  <Link
                    href={{
                      pathname: `/detail/${item.id}`,
                      query: {
                        search: item?.hotelName,
                        checkIn: checkInValue,
                        checkOut: checkOutValue,
                        guests: guestsValue,
                        rooms: roomsValue,
                      },
                    }}
                  >
                    <Card
                      hoverable
                      style={{ width: 240 }}
                      cover={
                        <Skeleton
                          loading={loading}
                          active
                          avatar={{ shape: "square", size: "large" }}
                        >
                          <Image
                            src={`${url_deploy}${
                              item.hotelImages.length > 0
                                ? item.hotelImages[0].imageUrl
                                : "/placeholder.jpg"
                            }`}
                            width={240}
                            height={150}
                            alt="title"
                          />
                        </Skeleton>
                      }
                    >
                      <Rate disabled defaultValue={item.hotelStars} />
                      <div>
                        <h1 className="font-bold text-lg">{item.hotelName}</h1>
                        <p>{item.city}</p>
                      </div>
                      <strong>
                        {formatNumber(
                          item?.rooms?.reduce(
                            (min, room) => Math.min(min, room.price),
                            Infinity
                          )
                        )}
                        /đêm
                      </strong>
                    </Card>
                  </Link>
                </Col>
              ))
            ) : (
              <div>
                <p>No data</p>
              </div>
            )}
          </Carousel>
        </Row>
      </div>
    </>
  );
};

export default CardHotel;
