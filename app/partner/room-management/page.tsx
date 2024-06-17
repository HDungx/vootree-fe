"use client";
import React, { useState } from "react";
import Forms_Room from "./components/form";
import Tables_Room from "./components/table";

export default function Page() {
  const [selectedRow, setSelectedRow] = useState<any | null>(null);

  const handleRowSelect = (row: any) => {
    setSelectedRow(row);
  };
  return (
    <div>
      <div className="mt-10">
        <Tables_Room onRowSelect={handleRowSelect}/>
      </div>
      <div className="mt-10 px-36">
        <Forms_Room selectedRow={selectedRow}/>
      </div>
    </div>
  );
}
