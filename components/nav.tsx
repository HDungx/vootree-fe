"use client";

import { UserOutlined } from "@ant-design/icons";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Bars3Icon, UserIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Avatar, Menu } from "antd";
import { jwtDecode } from "jwt-decode";
import Image from "next/legacy/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Space } from "antd";
import LanguageSwitcher from "./language-switcher";
import { useTranslations } from "next-intl";
import SearchBarHome from "@/app/[locale]/(homepage)/home/components/searchBarHomePage";

export default function NavbarHome({ logo, bg }) {
  const [username, setUsername] = useState();
  const router = useRouter();
  const t = useTranslations();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodeToken = jwtDecode(token);
      if (decodeToken && decodeToken.roles[0] == "CUSTOMER") {
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
    <header className={bg}>
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
                    <Link href="/home" prefetch>
                      <Image src={logo} width={150} height={50} alt="logo" />
                    </Link>
                  </div>
                  <div className="hidden sm:ml-6 sm:block pt-2 ">
                    <div className="flex space-x-4">
                      <Link
                        prefetch
                        href="/home"
                        className="text-white hover:bg-gray-700 hover:bg-opacity-55  rounded-md px-3 py-2 text-sm font-medium"
                      >
                        {t("nav.home")}
                      </Link>
                      {/* <Link
                        href="/hotels"
                        className="text-white hover:bg-gray-700 hover:bg-opacity-55 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                      >
                        Danh sách khách sạn
                      </Link> */}
                    </div>
                  </div>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 ">
                  <div className="flex justify-center gap-1">
                    <div className="hidden sm:ml-6 sm:block ">
                      <div className="flex space-x-1">
                        <LanguageSwitcher />
                        <Link
                          prefetch
                          href="/partner/signup"
                          className="text-white hover:bg-gray-700 hover:bg-opacity-55 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                        >
                          {t("nav.partner")}
                        </Link>
                        <Link
                          prefetch
                          href="/profile?tab=myBooking"
                          className="text-white hover:bg-gray-700 hover:bg-opacity-55 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                        >
                          {t("nav.booking")}
                        </Link>
                      </div>
                    </div>

                    {username ? (
                      <div className="flex items-center ">
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
                            <span className="text-white text-sm font-medium mr-2">
                              {username}
                            </span>

                            {/* <DownOutlined /> */}
                          </Space>
                        </Dropdown>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <Link href="/login" prefetch>
                          <button
                            type="button"
                            className=" hover:bg-purple-950 hover:bg-opacity-40 text-white me-4   py-2 px-2 rounded border flex text-sm"
                          >
                            <UserIcon className="h-5 w-5   mr-1" />
                            {t("nav.login")}
                          </button>
                        </Link>
                        <Link href="/signup" prefetch>
                          <button
                            type="button"
                            className="bg-sky-600 hover:bg-blue-700 hover:bg-opacity-40 font-bold text-white  py-2 px-2 ps-4 pe-4 rounded flex text-sm"
                          >
                            {t("nav.signUp")}
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
                  {/* <Link
                    href="/hotels"
                    className="text-white hover:bg-gray-700 hover:bg-opacity-55 hover:text-white rounded-md px-3 py-2 text-sm font-medium block"
                  >
                    Danh sách khách sạn
                  </Link> */}
                  <Link
                    href="/profile?tab=myBooking"
                    className="text-white hover:bg-gray-700 hover:bg-opacity-55 hover:text-white rounded-md px-3 py-2 text-sm font-medium block"
                  >
                    Hợp tác với chúng tôi
                  </Link>
                  {/* <Link
                    href="/hotels"
                    className="text-white hover:bg-gray-700 hover:bg-opacity-55 hover:text-white rounded-md px-3 py-2 text-sm font-medium block"
                  >
                    Khách sạn đang đặt
                  </Link> */}
                </DisclosureButton>
              </div>
            </DisclosurePanel>
          </>
        )}
      </Disclosure>

      {/* <div className="text-3xl items-center justify-center flex mt-6 font-bold text-white">
        <h1 className="items-center">
          From Southeast Asia to the World, All Yours.
        </h1>
      </div>
      <hr className="max-w-4xl mx-auto justify-center mt-4 border" /> */}
      {/* <div className="max-w-3xl h-56 bg-white mx-auto mt-6 border border-gray-400 rounded-lg ">
        
      <SearchBarHome />
      </div> */}
    </header>
  );
}
