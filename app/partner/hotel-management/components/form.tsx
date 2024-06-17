"use client";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Checkbox, Col, Form, Input, Row } from "antd";
import type { FormProps } from "antd";
import TextArea from "antd/es/input/TextArea";
import { message, Upload } from "antd";
import type { UploadProps } from "antd";
import { Select, Space } from "antd";
import { Rate } from "antd";
import { TimePicker } from "antd";
import dayjs from "dayjs";
import React, { useEffect } from "react";
const { Option } = Select;

type FieldType = {
  propertyName?: string;
  propertyType?: string;
  stars?: number;
  checkIn?: string;
  checkOut?: string;
  address?: number;
  description?: string;
  facility?: string;
  status?: string;
};

const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
  console.log("Success:", values);
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
const { Dragger } = Upload;

const props: UploadProps = {
  name: "file",
  multiple: true,
  action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
  onChange(info) {
    const { status } = info.file;
    if (status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log("Dropped files", e.dataTransfer.files);
  },
};

const onChange = (value: string) => {
  console.log(`selected ${value}`);
};

const onSearch = (value: string) => {
  console.log("search:", value);
};
const filterOption = (
  input: string,
  option?: { label: string; value: string }
) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

const handleChange = (value: string) => {
  console.log(`selected ${value}`);
};
const format = "HH:mm";

export default function Forms({ selectedRow }: { selectedRow: any }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (selectedRow) {
      form.setFieldsValue({
        propertyName: selectedRow.name,
        address: selectedRow.address,
        status: selectedRow.status,
        stars: selectedRow.hotelStars,
        checkIn: dayjs(selectedRow.checkInTime, "HH:mm"), // Chuyển đổi thành đối tượng dayjs hợp lệ
        checkOut: dayjs(selectedRow.checkOutTime, "HH:mm"),
        description: selectedRow.hotelDescription,
        propertyType: selectedRow.accommodationType,
        // Add other fields as needed
      });
    }
    console.log(selectedRow);
  }, [selectedRow]);

  return (
    <>
      <Row gutter={24} className=" border rounded-md">
        <Col span={12} className="">
          <Dragger {...props} className="h-full w-full">
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click image to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload. Strictly prohibited from
              uploading company data or other banned files.
            </p>
          </Dragger>
        </Col>
        <Col span={12} className="">
          <Form
            layout="vertical"
            name="basic"
            labelCol={{ span: 20 }}
            wrapperCol={{ span: 24 }}
            // initialValues={{ remember: true }}
            initialValues={{
              status: selectedRow?.status || "", // Ensure initial value is set correctly
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            form={form}
          >
            <div className="mt-5"></div>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item<FieldType>
                  label="Property name"
                  name="propertyName"
                  rules={[
                    {
                      required: true,
                      message: "Please input your property name !",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item<FieldType>
                  label="Property type"
                  name="propertyType"
                  rules={[
                    {
                      required: true,
                      message: "Please input your property type !",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Select a property"
                    optionFilterProp="children"
                    onChange={onChange}
                    onSearch={onSearch}
                    filterOption={filterOption}
                    options={[
                      {
                        value: "1",
                        label: "Hotel",
                      },
                      {
                        value: "lucy",
                        label: "Lucy",
                      },
                      {
                        value: "tom",
                        label: "Tom",
                      },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item<FieldType>
                  label="Stars"
                  name="stars"
                  rules={[
                    {
                      required: true,
                      message: "Please input your stars !",
                    },
                  ]}
                >
                  <Rate />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item<FieldType>
                  label="Check in time"
                  name="checkIn"
                  rules={[
                    {
                      required: true,
                      message: "Please input your check in time !",
                    },
                  ]}
                >
                  <TimePicker
                    defaultValue={dayjs("14:00", format)}
                    format={format}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item<FieldType>
                  label="Check out time"
                  name="checkOut"
                  rules={[
                    {
                      required: true,
                      message: "Please input your check out time !",
                    },
                  ]}
                >
                  <TimePicker
                    defaultValue={dayjs("12:30", format)}
                    format={format}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item<FieldType>
                  label="Address"
                  name="address"
                  rules={[
                    {
                      required: true,
                      message: "Please input your address hotel!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item label="Description" name="description">
                  <TextArea rows={4} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item<FieldType>
                  label=" Facility"
                  name="facility"
                  rules={[
                    {
                      required: true,
                      message: "Please input your hotel facility !",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item<FieldType>
                  label="Status"
                  name="status"
                  rules={[
                    {
                      required: true,
                      message: "Please input your status !",
                    },
                  ]}
                >
                  <Select style={{ width: 120 }} onChange={handleChange}>
                    <Option value="ACTIVE">Active</Option>
                    <Option value="PENDING">Pending</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <label className="text-red-500">
              *Warning: To update your property, status have to change to
              unavailable. And wait for the admin accept!
            </label>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className=" mt-5 float-end"
              >
                Update
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
}
