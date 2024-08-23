import React, { useEffect, useState } from "react";
import { Row, Col, Card, Statistic } from "antd";
import axios from "axios";
import StatisticsRevenue from "./StatisticsRevenue";
import HotelStatusDoughnutChart from "./HotelStatusDoughnutChart";
const url_deploy1 = "https://vootreeveevuu.up.railway.app";
const url_local = "http://localhost:8080";
const Dashboard = () => {
  const [customersCount, setCustomersCount] = useState(0);
  const [partnersCount, setPartnersCount] = useState(0);
  const [hotelsCount, setHotelsCount] = useState(0); // State for hotels count
  // const [totalRevenue, setTotalRevenue] = useState(25000000); // Assuming a fixed number for demonstration
  const [totalRevenueCurrentMonth, setTotalRevenueCurrentMonth] = useState(0);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user data
        const responseUsers = await axios.get(
          `${url_local}/api/accounts`
        );
        const users = responseUsers.data;

        // Count customers and partners
        const customersCount = users.filter((user) =>
          user.roles.some((role) => role.name === "CUSTOMER")
        ).length;
        const partnersCount = users.filter((user) =>
          user.roles.some((role) => role.name === "PARTNER")
        ).length;

        setCustomersCount(customersCount);
        setPartnersCount(partnersCount);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchHotelsData = async () => {
      try {
        // Fetch hotels data
        const responseHotels = await axios.get(
          `${url_local}/api/hotels`
        );
        const hotels = responseHotels.data;

        // Set hotels count based on response length
        setHotelsCount(hotels.length);
      } catch (error) {
        console.error("Error fetching hotels data:", error);
      }
    };

    const fetchBookingData = async () => {
      try {
        // Fetch booking data
        const responseBookings = await axios.get(
          `${url_local}/api/bookings`
        );
        const bookings = responseBookings.data;

        // Calculate total revenue for current month
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1; // Month is zero-indexed
        const currentYear = currentDate.getFullYear();

        const totalRevenueThisMonth = bookings.reduce((total, booking) => {
          const bookingDate = new Date(booking.bookingDate);
          const bookingMonth = bookingDate.getMonth() + 1;
          const bookingYear = bookingDate.getFullYear();

          if (bookingMonth === currentMonth && bookingYear === currentYear) {
            return total + booking.totalPrice;
          } else {
            return total;
          }
        }, 0);

        setTotalRevenueCurrentMonth(totalRevenueThisMonth);
      } catch (error) {
        console.error("Error fetching booking data:", error);
      }
    };

    fetchUserData();
    fetchHotelsData();
    fetchBookingData();
  }, []);

  // Format totalRevenueCurrentMonth to VND currency
  const formattedRevenue = totalRevenueCurrentMonth.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  return (
    <div>
      <Row gutter={16}>
        <Col span={6}>
          <Card bordered={true} className="border-2">
            <Statistic
              title="Customers"
              value={customersCount}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={true} className="border-2">
            <Statistic
              title="Partners"
              value={partnersCount}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={true} className="border-2">
            <Statistic
              title="Hotels"
              value={hotelsCount}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={true} className="border-2">
            <Statistic
              title="Total Revenue (Month)"
              value={formattedRevenue}
              // prefix="$"
              precision={2}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
      </Row>

      <div className="mt-11 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <StatisticsRevenue />
        </div>
        <div>
          <HotelStatusDoughnutChart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
