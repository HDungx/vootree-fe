import { MapPinIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Card,
  Col,
  Empty,
  List,
  Rate,
  Row,
  Spin,
  Typography,
  message,
} from "antd";
import axios from "axios";
import Image from "next/legacy/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
const gridStyle: React.CSSProperties = {
  width: "168px",
  textAlign: "center",
  fontSize: "15px",
  fontWeight: "bold",
};

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
  length: number;
  filter(arg0: (item: any) => any): HotelData;
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
  ratings: any[]; // Placeholder for any type
}

const url_deploy1 = "https://vootreeveevuu.up.railway.app";
const url_local = "http://localhost:8080";

const Index = ({ checkedValues, priceRange }) => {
  const [data, setData] = useState<HotelData[] | null>(null); // Lưu trữ dữ liệu bài đăng
  const [visibleData, setVisibleData] = useState<HotelData[]>([]); // Lưu trữ dữ liệu hiển thị
  const [loading, setLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true); // Flag kiểm tra còn dữ liệu
  const pageSize = 10; // Số lượng dữ liệu hiển thị mỗi trang
  const [sortType, setSortType] = useState("");
  const [rooms, setRooms] = useState([]);
  //const router = useRouter();
  const [isData, setIsData] = useState(true);
  //const { query } = router;
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const searchValue = searchParams.get("search");
    const checkInValue = searchParams.get("checkIn");
    const checkOutValue = searchParams.get("checkOut");
    const guestsValue = searchParams.get("guests");
    const roomsValue = searchParams.get("rooms");

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${url_local}/api/hotels/search`, {
          params: {
            city: searchValue,
            hotelName: searchValue,
            capacity: guestsValue,
            checkinDate: checkInValue,
            checkoutDate: checkOutValue,
            rooms: roomsValue,
          },
        }); // API backend trả về toàn bộ giá trị

        const allData = await response.data;
        if (allData.length === 0) {
          setIsData(false);
        } else {
          setIsData(true);
          setData(allData); // Lưu trữ toàn bộ dữ liệu
          setRooms(allData.rooms);
          setVisibleData(allData.slice(0, pageSize)); // Hiển thị 10 giá trị đầu tiên
          setHasMoreData(allData.length > pageSize); // Kiểm tra còn dữ liệu
        }
      } catch (error) {
        message.error("Không tìm thấy khách sạn phù hợp");
        setIsData(false);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    if (!data || data.length === 0) {
      return; // Bỏ qua việc lọc nếu data null hoặc rỗng
    }
    let filteredData = data;
    if (Array.isArray(checkedValues) && checkedValues.length > 0) {
      filteredData = filteredData.filter((item) =>
        checkedValues.includes(item.hotelStars)
      );
    }

    if (Array.isArray(priceRange)) {
      filteredData = filteredData.filter((item) =>
        item.rooms.some((room) => {
          const minPrice = item.rooms.reduce(
            (min, room) => Math.min(min, room.price),
            Infinity
          );
          return minPrice >= priceRange[0] && minPrice <= priceRange[1];
        })
      );
    }

    setVisibleData(filteredData?.slice(0, pageSize));
  }, [checkedValues, priceRange, data]);
  // Sort data
  const handleSort = (sortBy, order) => {
    if (sortBy === "hotelStars") {
      const sorted = [...visibleData].sort((a, b) => {
        if (a[sortBy] < b[sortBy]) {
          return order === "asc" ? -1 : 1;
        } else if (a[sortBy] > b[sortBy]) {
          return order === "asc" ? 1 : -1;
        } else {
          return 0;
        }
      });

      setVisibleData(sorted);
      setSortType(order);
    } else if (sortBy === "hprice") {
      const sorted = [...visibleData].sort((a, b) => {
        const minPriceA = a.rooms.reduce(
          (min, room) => Math.min(min, room.price),
          Infinity
        );
        const minPriceB = b.rooms.reduce(
          (min, room) => Math.min(min, room.price),
          Infinity
        );
        if (minPriceA < minPriceB) {
          return order === "asc" ? -1 : 1;
        } else if (minPriceA > minPriceB) {
          return order === "asc" ? 1 : -1;
        } else {
          return 0;
        }
      });

      setVisibleData(sorted);
      setSortType(order);
    } else if (sortBy === "lprice") {
      const sorted = [...visibleData].sort((a, b) => {
        const minPriceA = a.rooms.reduce(
          (min, room) => Math.min(min, room.price),
          Infinity
        );
        const minPriceB = b.rooms.reduce(
          (min, room) => Math.min(min, room.price),
          Infinity
        );
        if (minPriceA > minPriceB) {
          return order === "desc" ? -1 : 1;
        } else if (minPriceA < minPriceB) {
          return order === "desc" ? 1 : -1;
        } else {
          return 0;
        }
      });

      setVisibleData(sorted);
      setSortType(order);
    } else if (sortBy === "rate") {
      const sorted = [...visibleData].sort((a, b) => {
        if (a[sortBy] < b[sortBy]) {
          return order === "asc" ? -1 : 1;
        } else if (a[sortBy] > b[sortBy]) {
          return order === "asc" ? 1 : -1;
        } else {
          return 0;
        }
      });

      setVisibleData(sorted);
      setSortType(order);
    }
  };
  //Load more data
  const handleLoadMore = async () => {
    if (hasMoreData) {
      const newData = (data ?? []).slice(
        visibleData.length,
        visibleData.length + pageSize
      );
      setVisibleData([...visibleData, ...newData]);
      setHasMoreData(newData.length === pageSize); // Kiểm tra còn dữ liệu sau khi load more
    }
  };

  const formatNumber = (number) => {
    return number.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  return (
    <div>
      <div>
        <div>
          <Card className="h-30">
            <Card className="w-32 justify-center items-center flex">
              <strong className="text-sky-800 text-base cursor-pointer">Sắp xếp</strong>
            </Card>
            <Card.Grid style={gridStyle} className="cursor-pointer">Tất cả</Card.Grid>
            <Card.Grid
              style={gridStyle}
              onClick={() => handleSort("lprice", "asc")}
              className="cursor-pointer"
            >
              Giá tăng dần
            </Card.Grid>
            <Card.Grid
              style={gridStyle}
              onClick={() => handleSort("hprice", "desc")}
              className="cursor-pointer"
            >
              Giá giảm dần
            </Card.Grid>
            <Card.Grid
              style={gridStyle}
              onClick={() => handleSort("hotelStars", "desc")}
              className="cursor-pointer"
            >
              Xếp hạng sao
            </Card.Grid>
            <Card.Grid
              style={gridStyle}
              onClick={() => handleSort("rate", "desc")}
              className="cursor-pointer"
            >
              Đánh giá
            </Card.Grid>
          </Card>
        </div>
        <div className="mt-3 p-3 justify-between ">
          {isData ? (
            <List
              dataSource={visibleData}
              renderItem={(item) => {
                const searchParams = new URLSearchParams(
                  window.location.search
                );
                searchParams.set("search", item.hotelName);
                const queryParam = Object.fromEntries(searchParams);
                return (
                  <List.Item key={item.id}>
                    <Link
                      href={{
                        pathname: `/detail/${item.id}`,
                        query: queryParam,
                      }}
                      className="w-full"
                    >
                      <Row
                        gutter={24}
                        className="p-3 border h-56 hover:shadow-md rounded-md"
                      >
                        <Col span={6} className="">
                          <img
                            src={`http://localhost:8080${
                              item.hotelImages.length > 0
                                ? item.hotelImages[0].imageUrl
                                : "/placeholder.jpg"
                            
                            }`}
                            //layout="fill"
                            style={{width:240,height:200}}
                            alt=""
                            className="rounded-l-sm"
                          />
                        </Col>
                        <Col span={13} className=" pt-2">
                          <Typography.Title level={4}>
                            {item.hotelName}
                          </Typography.Title>
                          <Typography.Paragraph className="flex">
                            <MapPinIcon className="h-6 w-6 text-sky-600 flex" />
                            {item.address}
                          </Typography.Paragraph>
                          <Rate disabled defaultValue={item.hotelStars} />
                          <Typography.Paragraph className="mt-2">
                            {item.hotelDescription}
                          </Typography.Paragraph>
                        </Col>
                        <Col span={5} className=" justify-end pt-2">
                          <Typography.Paragraph className="text-sky-700 font-bold flex gap-1 text-lg justify-end">
                            <div>
                              <Image
                                src="/icon/paper-plane.png"
                                width={25}
                                height={20}
                                alt=""
                              />
                            </div>
                            {item?.ratings?.length > 0
                              ? (
                                  item.ratings.reduce(
                                    (sum, rate) => sum + rate.rate,
                                    0
                                  ) / item.ratings.length
                                ).toFixed(1)
                              : ""}
                          </Typography.Paragraph>
                          <div className="justify-end items-end block mt-16 text-end">
                            <Typography.Paragraph
                              type="danger"
                              className="font-bold text-xl"
                            >
                              {formatNumber(
                                item.rooms.reduce(
                                  (min, room) => Math.min(min, room.price),
                                  Infinity
                                )
                              )}
                            </Typography.Paragraph>
                            <Typography.Paragraph className="-mt-5 text-xs">
                              Chưa bao gồm thuế và phí
                            </Typography.Paragraph>
                          </div>
                          <div className="justify-end items-end flex">
                            <Button type="primary" danger>
                              Chọn phòng
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </Link>
                  </List.Item>
                );
              }}
              loading={loading}
            />
          ) : (
            <Empty description="Không tìm thấy khách sạn " />
          )}
          {hasMoreData && (
            <Button type="primary" onClick={handleLoadMore} loading={loading}>
              Load More
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
