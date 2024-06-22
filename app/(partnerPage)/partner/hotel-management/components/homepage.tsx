"use client";
import React, { useState } from "react";

import Forms from "./form";
import Tables from "./table";
import { Button, Col, Row } from "antd";
import Link from "next/link";
import { PlusOutlined } from "@ant-design/icons";

export default function Homepage() {
  const [selectedRow, setSelectedRow] = useState<any | null>(null);

  const handleRowSelect = (row: any) => {
    setSelectedRow(row);
  };

  return (
    <div className="p-20">
      <div>
        <Row>
          <Col span={12}>
            <span className="font-bold text-2xl">Trang quản lý khách sạn</span>
          </Col>
          <Col span={12} className="text-end">
            <Link href="/partner/hotel-create">
              <Button
                type="primary"
                size="large"
                className="w-56 h-12 text-lg font-bold shadow-lg"
                icon={
                  <PlusOutlined
                    style={{ fontSize: "25px", fontWeight: "bold" }}
                  />
                }
                iconPosition="end"
              >
                Đăng ký khách sạn
              </Button>
            </Link>
          </Col>
        </Row>
      </div>
      <div className="mt-10">
        <Tables onRowSelect={handleRowSelect} />
      </div>
      <div className="mt-10 px-36">
        <Forms selectedRow={selectedRow} />
      </div>
    </div>
  );
}
