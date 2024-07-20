import React, { useState } from "react";
import { Row, Col, Card, Statistic } from "antd";
import { Bar } from "react-chartjs-2";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import StatisticsRevenue from "./StatisticsRevenue";
import HotelStatusDoughnutChart from "./HotelStatusDoughnutChart";



const Dashboard = () => {
  // Giả sử các số liệu đã có từ API hoặc được tính toán
  const usersCount = 1500;
  const partnersCount = 30;
  const hotelsCount = 50;
  const totalRevenue = 25000000; // Đơn vị tiền tệ, ví dụ 25,000,000 VNĐ


  return (
    <div>
      <Row gutter={16}>
        <Col span={6}>
          <Card bordered={true} className="border-2">
            <Statistic
              title="Users"
              value={usersCount}
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
              value={totalRevenue}
              prefix="$"
              precision={2}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
      </Row>

      <div className="mt-11 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div><StatisticsRevenue /></div>
        <div><HotelStatusDoughnutChart /></div>
      </div>
    </div>
  );
};
export default Dashboard;
