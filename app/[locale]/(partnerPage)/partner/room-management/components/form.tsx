"use client";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Checkbox, Col, Form, Input, InputNumber, Row } from "antd";
import type { FormProps } from "antd";
import TextArea from "antd/es/input/TextArea";
import { message, Upload } from "antd";
import type { UploadProps } from "antd";
import { Select, Space } from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";
import type { UploadFile } from "antd";
const { Option } = Select;

type FieldType = {
  id?: number;
  roomType?: {};
  roomQuantity?: number;
  roomCapacity?: number;
  roomSize?: number;
  roomPrice?: number;
  description?: string;
  roomFacilities?: number[];
  status?: string;
  hotelID?: number;
  serveBreakfast?: string;
  roomStatus?: string;

  room_images: any[];
};

// const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
//   console.log("Success:", values);
// };
const url_deploy = "https://vootreeveevuu.up.railway.app";
const url_local = "http://localhost:8080";
const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
const { Dragger } = Upload;

// const props: UploadProps = {
//   name: "file",
//   multiple: true,
//   action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
//   onChange(info) {
//     const { status } = info.file;
//     if (status !== "uploading") {
//       console.log(info.file, info.fileList);
//     }
//     if (status === "done") {
//       message.success(`${info.file.name} file uploaded successfully.`);
//     } else if (status === "error") {
//       message.error(`${info.file.name} file upload failed.`);
//     }
//   },
//   onDrop(e) {
//     console.log("Dropped files", e.dataTransfer.files);
//   },
// };
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

export default function Forms_Room({
  selectedRow,
  onFormSubmit,
  isFormDisabled, // Accept the new prop
}: {
  selectedRow: any;
  onFormSubmit: () => void;
  isFormDisabled: boolean; // Accept the new prop
}) {
  const [form] = Form.useForm();
  const [facilities, setFacilities] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState<
    { id: string; typeName: string }[]
  >([]);
  const [roomImages, setRoomImages] = useState<any[]>([]); // Add state for hotel images
  const [fileList, setFileList] = useState<UploadFile[]>([]); // State for file list
  useEffect(() => {
    // Fetch facilities from API
    const fetchFacilities = async () => {
      try {
        const response = await fetch(`${url_deploy}/api/facilities`); // Replace with your actual API endpoint
        const data = await response.json();
        const hotelFacilities = data.filter(
          (facility: any) => facility.facType === "ROOM"
        );
        setFacilities(hotelFacilities);
      } catch (error) {
        console.error("Failed to fetch facilities:", error);
      }
    };

    fetchFacilities();

    // Fetch property types from API
    const fetchPropertyTypes = async () => {
      try {
        const response = await fetch(`${url_deploy}/api/roomTypes`); // Replace with your actual API endpoint
        const data = await response.json();
        setPropertyTypes(data);
      } catch (error) {
        console.error("Failed to fetch property types:", error);
      }
    };

    fetchPropertyTypes();

    if (selectedRow) {
      form.setFieldsValue({
        id: selectedRow.key,
        roomType: selectedRow.roomType.id,
        roomQuantity: selectedRow.quantity,
        roomCapacity: selectedRow.capacity,
        roomSize: selectedRow.roomSize,
        roomPrice: selectedRow.price,
        description: selectedRow.description,
        serveBreakfast: selectedRow.serveBreakfast,
        hotelId: selectedRow.hotelId,
        roomFacilities: selectedRow.roomFacilities.map(
          (f: any) => f.facility.facId
        ),
        roomStatus: selectedRow.roomStatus,
        // Set hotel images state
      });

      setRoomImages(selectedRow.room_images || []);

      setFileList(
        selectedRow.room_images.map((image: any) => ({
          uid: image.id.toString(),
          name: image.imageName,
          url: `${url_deploy}/api/room-images/${image.id}`,
          status: "done",
        }))
      );
    }
    console.log(roomImages);
  }, [selectedRow]);

  // const props: UploadProps = {
  //   name: "file",
  //   multiple: true,
  //   beforeUpload: (file) => false, // Prevent automatic upload
  //   fileList: [...fileList], // Combine existing images with new ones/
  //   // onRemove: async (file) => {
  //   //   const isExistingImage = fileList.some((img) => img.uid === file.uid);
  //   //   if (isExistingImage) {
  //   //     try {
  //   //       // await axios.delete(`${url_deploy}/api/hotels/images/${file.uid}`);
  //   //       message.success("Image deleted successfully!");
  //   //       setRoomImages(setRoomImages.filter((img) => img.id.toString() !== file.uid));
  //   //     } catch (error) {
  //   //       console.error("Failed to delete image:", error);
  //   //       message.error("Failed to delete image.");
  //   //     }
  //   //   } else {
  //   //     const index = fileList.findIndex((f) => f.uid === file.uid);
  //   //     const newFileList = [...fileList];
  //   //     newFileList.splice(index, 1);
  //   //     setFileList(newFileList); // Update fileList state after removing file
  //   //   }
  //   // },
  //   onChange(info) {
  //     console.log(info);

  //     const { status } = info.file;
  //     console.log('Status:', status); // Ghi nhật ký trạng thái

  //     if (status !== "uploading") {
  //       console.log(info.file, info.fileList);
  //       setFileList([...fileList, info.file]);

  //     }
  //     if (status === 'done') {
  //       console.log(info.file.status);

  //       message.success(`${info.file.name} file uploaded successfully`);
  //       setFileList([...fileList, info.file]);
  //     } else if (status === 'error') {
  //       message.error(`${info.file.name} file upload failed.`);
  //     }
  //   },
  //   onDrop(e) {
  //     console.log('Dropped files', e.dataTransfer.files);
  //     const files = Array.from(e.dataTransfer.files);
  //     setFileList([...fileList]); // Update fileList state
  //   },
  // };

  const props: UploadProps = {
    name: "file",
    multiple: true,
    beforeUpload: (file) => false, // Ngăn tải lên tự động
    fileList: fileList, // Sử dụng trạng thái fileList hiện tại
    onRemove: (file) => {
      const newFileList = fileList.filter((item) => item.uid !== file.uid);
      setFileList(newFileList);
    },
    onChange(info) {
      let newFileList = [...info.fileList];

      // Giới hạn số lượng file được tải lên
      // newFileList = newFileList.slice(-10);

      // Đọc từ phản hồi và hiển thị liên kết file
      newFileList = newFileList.map((file) => {
        if (file.response) {
          // Component sẽ hiển thị file.url như một liên kết
          file.url = file.response.url;
        }
        return file;
      });

      setFileList(newFileList);
    },
    onDrop(e) {
      const files = Array.from(e.dataTransfer.files);
      const newFiles = files.map((file) => ({
        uid: file.uid,
        name: file.name,
        status: "done",
        url: URL.createObjectURL(file),
        originFileObj: file,
      }));
      console.log(newFiles);

      setFileList([...fileList, ...newFiles]);
    },
  };

  const onFinish = async (values: any) => {
    // // Filter out files that are already uploaded
    // const filesToUpdate = fileList.filter((file) => file.status !== "done");
    // console.log("crazy" + JSON.stringify(filesToUpdate));
    // const formData = new FormData();
    // if (filesToUpdate.length > 0) {
    //   filesToUpdate.forEach((file) => {
    //     formData.append("files", file.originFileObj || file);
    //   });
    // }
    // console.log(formData);
    // formData.append("roomDTO",JSON.stringify({..values,
    //   //   capacity: values.roomCapacity,
    // //   price: values.roomPrice,
    // //   quantity: values.roomQuantity,
    // //   roomTypeId: values.roomType,
    // //   status: values.roomStatus,
    // }))

    // Change 'propertyName' to 'hotelName' in the values object
    const updatedValues = {
      // ...formData,
      ...values,
      capacity: values.roomCapacity,
      price: values.roomPrice,
      quantity: values.roomQuantity,
      roomTypeId: values.roomType,
      status: values.roomStatus,
    };
    console.log("formData", JSON.stringify(values.roomFacilities));

    try {
      const response = await axios.put(
        `${url_deploy}/api/rooms/partner/update/${values.id}`,
        updatedValues
      );
      console.log("Update success:", response.data);
      message.success("Update successful!");

      // Filter out files that are already uploaded
      const filesToUpdate = fileList.filter((file) => file.status !== "done");
      console.log("crazy" + JSON.stringify(filesToUpdate));
      console.log("list file", fileList);
      if (filesToUpdate.length > 0) {
        const formData = new FormData();
        filesToUpdate.forEach((file) => {
          formData.append("files", file.originFileObj || file);
        });

        // Upload new files
        await axios.post(
          `${url_deploy}/api/rooms/${values.id}/images`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        message.success("Image upload successful!");
      }
      onFormSubmit();
    } catch (error) {
      console.error("Update failed:", error);
      message.error("Update failed!");
    }
  };
  return (
    <>
      <Row gutter={24} className=" border rounded-md">
        <Col span={12} className="h-full max-h-24">
          <Dragger {...props} listType="picture">
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
            <Form.Item name="id" noStyle>
              <Input type="hidden" />
            </Form.Item>
            <Form.Item name="hotelId" noStyle>
              <Input type="hidden" />
            </Form.Item>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item<FieldType>
                  label="Room type name"
                  name="roomType"
                  rules={[
                    {
                      required: true,
                      message: "Please input your room name !",
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
                    disabled={isFormDisabled}
                  >
                    {propertyTypes.map((type) => (
                      <Option key={type.id} value={type.id}>
                        {type.typeName}
                      </Option>
                    ))}
                  </Select>
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
                  <Input disabled={isFormDisabled} />
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
                  <Input disabled={isFormDisabled} />
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
                  <Input disabled={isFormDisabled} />
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
                    // formatter={(value) =>
                    //   `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                    // }
                    addonAfter="VND"
                    style={{ width: "100%" }}
                    disabled={isFormDisabled}
                  />
                </Form.Item>
              </Col>
            </Row>
            {/* <Row gutter={24}>
              <Col span={24}>
                <Form.Item label="Description" name="description">
                  <TextArea rows={4} disabled={isFormDisabled} />
                </Form.Item>
              </Col>
            </Row> */}
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item<FieldType>
                  label="Room facility"
                  name="roomFacilities"
                  rules={[
                    {
                      required: true,
                      message: "Please input your room facility !",
                    },
                  ]}
                >
                  <Select
                    mode="multiple"
                    placeholder="Select facilities"
                    options={facilities.map((facility) => ({
                      label: facility.facName,
                      value: facility.facId,
                    }))}
                    disabled={isFormDisabled}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item<FieldType>
                  label="Serve Breakfast"
                  name="serveBreakfast"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Serve Breakfast!",
                    },
                  ]}
                >
                  <Select
                    style={{ width: 120 }}
                    onChange={handleChange}
                    disabled={isFormDisabled}
                  >
                    <Option value={true}>Yes</Option>
                    <Option value={false}>No</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item<FieldType>
                  label="Status"
                  name="roomStatus"
                  rules={[
                    {
                      required: true,
                      // message: "Please input your Serve Breakfast!",
                    },
                  ]}
                >
                  <Select
                    style={{ width: 120 }}
                    onChange={handleChange}
                    disabled={isFormDisabled}
                  >
                    <Option value="ACTIVE">ACTIVE</Option>
                    <Option value="INACTIVE">INACTIVE</Option>
                  </Select>
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
                disabled={isFormDisabled}
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
