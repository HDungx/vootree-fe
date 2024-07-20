import Navbar from "@/components/nav";
import React from "react";
import styles from "./style.module.css";
import SearchBar from "./components/searchBarHomePage";
import { Layout } from "antd";
export default function Layouts({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Layout>
        <header>
          <Navbar
            bg={styles.header}
            searchbar={<SearchBar />}
            logo="/logo_preview_rev_2.png"
          />
        </header>
        <div className="mt-44">{children}</div>
      </Layout>
    </>
  );
}
