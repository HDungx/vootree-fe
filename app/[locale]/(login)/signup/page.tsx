"use client";
import {
  AutoComplete,
  Button,
  Cascader,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
} from "antd";
import { GoogleOutlined, FacebookOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/legacy/image";
import dayjs from "dayjs";
import axios from "axios";
import { useRouter } from "next/navigation";
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
const url_deploy1 = "https://vootreeveevuu.up.railway.app";
const url_local = "http://localhost:8080";
export default function Page() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [role, setRole] = useState("CUSTOMER");

  const onFinish = async (values) => {
    const newValues = { ...values, role };
    try {
      const response = await axios.post(
        `${url_local}/api/auth/register`,
        newValues
      );
      if (response.status === 200) {
        message.success("Đăng ký thành công!");
        router.push("/login");
      } else {
        message.error("Đăng ký thất bại!");
      }

      console.log(newValues);
    } catch (error) {
      console.error(error);
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
    <div
      className="flex min-h-full flex-1 flex-col justify-center "
      style={{
        backgroundImage: "url('/static_images/background-dep-bai-bien.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <div className="flex items-center bg-blue-900 w-full p-5">
        <Link href="/home">
          <Image
            src="/logo_preview_rev_2.png"
            width={160}
            height={50}
            alt="logo"
          />
        </Link>
      </div>
      <div className="mt-5 sm:mx-auto sm:w-full max-w-md rounded-md shadow-md  bg-white">
        <h2 className="text-2xl font-extrabold mt-5 text-center text-blue-900 ">
          Create your account
        </h2>
        <Form
          className="bg-white m-10 shadow-md rounded "
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
            <Input />
          </Form.Item>

          <Form.Item
            name="firstname"
            label="First Name"
            rules={[
              {
                required: true,
                message: "Please input your first name",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="lastname"
            label="Last Name"
            rules={[
              {
                required: true,
                message: "Please input your last name",
              },
            ]}
          >
            <Input />
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
            <Input />
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
            <Input.Password />
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
            <Input.Password />
          </Form.Item>
          {/* <Form.Item
            name="dob"
            label="Date of birth"
            rules={[
              {
                required: true,
                message: "Please choose your birthday!",
              },
            ]}
          >
            <DatePicker format={dateFormatList} />
          </Form.Item> */}
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
              addonBefore={prefixSelector}
              style={{
                width: "100%",
              }}
            />
          </Form.Item>

          {/* <Form.Item
            name="gender"
            label="Gender"
            rules={[
              {
                required: true,
                message: "Please select gender!",
              },
            ]}
          >
            <Select placeholder="select your gender">
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item> */}

          <Form.Item
            // name="agreement"
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
              <Link
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                href="/login"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }} // Loại bỏ giao diện mặc định của button
              >
                Already have an account? Login
              </Link>
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
}
