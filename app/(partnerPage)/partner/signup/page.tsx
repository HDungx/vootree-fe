"use client";
import React, { useState } from "react";
import logoPreview2 from "../../logo/logo-partner.png";
import {
  AutoComplete,
  Button,
  Cascader,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  DatePicker,
  message,
} from "antd";
import { GoogleOutlined, FacebookOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import axios from "axios";
import "tailwindcss/tailwind.css";
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 9,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 20,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 24,
      offset: 0,
    },
  },
};

const dateFormatList = ["DD/MM/YYYY", "DD-MM-YYYY"];

const SignupPartner = () => {
  const [form] = Form.useForm();
  const [roles, setRoles] = useState(["PARTNER"]);

  const onFinish = async (values) => {
    const newValues = { ...values, roles };
    console.log(newValues);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        newValues
      );

      console.log("Response:", response);
      if (response && response.status === 200) {
        message.success("Registration successful!");
        console.log("success");
      } else {
        const errorMessage =
          response?.data?.error || "An unknown error occurred";
        message.error(errorMessage);
        console.error(errorMessage);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Registration failed!";
      message.error(errorMessage);
      console.error(errorMessage);
    }
  };
  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{
          width: 70,
        }}
      >
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    </Form.Item>
  );

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center ">
      <div className="flex items-center bg-blue-500 w-full p-4">
        {/* <img className="h-40 w-auto" src={logoPreview2} alt="Your Company" /> */}
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center mt-10">
        <h2 className="text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Create your partner account
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full max-w-md ">
        <Form
          className="bg-white p-8 shadow-md rounded space-y-6 "
          {...formItemLayout}
          form={form}
          name="register"
          onFinish={onFinish}
          initialValues={{
            prefix: "86",
          }}
          style={{
            maxWidth: 600,
          }}
          scrollToFirstError
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[
              {
                required: true,
                message: "Please input your username",
              },
            ]}
          >
            <Input className="rounded-md" />
          </Form.Item>

          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
              {
                required: true,
                message: "Please input your E-mail!",
              },
            ]}
          >
            <Input className="rounded-md" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
            hasFeedback
          >
            <Input.Password className="rounded-md" size="large" />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The new password that you entered do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password className="rounded-md" size="large" />
          </Form.Item>
          <Form.Item
            name="dob"
            label="Date of birth"
            rules={[
              {
                required: true,
                message: "Please choose your birthday!",
              },
            ]}
          >
            <DatePicker
              format={dateFormatList}
              className="rounded-md"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[
              {
                required: true,
                message: "Please input your phone number!",
              },
            ]}
          >
            <Input
              // addonBefore={prefixSelector}
              className="rounded-md"
              style={{
                width: "100%",
              }}
            />
          </Form.Item>

          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(new Error("Should accept agreement")),
              },
            ]}
            {...tailFormItemLayout}
          >
            <Checkbox>
              I have read the <a href="">agreement</a>
            </Checkbox>
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            <Button
              type="primary"
              htmlType="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 
                        px-3 py-1.5 text-sm font-semibold leading-6 text-white 
                        shadow-sm hover:bg-indigo-500 focus-visible:outline 
                        focus-visible:outline-2 focus-visible:outline-offset-2 
                        focus-visible:outline-indigo-600"
            >
              Register
            </Button>
          </Form.Item>
          <div className="w-full">
            <div className="flex justify-center">
              <a
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                onClick={() => (window.location.href = "/")} // Chuyển trang khi nút được nhấp
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }} // Loại bỏ giao diện mặc định của button
              >
                Already have an account? Login
              </a>
            </div>
          </div>
          <div className="w-full text-center mt-4">
            <p className="text-xs text-gray-600 hover:text-gray-800 ml-2">
              or use one of these options
            </p>
            <div className="flex justify-center mt-2">
              <a
                href="#"
                className="text-sm font-medium text-gray-700 hover:text-gray-900 mr-4 flex items-center"
              >
                <GoogleOutlined className="mr-1" />
                Login with Google
              </a>
              <a
                href="#"
                className="text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center"
              >
                <FacebookOutlined className="mr-1" />
                Login with Facebook
              </a>
            </div>
            <div className="mt-2">
              <a
                href="#"
                className="text-xs text-gray-600 hover:text-gray-800 mr-2"
              >
                Privacy Policy
              </a>
              <span className="text-gray-400">•</span>
              <a
                href="#"
                className="text-xs text-gray-600 hover:text-gray-800 ml-2"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default SignupPartner;
