"use client";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Checkbox, Col, Form, Input, InputNumber, Row } from "antd";
import type { FormProps } from "antd";
import TextArea from "antd/es/input/TextArea";
import { message, Upload } from "antd";
import type { UploadProps } from "antd";
import { Select, Space } from "antd";
import React, { useEffect } from "react";

const { Option } = Select;

type FieldType = {
  roomTypeName?: string;
  roomQuantity?: string;
  roomCapacity?: string;
  roomSize?: string;
  roomPrice?: number;
  description?: string;
  roomFacility?: string;
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

const handleChange = (value: string) => {
  console.log(`selected ${value}`);
};

export default function Forms_Room({ selectedRow }: { selectedRow: any }) {
  const [form] = Form.useForm();
  useEffect(() => {
    if (selectedRow) {
      form.setFieldsValue({
        roomTypeName: selectedRow.typeName,
        roomQuantity: selectedRow.quantity,
        roomCapacity: selectedRow.capacity,
        roomSize: selectedRow.roomSize,
        roomPrice: selectedRow.price,
        description: selectedRow.description,
      });
    }
    console.log(selectedRow);
  }, [selectedRow]);
  return (
    <>
      <Row gutter={24} className=" border rounded-md">
        <Col span={12} className="">
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click your image to this area to upload
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
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            form={form}
          >
            <div className="mt-5"></div>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item<FieldType>
                  label="Room type name"
                  name="roomTypeName"
                  rules={[
                    {
                      required: true,
                      message: "Please input your room name !",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item<FieldType>
                  label="Room quantity"
                  name="roomQuantity"
                  rules={[
                    {
                      required: true,
                      message: "Please input your room quantity !",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item<FieldType>
                  label="Room capacity"
                  name="roomCapacity"
                  rules={[
                    {
                      required: true,
                      message: "Please input your room capacity !",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item<FieldType>
                  label="Room size"
                  name="roomSize"
                  rules={[
                    {
                      required: true,
                      message: "Please input your room size !",
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
                  label="Room price"
                  name="roomPrice"
                  rules={[
                    {
                      required: true,
                      message: "Please input your room price !",
                    },
                  ]}
                >
                  <InputNumber
                    min={0}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                    }
                    addonAfter="VND"
                    style={{ width: "100%" }}
                  />
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
                  label="Room facility"
                  name="roomFacility"
                  rules={[
                    {
                      required: true,
                      message: "Please input your room facility !",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <label className="text-red-500">
              *Warning: To update your room, status have to change to
              unavailable. And wait for the admin accept!
            </label>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className=" mt-5 float-end"
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
}
