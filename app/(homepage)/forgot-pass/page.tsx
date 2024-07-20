"use client";
import React, { useState } from "react";
import { Form, Input, Button, Steps, message } from "antd";
import axios from "axios";
const { Step } = Steps;

const ForgotPass = () => {
  const [current, setCurrent] = useState(0);
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [emailValidated, setEmailValidated] = useState(false);
  const [email, setEmail] = useState(""); // State để lưu trữ email từ form1

  const next = () => {
    form1
      .validateFields()
      .then((values) => {
        setEmail(values.email);
        axios
          .post(
            `http://localhost:8080/api/password/forgot?email=${values.email}`
          )
          .then((response) => {
            message.success("Gửi OTP thành công");
            setEmailValidated(true); // Đánh dấu rằng email đã được xác nhận hợp lệ
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
        `http://localhost:8080/api/password/reset?email=${email}&newPassword=${newPassword}&otp=${otp}`
      )
      .then((response) => {
        message.success("Đặt lại mật khẩu thành công!");
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
          className="bg-white p-8 shadow-md rounded space-y-6 mt-6"
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
            <Button type="primary" onClick={next}>
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
          className="bg-white p-8 shadow-md rounded space-y-6 mt-6"
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
            <Button type="primary" htmlType="submit">
              Đặt lại Mật khẩu
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ];

  const handleStepClick = (step) => {
    // Kiểm tra nếu đang ở bước 1 và email chưa được xác nhận, không cho phép chuyển bước
    if (step === 1 && !emailValidated) {
      return;
    }
    setCurrent(step);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center mt-10">
        <h2 className="text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Forgot Password
        </h2>
      </div>
      <Steps current={current}>
        {steps.map((item, index) => (
          <Step
            key={item.title}
            title={item.title}
            onClick={() => handleStepClick(index)}
          />
        ))}
      </Steps>
      <div className="steps-content">{steps[current].content}</div>
      <div className="w-full text-center mt-4">
        <div className="text-sm">
          <a
            href="/"
            className="font-semibold text-sky-500 hover:text-indigo-500"
          >
            Back to login?
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
    </div>
  );
};

export default ForgotPass;
