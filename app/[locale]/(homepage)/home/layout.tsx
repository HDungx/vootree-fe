"use client";

import NavbarHome from "@/components/nav";
import { Layout, Spin } from "antd";
import React, { useEffect, useState } from "react";
import SearchBarHome from "./components/searchBarHomePage";
import styles from "./style.module.css";
import Footer from "@/components/footer";
export default function Layouts({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Giả lập loading trong 2 giây
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer); // Xóa timer khi component bị unmount
  }, []);

  return (
    <>
      <Layout>
        {loading ? (
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
            <header>
              {/* <NavbarHome bg={styles.header} logo="/logo_preview_rev_2.png" /> */}
              <div className="w-full">
                <SearchBarHome />
              </div>
            </header>
            <div className="mt-36">{children}</div>
            {/* <Footer /> */}
          </>
        )}
      </Layout>
    </>
  );
}
