"use client";
import React, { useState } from "react";
import { Form, Input, Button, Steps, message } from "antd";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
const { Step } = Steps;
const url_deploy1 = "https://vootreeveevuu.up.railway.app";
const url_local = "http://localhost:8080";
const ForgotPass = () => {
  const [current, setCurrent] = useState(0);
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [emailValidated, setEmailValidated] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();

  const next = () => {
    form1
      .validateFields()
      .then((values) => {
        setEmail(values.email);
        axios
          .post(
            `${url_local}/api/password/forgot?email=${values.email}`
          )
          .then((response) => {
            message.success("Gửi OTP thành công");
            setEmailValidated(true);
            setCurrent(current + 1);
          })
          .catch((error) => {
            console.error("Gửi OTP thất bại:", error);
            message.error("Gửi OTP thất bại!");
          });
      })
      .catch((info) => {
        console.log("Xác nhận thất bại:", info);
      });
  };

  const onFinish = (values) => {
    const { newPassword, confirmPassword, otp } = values;
    axios
      .post(
        `${url_local}/api/password/reset?email=${email}&newPassword=${newPassword}&otp=${otp}`
      )
      .then((response) => {
        message.success("Đặt lại mật khẩu thành công!");
        router.push("/login");
        console.log("Mật khẩu mới:", newPassword);
      })
      .catch((error) => {
        console.error("Đặt lại mật khẩu thất bại:", error);
        message.error("Đặt lại mật khẩu thất bại!");
      });
  };

  const steps = [
    {
      title: "Nhập Email",
      content: (
        <Form
          form={form1}
          name="step1"
          layout="vertical"
          initialValues={{ email: "" }}
          className="space-y-6"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                type: "email",
                message: "Đầu vào không phải là E-mail hợp lệ!",
              },
              {
                required: true,
                message: "Vui lòng nhập E-mail của bạn!",
              },
            ]}
          >
            <Input className="rounded-md" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={next} className="w-full">
              Gửi OTP
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      title: "Đặt lại Mật khẩu",
      content: (
        <Form
          form={form2}
          name="step2"
          layout="vertical"
          onFinish={onFinish}
          className="space-y-6"
        >
          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu mới của bạn!",
              },
            ]}
            hasFeedback
          >
            <Input.Password className="rounded-md" size="large" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            dependencies={["newPassword"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Vui lòng xác nhận mật khẩu của bạn!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Hai mật khẩu bạn nhập không khớp!")
                  );
                },
              }),
            ]}
          >
            <Input.Password className="rounded-md" size="large" />
          </Form.Item>
          <Form.Item
            name="otp"
            label="OTP"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập OTP đã được gửi đến email của bạn!",
              },
            ]}
          >
            <Input className="rounded-md" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Đặt lại Mật khẩu
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ];

  const handleStepClick = (step) => {
    if (step === 1 && !emailValidated) {
      return;
    }
    setCurrent(step);
  };

  return (
    <>
      <div className="flex items-center bg-blue-900 w-full p-5 ">
        <Link href="/home">
          <Image
            src="/logo_preview_rev_2.png"
            width={170}
            height={50}
            alt="logo"
          />
        </Link>
      </div>
      <div
        className="min-h-screen flex flex-col justify-center items-center"
        style={{
          backgroundImage: "url('/static_images/background-dep-bai-bien.jpg')",
          // backgroundSize: "cover",
          // backgroundRepeat: "no-repeat",
          // backgroundPosition: "center",
        }}
      >
        <div className="w-full max-w-md p-8 space-y-8 rounded  bg-white shadow-md">
          <div className="text-center">
            <h2 className="text-2xl font-bold leading-9 tracking-tight text-gray-900 mb-6">
              Forgot Password
            </h2>
          </div>
          <Steps current={current} className="mb-6">
            {steps.map((item, index) => (
              <Step
                key={item.title}
                title={item.title}
                onClick={() => handleStepClick(index)}
              />
            ))}
          </Steps>
          <div>{steps[current].content}</div>
          <div className="text-center mt-4">
            <div className="text-sm">
              <Link
                href="/login"
                className="font-semibold text-sky-500 hover:text-indigo-500"
              >
                Back to login?
              </Link>
            </div>
            <div className="mt-2">
              <Link
                href="#"
                className="text-xs text-gray-600 hover:text-gray-800 mr-2"
              >
                Privacy Policy
              </Link>
              <span className="text-gray-400">•</span>
              <Link
                href="#"
                className="text-xs text-gray-600 hover:text-gray-800 ml-2"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPass;
