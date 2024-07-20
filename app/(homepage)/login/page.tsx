"use client";
import { Button, Form, Input } from "antd";
import React, { useEffect, useState } from "react";
import {
  LockOutlined,
  UserOutlined,
  GoogleOutlined,
  FacebookOutlined,
} from "@ant-design/icons";
import Image from "next/legacy/image";
import Link from "next/link";
import axios from "axios";

import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
export default function Page() {
  const [form] = Form.useForm();
  const [clientReady, setClientReady] = useState(false);
  const router = useRouter();
  // To disable submit button at the beginning.
  useEffect(() => {
    setClientReady(true);
  }, []);
  const onFinish = async (values) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        values
      );
      localStorage.setItem("token", response.data.token);

      const decodeToken = jwtDecode(response.data.token);
      const tokenRole = decodeToken?.roles;
      if (tokenRole[0] == "PARTNER") {
        router.push("/partner/home");
      } else if (tokenRole[0] == "CUSTOMER") {
        const redirectToBooking = localStorage.getItem("bookingInfo");
        if (redirectToBooking) {
          localStorage.removeItem("bookingInfo");
          router.push(redirectToBooking);
        } else {
          router.push("/home");
        }
      }
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center ">
      <div className="flex items-center bg-blue-500 w-full p-4">
        <Link href="/home">
          <Image
            src="/logo_preview_rev_2.png"
            width={150}
            height={50}
            alt="logo"
          />
        </Link>
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center mt-10">
        <h2 className="text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full max-w-md">
        <Form
          form={form}
          name="horizontal_login"
          layout="inline"
          onFinish={onFinish}
          className="bg-white p-8 shadow-md rounded space-y-6"
        >
          <div className="w-full">
            <label
              htmlFor="username"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Username
            </label>
            <Form.Item
              name="username"
              className="mt-2"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
              ]}
            >
              <Input
                id="username"
                prefix={<UserOutlined className="site-form-item-icon  " />}
                placeholder="Username"
              />
            </Form.Item>
          </div>

          <div className="w-full">
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Password
            </label>

            <Form.Item
              className="mt-2 "
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon " />}
                type="password"
                placeholder="Password"
                id="password"
              />
            </Form.Item>
          </div>

          <div className="w-full">
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link
                  href="/signup"
                  className="font-semibold text-sky-500 hover:text-indigo-500"
                >
                  Create account?
                </Link>
              </div>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </a>
              </div>
            </div>
          </div>

          <div className="w-full">
            <Form.Item shouldUpdate>
              {() => (
                <Button
                  type="primary"
                  htmlType="submit"
                  // className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  disabled={
                    !clientReady ||
                    !form.isFieldsTouched(true) ||
                    !!form
                      .getFieldsError()
                      .filter(({ errors }) => errors.length).length
                  }
                >
                  Log in
                </Button>
              )}
            </Form.Item>
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
