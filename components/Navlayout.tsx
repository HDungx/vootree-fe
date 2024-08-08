"use client";
import React from "react";

import { usePathname } from "next/navigation";
import Footer from "./footer";
import NavbarHome from "./nav";
import Navbar from "@/app/[locale]/(homepage)/hotels/components/nav";
import style from "./style.module.css";
import SearchBar from "@/app/[locale]/(homepage)/hotels/components/searchBar";
import SearchBarHome from "@/app/[locale]/(homepage)/home/components/searchBarHomePage";
const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const pathname = usePathname();
  const isHome = pathname === "/home" || pathname === "/en/home";
  return (
    <div className="page_wrapper">
      {isHome ? (
        <>
          <NavbarHome
            logo="/logo_preview_rev_2.png"
            bg={style.homeHeader}
            //    langswitcher={langswitcher}
          />
          {/* <div className="w-full">
            <SearchBarHome />
          </div> */}
        </>
      ) : (
        <Navbar
          bg={style.header}
          logo="/logo_preview_rev_1.png"
          //searchbar={<SearchBar />}
        />
      )}
      {children}
      <Footer />
    </div>
  );
};
export default Layout;
