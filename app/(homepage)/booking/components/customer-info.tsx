import { Col, Row } from "antd";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";

export default function CustomerInfo() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decode = jwtDecode(token);
      const userId = decode?.user_id;
      const phoneNum = decode?.phoneNum;
      const email = decode?.email;
      const fetchAPI = async () => {
        const response = await axios.get(
          `http://localhost:8080/api/users/${userId}`
        );
        const data = response.data;
        const firstName = data.firstName;
        const lastName = data.lastName;
        const fullName = firstName + " " + lastName;
        setFullName(fullName);
      };
      fetchAPI();
      setEmail(email);
      setPhoneNum(phoneNum);
    }
  }, []);

  return (
    <>
      <strong className="text-lg">
        Chi tiết liên hệ (cho Vé điện tử/Phiếu xác nhận)
      </strong>
      <div className="rounded-sm shadow-sm border h-36 w-full p-5 mt-2">
        <div>
          <Row className="text-lg">
            <Col span={5} className="text-lg">
              Họ và tên:
            </Col>
            <Col className="text-lg">
              <span className="font-semibold">{fullName}</span>
            </Col>
          </Row>
        </div>
        <div className=" mt-4">
          <Row>
            <Col span={5} className="text-lg">
              Số điện thoại:
            </Col>
            <Col className="text-lg">
              <span className="font-semibold">{phoneNum}</span>
            </Col>
          </Row>
        </div>
        <div className="   mt-4">
          <Row>
            <Col span={5} className="text-lg">
              Email:
            </Col>
            <Col className="text-lg">
              <span className="font-semibold">{email}</span>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
}
