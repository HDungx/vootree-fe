"use client";
import React, { useEffect, useState } from "react";
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
import {
  Avatar,
  Breadcrumb,
  Dropdown,
  Layout,
  Menu,
  Space,
  Spin,
  theme,
} from "antd";
import Bookings from "../components/Bookings";
import Dashboard from "../components/Dashboard";
import Profile from "../components/Profile";
import Customer from "../components/Customer";
import Partner from "../components/Partner";
import Hotels from "../components/Hotels";
import Hotelcensorship from "../components/Hotelcensorship";
import RoomUpdate from "../components/RoomUpdate";
import StatisticsHotel from "../components/StatisticsHotel";
import StatisticsRoom from "../components/StatisticsRoom";
import StatisticsRevenue from "../components/StatisticsRevenue";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserIcon } from "@heroicons/react/24/outline";
import HotelUpdate from "../components/HotelUpdate";
import withAuth from "@/components/withAuth";

const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const items = [
  getItem("Dashboard", "dashboard1", <AppstoreOutlined />),
  getItem("Profile", "profile1", <UserOutlined />),
  getItem("User management", "user1", <TeamOutlined />, [
    getItem("Customer", "customer1"),
    getItem("Partner", "partner1"),
  ]),
  getItem("Hotel management", "hotelmanagement1", <HomeOutlined />, [
    getItem("Hotels", "hotel1"),
    getItem("Bookings", "booking1"),
  ]),
  getItem("Censorship", "censorship1", <CheckSquareOutlined />, [
    getItem("Hotels censorship", "hotelcensorship1"),
    getItem("Rooms update", "roomupdate1"),
    getItem("Hotels update", "hotelupdate1"),
  ]),
  getItem("Statistics", "statistics1", <PieChartOutlined />, [
    getItem("Hotels", "hotelstatistics"),
    getItem("Rooms", "roomstatistics"),
    getItem("Revenue", "revenuetatistics"),
  ]),
];

const Sidebar2 = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false); // State to manage loading spinner

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [selectedKeys, setSelectedKeys] = useState(["dashboard1"]);
  const [breadcrumbItems, setBreadcrumbItems] = useState([
    { title: "Dashboard" },
  ]);

  const handleMenuClick = ({ key, keyPath }) => {
    setLoading(true); // Start loading when a menu item is clicked
    const itemPath = keyPath.reverse();
    const breadcrumbPath = itemPath.map((key) => {
      const item = findMenuItem(items, key);
      return { title: item.label };
    });
    setSelectedKeys(itemPath);

    setBreadcrumbItems(breadcrumbPath);

    // Simulate loading completion after 1 second (replace with actual data loading)
    setTimeout(() => {
      setLoading(false);
    }, 1000);
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
  const [loadingPage, setLoadingPage] = useState(true);
  useEffect(() => {
    // Simulate loading for 1 second
    const timer = setTimeout(() => {
      setLoadingPage(false);
    }, 1000);

    return () => clearTimeout(timer); // Clear the timer when the component unmounts
  }, []);

  const [username, setUsername] = useState();
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodeToken = jwtDecode(token);
      if (decodeToken && decodeToken.roles[0] == "STAFF") {
        const use = decodeToken.sub;
        setUsername(use);
      }
    }
  }, []);

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
      case "roomupdate1":
        return <RoomUpdate />;
      case "hotelupdate1":
        return <HotelUpdate />;
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
  const handleLogOut = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };
  const menu = (
    <Menu>
      <Menu.Item key="0">
        <Link href="/profile" prefetch>
          <Link href="/profile" prefetch className=" font-semibold">
            Profile
          </Link>
        </Link>
      </Menu.Item>
      <Menu.Item key="1">
        <button
          type="button"
          onClick={handleLogOut}
          className="text-red-500 font-semibold"
        >
          Đăng Xuất
        </button>
      </Menu.Item>
    </Menu>
  );
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {loadingPage ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <>
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
            >
              <div className="flex justify-between items-center">
                {username ? (
                  <div className="flex items-center justify-end w-full me-10">
                    <Dropdown overlay={menu}>
                      <Space wrap>
                        <Avatar
                          icon={<UserOutlined />}
                          name={username}
                          size="40"
                          round={true}
                          //className="cursor-pointer"
                          alt="User Avatar"
                        />
                        <span className="text-blue-900 text-base font-medium ">
                          {username}
                        </span>
                        {/* <DownOutlined /> */}
                      </Space>
                    </Dropdown>
                  </div>
                ) : (
                  <div className="flex justify-end items-center w-full">
                    <Link href="/login" prefetch>
                      <button
                        type="button"
                        className="hover:bg-purple-950 hover:bg-opacity-40 text-white me-4 py-2 px-2 rounded border flex text-sm"
                      >
                        <UserIcon className="h-5 w-5 mr-1" />
                        Đăng nhập
                      </button>
                    </Link>
                    <Link href="/signup" prefetch>
                      <button
                        type="button"
                        className="bg-sky-600 hover:bg-blue-700 hover:bg-opacity-40 font-bold text-white py-2 px-2 ps-4 pe-4 rounded flex text-sm"
                      >
                        Đăng ký
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </Header>

            <Content style={{ margin: "0 16px" }}>
              <Breadcrumb
                style={{ margin: "16px 0" }}
                items={breadcrumbItems}
              />

              <div
                style={{
                  padding: 24,
                  minHeight: 360,
                  background: colorBgContainer,
                  borderRadius: borderRadiusLG,
                }}
              >
                {loading ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <Spin size="large" />
                  </div>
                ) : (
                  renderContent()
                )}
              </div>
            </Content>

            <Footer style={{ textAlign: "center" }}>
              Vootreeveevuu Design ©{new Date().getFullYear()} Created by
              Vootree Team
            </Footer>
          </Layout>
        </>
      )}
    </Layout>
  );
};
export default Sidebar2;
