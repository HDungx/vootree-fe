import React, { useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";

import axios from "axios";
import "tailwindcss/tailwind.css";
import { jwtDecode } from "jwt-decode";
import { CustomJWT } from "@/utils/jwtCustom";
const url_deploy1 = "https://vootreeveevuu.up.railway.app";
const url_local = "http://localhost:8080";
export default function NewPass() {
  const [tokenKey, setTokenKey] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode<CustomJWT>(token);
      setTokenKey(decodedToken.id);
    }
  }, []);

  const onFinish = (values) => {
    axios
      .put(`${url_local}/api/accounts/${tokenKey}/change-pass`, {
        oldPassword: values.currentPassword,
        newPassword: values.newPassword,
        confPassword: values.confirmPassword,
      })
      .then((response) => {
        message.success("Succeed to change password"); // Hiển thị thông điệp thành công từ phản hồi của API
        // Xử lý các công việc khác sau khi thành công nếu cần
      })
      .catch((error) => {
        message.error(error.response.data.message);
        // Xử lý lỗi khi không thể thay đổi mật khẩu
        console.error("Error:", error.response.data.message);
      });
  };

  return (
    <div className="flex justify-center items-center  min-h-fit min-w-fit ">
      <div className="p-8 bg-white rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">
          Change Password
        </h2>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Current Password"
            name="currentPassword"
            rules={[
              { required: true, message: "Please enter your current password" },
            ]}
          >
            <Input.Password
              className="rounded-md"
              placeholder="Current Password"
            />
          </Form.Item>
          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              { required: true, message: "Please enter your new password" },
            ]}
          >
            <Input.Password className="rounded-md" placeholder="New Password" />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            rules={[
              { required: true, message: "Please confirm your new password" },
            ]}
          >
            <Input.Password
              className="rounded-md"
              placeholder="Confirm Password"
            />
          </Form.Item>
          <div className="flex justify-end mt-6">
            <Button type="default" className="mr-4">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Change Password
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
