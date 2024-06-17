"use client";
import React, { useState } from "react";
import Tables from "./table";
import Forms from "./form";

export default function Homepage() {
  const [selectedRow, setSelectedRow] = useState<any | null>(null);

  const handleRowSelect = (row: any) => {
    setSelectedRow(row);
  };

  return (
    <div>
      <div className="mt-10">
        <Tables onRowSelect={handleRowSelect} />
      </div>
      <div className="mt-10 px-36">
        <Forms selectedRow={selectedRow} />
      </div>
      <footer className=" mt-5 justify-center flex"> @Made by DaoHehe</footer>
    </div>
  );
}
