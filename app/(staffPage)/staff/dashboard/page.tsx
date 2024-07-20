"use client";
import React, { useState } from "react";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  HomeOutlined,
  CheckSquareOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import Bookings from "@/app/(staffPage)/staff/components/Bookings";
import Dashboard from "@/app/(staffPage)/staff/components/Dashboard";
import Profile from "@/app/(staffPage)/staff/components/Profile";
import Customer from "@/app/(staffPage)/staff/components/Customer";
import Partner from "@/app/(staffPage)/staff/components/Partner";
import Hotelcensorship from "@/app/(staffPage)/staff/components/Hotelcensorship";
import Hotels from "@/app/(staffPage)/staff/components/Hotels";

import StatisticsHotel from "@/app/(staffPage)/staff/components/StatisticsHotel";
import StatisticsRoom from "@/app/(staffPage)/staff/components/StatisticsRoom";
import StatisticsRevenue from "@/app/(staffPage)/staff/components/StatisticsRevenue";

const { Header, Content, Footer, Sider } = Layout;
// function getItem(label: any, key: any, icon: any, children: any) {
//   return {
//     key,
//     icon,
//     children,
//     label,
//   };
// }
const items = [
  { label: "Dashboard", key: "dashboard1", icon: <AppstoreOutlined /> },
  { label: "Profile", key: "profile1", icon: <UserOutlined /> },
  {
    label: "User management",
    key: "user1",
    icon: <TeamOutlined />,
    children: [
      { label: "Customer", key: "customer1" },
      { label: "Partner", key: "partner1" },
    ],
  },
  {
    label: "Hotel management",
    key: "hotelmanagement1",
    icon: <HomeOutlined />,
    children: [
      { label: "Hotels", key: "hotel1" },
      { label: "Bookings", key: "booking1" },
    ],
  },
  {
    label: "Hotel censorship",
    key: "hotelcensorship1",
    icon: <CheckSquareOutlined />,
  },
  {
    label: "Statistics",
    key: "statistics1",
    icon: <PieChartOutlined />,
    children: [
      { label: "Hotels", key: "hotelstatistics" },
      { label: "Rooms", key: "roomstatistics" },
      { label: "Revenue", key: "revenuetatistics" },
    ],
  },
];

const Sidebar2 = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [selectedKeys, setSelectedKeys] = useState(["dashboard1"]);
  const [breadcrumbItems, setBreadcrumbItems] = useState([
    { title: "Dashboard" },
  ]);

  // keyPath: Một mảng chứa các key của các mục menu từ mục con đến mục cha.
  // keyPath.reverse() đảo ngược mảng keyPath để có thứ tự từ mục cha đến mục con.

  const handleMenuClick = ({ key, keyPath }) => {
    const itemPath = keyPath.reverse();
    const breadcrumbPath = itemPath.map((key) => {
      const item = findMenuItem(items, key);
      return { title: item.label };
    });
    setSelectedKeys(itemPath);

    setBreadcrumbItems(breadcrumbPath);
  };

  const findMenuItem = (menuItems, key) => {
    for (const item of menuItems) {
      if (item.key === key) {
        return item;
      }
      if (item.children) {
        const found = findMenuItem(item.children, key);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };

  const renderContent = () => {
    switch (selectedKeys[selectedKeys.length - 1]) {
      case "dashboard1":
        return <Dashboard />;
      case "profile1":
        return <Profile />;
      case "customer1":
        return <Customer />;
      case "partner1":
        return <Partner />;
      case "hotel1":
        return <Hotels />;
      case "booking1":
        return <Bookings />;
      case "hotelcensorship1":
        return <Hotelcensorship />;
      case "hotelstatistics":
        return <StatisticsHotel />;
      case "roomstatistics":
        return <StatisticsRoom />;
      case "revenuetatistics":
        return <StatisticsRevenue />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        />

        <Content
          style={{
            margin: "0 16px",
          }}
        >
          <Breadcrumb style={{ margin: "16px 0" }} items={breadcrumbItems} />

          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {renderContent()}
          </div>
        </Content>

        <Footer
          style={{
            textAlign: "center",
          }}
        >
          Vootreeveevuu Design ©{new Date().getFullYear()} Created by Vootree
          Team
        </Footer>
      </Layout>
    </Layout>
  );
};
export default Sidebar2;
