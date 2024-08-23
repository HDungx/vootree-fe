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
const url_deploy1 = "https://vootreeveevuu.up.railway.app";
const url_local = "http://localhost:8080";
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
        `${url_local}/api/auth/login`,
        values
      );
      localStorage.setItem("token", response.data.token);

      const decodeToken = jwtDecode(response.data.token);
      const tokenRole = decodeToken?.roles;
      if (tokenRole[0] == "STAFF") {
        router.push("/staff/dashboard");
      } 
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="flex items-center bg-blue-900  p-4">
        <Link href="/home">
          <Image
            src="/logo_preview_rev_2.png"
            width={200}
            height={60}
            alt="logo"
          />
        </Link>
      </div>
      <div
       className="flex min-h-screen flex-1 flex-col  p-10"
        style={{
          backgroundImage: "url('/static_images/background-dep-bai-bien.jpg')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <div className="mt-5 sm:mx-auto sm:w-full max-w-md rounded-md shadow-md  bg-white">
          <Form
            form={form}
            name="horizontal_login"
            layout="inline"
            onFinish={onFinish}
            className="bg-white p-10 shadow-md rounded space-y-5"
          >
            <h2 className="text-2xl font-extrabold m-auto text-blue-900">
              STAFF LOGIN FORM
            </h2>
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
                  size="large"
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
                  size="large"
                  prefix={<LockOutlined className="site-form-item-icon " />}
                  type="password"
                  placeholder="Password"
                  id="password"
                />
              </Form.Item>
            </div>

            <div className="w-full">
              <div className="flex items-center justify-center">
               
                <div className="text-sm">
                  <a
                    href="/forgot-pass"
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
                    size="large"
                    type="primary"
                    htmlType="submit"
                    // className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    className="flex w-full  justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    disabled={
                      !clientReady ||
                      !form.isFieldsTouched(true) ||
                      !!form
                        .getFieldsError()
                        .filter(({ errors }) => errors.length).length
                    }
                  >
                    <span className="text-lg">Log in</span>
                  </Button>
                )}
              </Form.Item>
            </div>

            
          </Form>
        </div>
      </div>
    </div>
  );
}
