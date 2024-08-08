"use client";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { Bars3Icon, UserIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/legacy/image";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";

import { UserOutlined } from "@ant-design/icons";
import { Menu as AntMenu, Avatar, Dropdown, Space } from "antd";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { CustomJWT } from "@/utils/jwtCustom";

export default function Navbar({ searchbar, logo }) {
  const [username, setUsername] = useState<string>();
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodeToken = jwtDecode<CustomJWT>(token);
      if (decodeToken && decodeToken.roles[0] == "PARTNER") {
        const use = decodeToken.sub;
        setUsername(use);
      }
    }
  }, []);
  const handleLogOut = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };
  const menu = (
    <AntMenu>
      <AntMenu.Item key="0">
        <a href="/partner/profile">
          <a className=" font-semibold">Profile</a>
        </a>
      </AntMenu.Item>
      <AntMenu.Item key="1">
        <button
          type="button"
          onClick={handleLogOut}
          className="text-red-500 font-semibold"
        >
          Đăng Xuất
        </button>
      </AntMenu.Item>
    </AntMenu>
  );
  return (
    <header className="bg-sky-600">
      <Disclosure as="nav">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  {/* Mobile menu button*/}
                  <DisclosureButton className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:bg-opacity-85 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </DisclosureButton>
                </div>
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="flex flex-shrink-0 items-center">
                    <Link href="/partner/home">
                      <Image src={logo} width={150} height={45} alt="logo" />
                    </Link>
                  </div>
                  <div className="hidden sm:ml-6 sm:block pt-2 ">
                    <div className="flex space-x-4">
                      <Link
                        href="/partner/home"
                        className="text-white hover:bg-gray-700 hover:bg-opacity-55 rounded-md px-3 py-2 text-sm font-medium"
                      >
                        Trang chủ
                      </Link>
                      <Menu
                        as="div"
                        className="relative inline-block text-left"
                      >
                        <div>
                          <MenuButton className="inline-flex justify-center w-full rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-gray-700 hover:bg-opacity-55">
                            Quản lý chỗ nghỉ
                          </MenuButton>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <MenuItems className="origin-top-right absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                              <MenuItem>
                                {({ active }) => (
                                  <Link
                                    href="/partner/hotel-management"
                                    className={`${
                                      active
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-700"
                                    } block px-4 py-2 text-sm`}
                                  >
                                    Quản lý khách sạn
                                  </Link>
                                )}
                              </MenuItem>
                              <MenuItem>
                                {({ active }) => (
                                  <Link
                                    href="/partner/room-management"
                                    className={`${
                                      active
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-700"
                                    } block px-4 py-2 text-sm`}
                                  >
                                    Quản lý phòng
                                  </Link>
                                )}
                              </MenuItem>
                            </div>
                          </MenuItems>
                        </Transition>
                      </Menu>
                      <Link
                        href="/partner/statistics"
                        className="text-white hover:bg-gray-700 hover:bg-opacity-55 rounded-md px-3 py-2 text-sm font-medium"
                      >
                        Thống kê
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 ">
                  <div className="flex justify-center gap-1">
                    <div className="hidden sm:ml-6 sm:block ">
                      <div className="flex space-x-1"></div>
                    </div>
                    {username ? (
                      <div className="flex items-center ">
                        <Dropdown overlay={menu}>
                          <Space wrap>
                            <Avatar
                              icon={<UserOutlined />}
                              //name={username}
                              size={40}
                              //round={true}
                              className="cursor-pointer"
                              alt="User Avatar"
                            />
                            <span className="text-white text-sm font-medium mr-2">
                              {username}
                            </span>
                          </Space>
                        </Dropdown>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <Link href="/login/login">
                          <button
                            type="button"
                            className="hover:bg-purple-950 hover:bg-opacity-40 text-white me-4 py-2 px-2 rounded border flex text-sm"
                          >
                            <UserIcon className="h-5 w-5 mr-1" />
                            Đăng nhập
                          </button>
                        </Link>
                        <Link href="/login/signup">
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
                  {/* Profile dropdown */}
                </div>
              </div>
            </div>

            <DisclosurePanel className="sm:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2 text-left">
                <DisclosureButton className="text-left">
                  <Link
                    href="/home"
                    className="text-white hover:bg-gray-700 hover:bg-opacity-55 hover:text-white rounded-md px-3 py-2 text-sm font-medium block"
                  >
                    Trang chủ
                  </Link>
                  <Link
                    href="/hotels"
                    className="text-white hover:bg-gray-700 hover:bg-opacity-55 hover:text-white rounded-md px-3 py-2 text-sm font-medium block"
                  >
                    Danh sách khách sạn
                  </Link>
                  <Link
                    href="/home"
                    className="text-white hover:bg-gray-700 hover:bg-opacity-55 hover:text-white rounded-md px-3 py-2 text-sm font-medium block"
                  >
                    Hợp tác với chúng tôi
                  </Link>
                  <Link
                    href="/hotels"
                    className="text-white hover:bg-gray-700 hover:bg-opacity-55 hover:text-white rounded-md px-3 py-2 text-sm font-medium block"
                  >
                    Khách sạn đang đặt
                  </Link>
                </DisclosureButton>
              </div>
            </DisclosurePanel>
          </>
        )}
      </Disclosure>

      {searchbar}
    </header>
  );
}
