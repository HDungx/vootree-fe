import React from "react";
import styles from "./style.module.css";

import Navbar from "../hotels/components/nav";
import SearchBar from "../hotels/components/searchBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header>
        <Navbar
          bg={styles.header}
          searchbar=""
          logo="/logo_preview_rev_1.png"
        />
      </header>

      <div className="">{children}</div>
    </>
  );
}
