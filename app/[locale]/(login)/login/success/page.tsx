"use client";
import { CustomJWT } from "@/utils/jwtCustom";
import { Spin } from "antd";
import { jwtDecode } from "jwt-decode";
import React, { useEffect } from "react";

export default function LoginSuccess() {
  useEffect(() => {
    const urlParam = new URLSearchParams(window.location.search);
    const token = urlParam.get("token");
    if (token) {
      localStorage.setItem("token", token);
      const decode = jwtDecode<CustomJWT>(token);
      const role = decode.roles[0];
      if (role === "CUSTOMER") {
        window.location.href = "/home";
      } else if (role === "PARTNER") {
        window.location.href = "/partner/home";
      }
    }
  }, []);
  return (
    <div
      className="text-center justify-center items-center flex"
      style={{ height: "500px" }}
    >
      <div className="text-center justify-center items-center block">
        <Spin size="large" />
        <p className="text-lg">Đang chờ xử lý</p>
      </div>
    </div>
  );
}
