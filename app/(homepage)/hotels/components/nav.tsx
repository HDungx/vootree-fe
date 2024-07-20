"use client";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Bars3Icon, UserIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/legacy/image";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar({ bg, searchbar, logo }) {
  const [usename, setUsername] = useState();
  const router = useRouter();
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
  return (
    <header className={bg}>
      <Disclosure as="nav">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  {/* Mobile menu button*/}
                  <DisclosureButton className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:bg-opacity-85 hover:  focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
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
                    <a href="/home">
                      <Image src={logo} width={150} height={50} alt="logo" />
                    </a>
                  </div>
                  <div className="hidden sm:ml-6 sm:block pt-2 ">
                    <div className="flex space-x-4">
                      <Link
                        href="/home"
                        className="  hover:bg-gray-700 hover:bg-opacity-55  rounded-md px-3 py-2 text-sm font-medium"
                      >
                        Trang chủ
                      </Link>
                      {/* <Link
                        href="/hotels"
                        className="  hover:bg-gray-700 hover:bg-opacity-55 hover:  rounded-md px-3 py-2 text-sm font-medium"
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
                        <Link
                          href="/home"
                          className="  hover:bg-gray-700 hover:bg-opacity-55 hover:  rounded-md px-3 py-2 text-sm font-medium"
                        >
                          Hợp tác với chúng tôi
                        </Link>
                        <Link
                          href="/booking"
                          className="  hover:bg-gray-700 hover:bg-opacity-55 hover:  rounded-md px-3 py-2 text-sm font-medium"
                        >
                          Khách sạn đang đặt
                        </Link>
                      </div>
                    </div>
                    {usename ? (
                      <div className="flex items-center">
                        <p className="  text-sm font-medium">
                          Xin chào, {usename}
                        </p>

                        <button
                          type="button"
                          onClick={handleLogOut}
                          className="bg-orange-700 hover:bg-orange-400  text-white ms-4   py-2 px-2 rounded flex text-sm"
                        >
                          Đăng Xuất
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <Link href="/login">
                          <button
                            type="button"
                            className=" hover:bg-purple-950 hover:bg-opacity-40 me-4 py-2 px-2 rounded border flex text-sm"
                          >
                            <UserIcon className="h-5 w-5   mr-1" />
                            Đăng nhập
                          </button>
                        </Link>
                        <Link href="/signup">
                          <button
                            type="button"
                            className="bg-sky-600 hover:bg-blue-700 hover:bg-opacity-40 font-bold text-white  py-2 px-2 ps-4 pe-4 rounded flex text-sm"
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
                    className="  hover:bg-gray-700 hover:bg-opacity-55 hover:  rounded-md px-3 py-2 text-sm font-medium block"
                  >
                    Trang chủ
                  </Link>
                  <Link
                    href="/hotels"
                    className="  hover:bg-gray-700 hover:bg-opacity-55 hover:  rounded-md px-3 py-2 text-sm font-medium block"
                  >
                    Danh sách khách sạn
                  </Link>
                  <Link
                    href="/home"
                    className="  hover:bg-gray-700 hover:bg-opacity-55 hover:  rounded-md px-3 py-2 text-sm font-medium block"
                  >
                    Hợp tác với chúng tôi
                  </Link>
                  <Link
                    href="/hotels"
                    className="  hover:bg-gray-700 hover:bg-opacity-55 hover:  rounded-md px-3 py-2 text-sm font-medium block"
                  >
                    Khách sạn đang đặt
                  </Link>
                </DisclosureButton>
              </div>
            </DisclosurePanel>
          </>
        )}
      </Disclosure>

      {/* <div className="text-3xl items-center justify-center flex mt-6 font-bold  ">
        <h1 className="items-center">
          From Southeast Asia to the World, All Yours.
        </h1>
      </div>
      <hr className="max-w-4xl mx-auto justify-center mt-4 border" /> */}
      {/* <div className="max-w-3xl h-56 bg-white mx-auto mt-6 border border-gray-400 rounded-lg ">
        <SearchBar />
      </div> */}
      {searchbar}
      {/* <SearchBar /> */}
    </header>
  );
}
