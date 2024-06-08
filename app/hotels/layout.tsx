import React from "react";
import styles from "./style.module.css";

import Navbar from "./components/nav";
import SearchBar from "./components/searchBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header>
        <Navbar bg={styles.header} searchbar="" logo="logo_preview_rev_1.png" />
      </header>
      <SearchBar />
      <div className="mt-10">{children}</div>
    </>
  );
}
