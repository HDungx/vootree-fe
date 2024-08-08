import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  message,
  Tabs,
  Flex,
  Upload,
  Space,
} from "antd";

import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import { jwtDecode } from "jwt-decode";
import Image from "next/legacy/image";
import { CustomJWT } from "@/utils/jwtCustom";
const { Option } = Select;
const { TabPane } = Tabs;

// upload avatar
const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};
const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};
interface UserInfo {
  username: string;
  email: string;
  phoneNum: string;
  firstName: string;
  lastName: string;
  dayOfBirth: any;
  gender: string;
}
const MyProfile = () => {
  const [form] = Form.useForm();
  const [emailForm] = Form.useForm();
  const [phoneForm] = Form.useForm();
  const [initialValues, setInitialValues] = useState<UserInfo>();
  const [tokenKey, setTokenKey] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = jwtDecode<CustomJWT>(token);

      setTokenKey(decodedToken.id);
      console.log(decodedToken.id);
    }
  }, []);

  useEffect(() => {
    if (tokenKey) {
      // Lấy dữ liệu từ API cho username
      const fetchBasicInfo = axios.get(
        `http://localhost:8080/api/accounts/${tokenKey}`
      ); // Điều chỉnh URL thành endpoint API thực tế của bạn

      // Lấy dữ liệu từ API cho các thuộc tính còn lại
      const fetchProfile = axios.get(
        `http://localhost:8080/api/users/${tokenKey}`
      ); // Điều chỉnh URL thành endpoint API thực tế của bạn

      // Kết hợp dữ liệu từ hai API
      Promise.all([fetchBasicInfo, fetchProfile])
        .then(([basicInfoResponse, profileResponse]) => {
          const basicInfo = basicInfoResponse.data;
          const profile = profileResponse.data;

          // Định dạng dữ liệu cho biểu mẫu
          setInitialValues({
            username: basicInfo.username,
            email: basicInfo.email,
            phoneNum: basicInfo.phoneNum,
            firstName: profile.firstName,
            lastName: profile.lastName,
            dayOfBirth: profile.dob ? moment(profile.dob) : null,
            gender: profile.gender,
          });

          // Đặt giá trị cho biểu mẫu
          form.setFieldsValue({
            username: basicInfo.username,
            email: basicInfo.email,
            phoneNum: basicInfo.phoneNum,
            firstName: profile.firstName,
            lastName: profile.lastName,
            dayOfBirth: profile.dob ? moment(profile.dob) : null,
            gender: profile.gender,
          });
        })
        .catch((error) => {
          console.error("Có lỗi xảy ra khi lấy dữ liệu hồ sơ!", error);
        });
    }
  }, [form, tokenKey]);

  const onFinish = (values) => {
    // Chỉ lấy các trường cần cập nhật
    const updatedData = {
      firstName: values.firstName,
      lastName: values.lastName,
      dob: values.dayOfBirth ? values.dayOfBirth.format("YYYY-MM-DD") : null,
      gender: values.gender,
    };
    console.log(updatedData);
    // Gửi dữ liệu đến API
    axios
      .put(`http://localhost:8080/api/users/update/${tokenKey}`, updatedData) // Điều chỉnh URL thành endpoint API thực tế của bạn
      .then((response) => {
        message.success("Thông tin đã được cập nhật thành công!");
      })
      .catch((error) => {
        console.error("Có lỗi xảy ra khi cập nhật thông tin!", error);
        message.error("Cập nhật thông tin thất bại!");
      });
  };

  const onEmailFinish = (values) => {
    const currentEmail = emailForm.getFieldValue("currentEmail");
    const newEmail = emailForm.getFieldValue("newEmail");

    const otp = emailForm.getFieldValue("otp");
    // Gửi yêu cầu cập nhật email
    axios
      .post(
        `http://localhost:8080/api/email/verify?curEmail=${currentEmail}&newEmail=${newEmail}&otp=${otp}`
      ) // Điều chỉnh URL thành endpoint API thực tế của bạn
      .then((response) => {
        message.success("Email đã được cập nhật thành công!");
      })
      .catch((error) => {
        console.error("Có lỗi xảy ra khi cập nhật email!", error);
        message.error("Cập nhật email thất bại!");
      });
  };

  const sendOTP = () => {
    // Lấy giá trị của cả ô Current Email và New Email
    const currentEmail = emailForm.getFieldValue("currentEmail");
    const newEmail = emailForm.getFieldValue("newEmail");

    // Kiểm tra xem cả hai giá trị đều đã được nhập vào
    if (!currentEmail || !newEmail) {
      message.error("Please enter both Current Email and New Email");
      return; // Ngăn chặn việc gửi yêu cầu nếu thiếu dữ liệu
    }

    console.log({
      curEmail: currentEmail,
      newEmail: newEmail,
    });

    // Gửi yêu cầu OTP với cả Current Email và New Email
    axios
      .post(
        `http://localhost:8080/api/email/change-request?curEmail=${currentEmail}&newEmail=${newEmail}`
      )
      .then((response) => {
        message.success("OTP đã được gửi thành công!");
      })
      .catch((error) => {
        console.error("Có lỗi xảy ra khi gửi OTP!", error);
        message.error("Gửi OTP thất bại!");
      });
  };

  const onPhoneFinish = (values) => {
    const currentEmail = phoneForm.getFieldValue("currentEmail");
    const newPhone = phoneForm.getFieldValue("newPhone");
    const otp = phoneForm.getFieldValue("otp");
    // Gửi yêu cầu cập nhật email
    axios
      .post(
        `http://localhost:8080/api/phone/verify?email=${currentEmail}&newPhoneNum=${newPhone}&otp=${otp}`
      ) // Điều chỉnh URL thành endpoint API thực tế của bạn
      .then((response) => {
        message.success("Email đã được cập nhật thành công!");
      })
      .catch((error) => {
        console.error("Có lỗi xảy ra khi cập nhật email!", error);
        message.error("Cập nhật email thất bại!");
      });
  };

  const sendPhoneOTP = () => {
    // Lấy giá trị của cả ô Current Email và New Email
    const currentEmail = phoneForm.getFieldValue("currentEmail");
    const currentPhone = phoneForm.getFieldValue("currentPhone");
    const newPhone = phoneForm.getFieldValue("newPhone");

    // Kiểm tra xem cả hai giá trị đều đã được nhập vào
    if (!currentPhone || !newPhone) {
      message.error("Please enter both Current Phone and New Phone");
      return; // Ngăn chặn việc gửi yêu cầu nếu thiếu dữ liệu
    }

    console.log({
      currentPhone: currentPhone,
      newPhone: newPhone,
    });

    // Gửi yêu cầu OTP với cả Current Email và New Email

    axios
      .post(
        `http://localhost:8080/api/phone/change-request?email=${currentEmail}&curPhoneNum=${currentPhone}&newPhoneNum=${newPhone}`
      )
      .then((response) => {
        message.success("OTP đã được gửi thành công!");
      })
      .catch((error) => {
        console.error("Có lỗi xảy ra khi gửi OTP!", error);
        message.error("Gửi OTP thất bại!");
      });
  };

  // xu ly hinh
  const [loading, setLoading] = useState(false);

  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (tokenKey) {
      setImageUrl(`http://localhost:8080/api/accounts/${tokenKey}/avatar`);
    }
  }, [tokenKey]);

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  return (
    <div className="flex justify-center items-center  min-h-fit min-w-fit ">
      <div className="p-8 bg-white rounded-lg shadow-lg w-full max-w-4xl">
        <Tabs defaultActiveKey="1">
          <TabPane tab="Personal Information" key="1">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">
              Personal Information
            </h2>
            <p className="text-sm mb-6 text-gray-600">
              Use a permanent address where you can receive mail.
            </p>

            {/* hinh anh */}

            <Flex className="mb-11" gap="middle" wrap>
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action={`http://localhost:8080/api/accounts/${tokenKey}/avatar`}
                beforeUpload={beforeUpload}
                onChange={handleChange}
              >
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt="avatar"
                    height={100}
                    width={100}
                    // style={{
                    //   width: "100%",
                    // }}
                  />
                ) : (
                  uploadButton
                )}
              </Upload>
            </Flex>

            <Form
              layout="vertical"
              form={form}
              initialValues={initialValues}
              onFinish={onFinish}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Form.Item
                  label="Username"
                  name="username"
                  rules={[
                    { required: true, message: "Please enter your username" },
                  ]}
                >
                  <Input
                    className="rounded-md"
                    placeholder="Username"
                    disabled
                  />
                </Form.Item>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Form.Item
                  label="First name"
                  name="firstName"
                  rules={[{ message: "Please enter your first name" }]}
                >
                  <Input className="rounded-md" placeholder="First name" />
                </Form.Item>
                <Form.Item
                  label="Last name"
                  name="lastName"
                  rules={[{ message: "Please enter your last name" }]}
                >
                  <Input className="rounded-md" placeholder="Last name" />
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Form.Item
                  label="Day of Birth"
                  name="dayOfBirth"
                  rules={[
                    {
                      required: true,
                      message: "Please select your date of birth",
                    },
                  ]}
                >
                  <DatePicker
                    size="large"
                    className="rounded-md w-full"
                    placeholder="Select date"
                  />
                </Form.Item>
                <Form.Item
                  label="Gender"
                  name="gender"
                  rules={[{ message: "Please select your gender" }]}
                >
                  <Select
                    size="large"
                    className="rounded-md"
                    placeholder="Select Gender"
                  >
                    <Option value="MALE">MALE</Option>
                    <Option value="FEMALE">FEMALE</Option>
                    <Option value="OTHER">OTHER</Option>
                  </Select>
                </Form.Item>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Form.Item
                  label="Email address"
                  name="email"
                  rules={[
                    {
                      required: true,
                      type: "email",
                      message: "Please enter a valid email",
                    },
                  ]}
                >
                  <Input
                    className="rounded-md"
                    placeholder="Email address"
                    disabled
                  />
                </Form.Item>
                <Form.Item
                  label="Phone Number"
                  name="phoneNum"
                  rules={[{ message: "Please enter your phone number" }]}
                >
                  <Input
                    className="rounded-md"
                    placeholder="Phone Number"
                    disabled
                  />
                </Form.Item>
              </div>

              <div className="flex justify-end mt-6">
                <Button type="default" className="mr-4">
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </div>
            </Form>
          </TabPane>

          <TabPane tab="Change Email" key="2">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">
              Change Email
            </h2>
            <Form layout="vertical" form={emailForm} onFinish={onEmailFinish}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Form.Item
                  label="Current Email"
                  name="currentEmail"
                  rules={[
                    {
                      required: true,
                      type: "email",
                      message: "Please enter your current email",
                    },
                  ]}
                >
                  <Input className="rounded-md" placeholder="Current Email" />
                </Form.Item>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Form.Item
                  label="New Email"
                  name="newEmail"
                  rules={[
                    {
                      required: true,
                      type: "email",
                      message: "Please enter your new email",
                    },
                  ]}
                >
                  <Input className="rounded-md" placeholder="New Email" />
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Form.Item
                  label="OTP"
                  name="otp"
                  rules={[{ required: true, message: "Please enter the OTP" }]}
                >
                  <Input className="rounded-md" placeholder="OTP" />
                </Form.Item>
              </div>

              <div className="flex justify-end mt-6">
                <Button type="default" className="mr-4" onClick={sendOTP}>
                  Send OTP
                </Button>
                <Button type="primary" onClick={onEmailFinish}>
                  Change Email
                </Button>
              </div>
            </Form>
          </TabPane>

          <TabPane tab="Change Phone Number" key="3">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">
              Change Phone Number
            </h2>
            <Form layout="vertical" form={phoneForm} onFinish={onPhoneFinish}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Form.Item
                  label="Current Email"
                  name="currentEmail"
                  rules={[
                    {
                      required: true,
                      type: "email",
                      message: "Please enter your current email",
                    },
                  ]}
                >
                  <Input className="rounded-md" placeholder="Current Email" />
                </Form.Item>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Form.Item
                  label="Current Phone Number"
                  name="currentPhone"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your current phone number",
                    },
                  ]}
                >
                  <Input
                    className="rounded-md"
                    placeholder="Current Phone Number"
                  />
                </Form.Item>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Form.Item
                  label="New Phone Number"
                  name="newPhone"
                  rules={[
                    {
                      required: true,

                      message: "Please enter your new phone number",
                    },
                  ]}
                >
                  <Input
                    className="rounded-md"
                    placeholder="New Phone Number"
                  />
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Form.Item
                  label="OTP"
                  name="otp"
                  rules={[{ required: true, message: "Please enter the OTP" }]}
                >
                  <Input className="rounded-md" placeholder="OTP" />
                </Form.Item>
              </div>

              <div className="flex justify-end mt-6">
                <Button type="default" className="mr-4" onClick={sendPhoneOTP}>
                  Send OTP
                </Button>
                <Button type="primary" onClick={onPhoneFinish}>
                  Change Phone Number
                </Button>
              </div>
            </Form>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default MyProfile;
