import { Card, Col, Row, Select, Statistic } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import BookingTable from "./booking-table";
const { Option } = Select;
const url_deploy = "https://vootreeveevuu.up.railway.app";
const url_local = "http://localhost:8080";
export default function BookingView() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [hotelNames, setHotelNames] = useState<string[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<string>();
  const [bookingCount, setBookingCount] = useState(0);
  const [guestCount, setGuestCount] = useState(0);
  const [roomCount, setRoomCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${url_deploy}/api/bookings`)
      .then((response) => {
        const allData = response.data.map((item, index) => ({
          ...item,
          index: index + 1,
        }));
        setData(allData);
        setFilteredData(allData);
        const uniqueHotelNames = Array.from(
          new Set(allData.map((item) => item.hotelName))
        ) as string[];
        setHotelNames(uniqueHotelNames);
        // Tính toán các số liệu thống kê
        calculateStatistics(allData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  const calculateStatistics = (data) => {
    let bookings = 0;
    let guests = 0;
    let rooms = 0;
    let revenue = 0;

    data.forEach((item) => {
      bookings++;
      guests += item.numOfGuest;
      // Assume review count is available in data or can be computed similarly
      rooms += item.numOfRoom;
      revenue += item.totalPrice;
    });

    setBookingCount(bookings);
    setGuestCount(guests);
    setRoomCount(rooms);
    setTotalRevenue(revenue);
  };

  const onChange = (value: string) => {
    setSelectedHotel(value);
    if (value === "all") {
      setFilteredData(data);
      calculateStatistics(data);
    } else {
      const filtered = data.filter((item: any) => item.hotelName === value);
      setFilteredData(filtered);
      calculateStatistics(filtered);
    }
  };

  return (
    <>
      <div>
        <div>
          <span className="font-semibold">Chọn nơi nghỉ</span>{" "}
          <Select
            className="w-80"
            size="large"
            showSearch
            placeholder="Chọn nơi nghỉ của bạn"
            optionFilterProp="label"
            value={selectedHotel}
            onChange={onChange}
          >
            <Option value="all"> Tất cả</Option>
            {hotelNames.map((hotelName) => (
              <Option key={hotelName} value={hotelName}>
                {hotelName}
              </Option>
            ))}
          </Select>
        </div>
        <div className="mt-5">
          <span className="font-semibold">Tổng quan</span>
          <br />
          <Row gutter={16} className="mt-5">
            <Col span={6}>
              <Card
                bordered={false}
                className="justify-center flex border shadow-sm"
              >
                <Statistic title="Lượt đặt phòng" value={bookingCount} />
              </Card>
            </Col>
            <Col span={6}>
              <Card
                bordered={false}
                className="justify-center flex border shadow-sm"
              >
                <Statistic title="Lượng khách" value={guestCount} />
              </Card>
            </Col>
            <Col span={6}>
              <Card
                bordered={false}
                className="justify-center flex border shadow-sm"
              >
                <Statistic title="Số lượng phòng" value={roomCount} />
              </Card>
            </Col>
            <Col span={6}>
              <Card
                bordered={false}
                className="justify-center flex border shadow-sm"
              >
                <Statistic title="Doanh thu" value={totalRevenue} />
              </Card>
            </Col>
          </Row>
        </div>
        <div className="mt-5">
          <BookingTable filteredData={filteredData} loading={loading} />
        </div>
      </div>
    </>
  );
}
