"use client";
import { InboxOutlined } from "@ant-design/icons";
import { Button, Col, Form, Image, Input, Row } from "antd";
import type { FormProps } from "antd";
import TextArea from "antd/es/input/TextArea";
import { message, Upload } from "antd";
import type { UploadProps } from "antd";
import { Select } from "antd";
import { Rate } from "antd";
import { TimePicker } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import axios from "axios";
const { Option } = Select;
import type { UploadFile } from "antd";
const url_deploy = "https://vootreeveevuu.up.railway.app";
const url_local = "http://localhost:8080";
type FieldType = {
  key?: number;
  propertyName?: string;
  propertyType?: {};
  stars?: number;
  checkIn?: string;
  checkOut?: string;
  address?: string; // Updated type to string
  description?: string;
  facility?: number[]; // Updated to array of numbers
  status?: string;

  hotelPhoneNum: string;
  city: string;
  userID: number;

  hotelImages: any[];
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
const { Dragger } = Upload;

// const props: UploadProps = {
//   name: "file",
//   multiple: true,
//   beforeUpload: (file) => {
//     // Return false to prevent automatic upload
//     return false;
//   },
//   onChange(info) {
//     const { status } = info.file;
//     if (status !== "uploading") {
//       console.log(info.file, info.fileList);
//     }
//   },
//   onDrop(e) {
//     console.log("Dropped files", e.dataTransfer.files);
//     const files = e.dataTransfer.files;
//     const fileList = Array.from(files);
//     setFileList(fileList); // Update fileList state
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
const format = "HH:mm";

export default function Forms({
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
  const [hotelImages, setHotelImages] = useState<any[]>([]); // Add state for hotel images
  const [fileList, setFileList] = useState<UploadFile[]>([]); // State for file list
  useEffect(() => {
    // Fetch facilities from API
    const fetchFacilities = async () => {
      try {
        const response = await fetch(`${url_deploy}/api/facilities`); // Replace with your actual API endpoint
        const data = await response.json();
        const hotelFacilities = data.filter(
          (facility: any) => facility.facType === "HOTEL"
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
        const response = await fetch(
          `${url_deploy}/api/accommodationTypes`
        ); // Replace with your actual API endpoint
        const data = await response.json();
        setPropertyTypes(data);
      } catch (error) {
        console.error("Failed to fetch property types:", error);
      }
    };

    fetchPropertyTypes();

    // Save selectedRow to sessionStorage when it changes
    if (selectedRow) {
      sessionStorage.setItem("selectedHotel", JSON.stringify(selectedRow));
    }

    // Populate form fields from sessionStorage
    const sessionData = sessionStorage.getItem("selectedHotel");
    if (sessionData) {
      const parsedData = JSON.parse(sessionData);
      form.setFieldsValue({
        key: parsedData?.key,
        propertyName: parsedData?.name,
        address: parsedData?.address,
        status: parsedData?.status,
        stars: parsedData?.hotelStars,
        checkIn: dayjs(parsedData?.checkInTime, "HH:mm"),
        checkOut: dayjs(parsedData?.checkOutTime, "HH:mm"),
        description: parsedData?.hotelDescription,
        propertyType: parsedData?.accommodationType.id,
        facility: parsedData?.hotelFacilities?.map(
          (f: any) => f.facility.facId
        ),

        hotelPhoneNum: parsedData?.hotelPhoneNum,
        city: parsedData?.city,
        userID: parsedData?.userID,
      });
      // Set hotel images state
      // setHotelImages(parsedData.hotelImages || []);
      setFileList(
        parsedData?.hotelImages?.map((image: any) => ({
          uid: image.id.toString(),
          name: image.imageName,
          url: `${url_deploy}${image.imageUrl}`,
          status: "done",
        }))
      );
      console.log(hotelImages);
    }
  }, [form, selectedRow]);

  const citiesData = [
    // Thành phố
    "Hà Nội",
    "Hồ Chí Minh",
    "Hải Phòng",
    "Đà Nẵng",
    "Cần Thơ",
    "Đà Lạt", // Thêm thành phố Đà Lạt vào đây
    // Tỉnh
    "Hà Giang",
    "Cao Bằng",
    "Lai Châu",
    "Lào Cai",
    "Tuyên Quang",
    "Lạng Sơn",
    "Bắc Kạn",
    "Thái Nguyên",
    "Phú Thọ",
    "Yên Bái",
    "Sơn La",
    "Hòa Bình",
    "Thái Bình",
    "Quảng Ninh",
    "Bắc Giang",
    "Bắc Ninh",
    "Hà Nam",
    "Hưng Yên",
    "Nam Định",
    "Ninh Bình",
    "Thanh Hóa",
    "Nghệ An",
    "Hà Tĩnh",
    "Quảng Bình",
    "Quảng Trị",
    "Thừa Thiên Huế",
    "Quảng Nam",
    "Quảng Ngãi",
    "Bình Định",
    "Phú Yên",
    "Khánh Hòa",
    "Ninh Thuận",
    "Bình Thuận",
    "Kon Tum",
    "Gia Lai",
    "Đắk Lắk",
    "Đắk Nông",
    "Lâm Đồng",
    "Bình Phước",
    "Tây Ninh",
    "Bình Dương",
    "Đồng Nai",
    "Vũng Tàu",
    "Long An",
    "Tiền Giang",
    "Bến Tre",
    "Trà Vinh",
    "Vĩnh Long",
    "Đồng Tháp",
    "An Giang",
    "Kiên Giang",
    "Hậu Giang",
    "Sóc Trăng",
    "Bạc Liêu",
    "Cà Mau",
  ];
  // const listHotelImg: UploadFile[] = hotelImages.map((image) => ({
  //   uid: image.id.toString(),
  //   name: image.imageName,
  //   url: `${url_deploy}${image.imageUrl}`,
  //   status: 'done'
  // }));

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
    // Change 'propertyName' to 'hotelName' in the values object
    const updatedValues = {
      ...values,
      hotelDescription: values.description,
      hotelStars: values.stars,
      hotelName: values.propertyName, // Change 'propertyName' to 'hotelName'
      accommodationTypeId: values.propertyType,
      userId: values.userID,
      status: "ACTIVE", // Change status to 'PENDING',
      hotelFacilities: values.facility,
      checkInTime: values.checkIn
        ? values.checkIn.format("HH:mm:ss")
        : undefined, // Convert to string format 'HH:mm'
      checkOutTime: values.checkOut
        ? values.checkOut.format("HH:mm:ss")
        : undefined, // Convert to string format 'HH:mm'
    };
    console.log(updatedValues);

    try {
      const response = await axios.put(
        `${url_deploy}/api/hotels/partner/update/${values.key}`,
        updatedValues
      );
      console.log("Update success:", response.data);
      message.success("Update information successful!");

      // Handle image uploads

      // Filter out files that are already uploaded
      const filesToUpdate = fileList.filter((file) => file.status !== "done");
      console.log("crazy" + JSON.stringify(filesToUpdate));
      if (filesToUpdate.length > 0) {
        const formData = new FormData();
        filesToUpdate.forEach((file) => {
          formData.append("files", file.originFileObj || file);
        });

        // Upload new files
        await axios.post(
          `${url_deploy}/api/hotels/${values.key}/images`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        message.success("Image upload successful!");
      }

      // Handle image deletions
      // const originalFileList = selectedRow.hotelImages.map((image: any) => ({
      //   uid: image.id.toString(),
      //   name: image.imageName,
      //   url: `${url_deploy}${image.imageUrl}`,
      //   status: "done",
      // }));

      // const filesToDelete = originalFileList.filter(
      //   (originalFile) =>
      //     !fileList.some((file) => file.uid === originalFile.uid)
      // );

      // for (const file of filesToDelete) {
      //   await axios.delete(
      //     `${url_deploy}/api/hotels/${values.key}/images/${file.uid}`
      //   );
      // }

      // message.success("Image deletion successful!");

      onFormSubmit();
    } catch (error) {
      console.error("Update failed:", error);
      message.error("Update failed!");
    }
  };

  // console.log(JSON.stringify(listHotelImg, null, 2));

  return (
    <>
      <Row gutter={24} className="border rounded-md">
        <Col span={12} className="h-full max-h-24">
          <Dragger
            {...props}
            listType="picture"
            // fileList={[...listHotelImg]}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag image files to this area to upload
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
            initialValues={{
              status: selectedRow?.status || "",
              checkIn: dayjs("12:30", format),
              checkOut: dayjs("14:30", format), // Ensure initial value is set correctly
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            form={form}
          >
            <div className="mt-5"></div>
            <Form.Item name="key" noStyle>
              <Input type="hidden" />
            </Form.Item>

            <Form.Item name="userID" noStyle>
              <Input type="hidden" />
            </Form.Item>

            <Row gutter={24}>
              <Col span={24}>
                <Form.Item<FieldType>
                  label="Property name"
                  name="propertyName"
                  rules={[
                    {
                      required: true,
                      message: "Please input your property name!",
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
                  label="Property type"
                  name="propertyType"
                  rules={[
                    {
                      required: true,
                      message: "Please input your property type!",
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
                  label="Stars"
                  name="stars"
                  rules={[
                    {
                      required: true,
                      message: "Please input your stars!",
                    },
                  ]}
                >
                  <Rate disabled={isFormDisabled} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item<FieldType>
                  label="Check in time"
                  name="checkIn"
                  rules={[
                    {
                      required: true,
                      message: "Please input your check in time!",
                    },
                  ]}
                >
                  <TimePicker format={format} disabled={isFormDisabled} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item<FieldType>
                  label="Check out time"
                  name="checkOut"
                  rules={[
                    {
                      required: true,
                      message: "Please input your check out time!",
                    },
                  ]}
                >
                  <TimePicker format={format} disabled={isFormDisabled} />
                </Form.Item>
              </Col>
            </Row>
            {/* city */}
            {/* Code hiển thị Select Box */}
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item<FieldType>
                  label="Thành phố / Tỉnh"
                  name="city"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn thành phố hoặc tỉnh!",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Chọn thành phố hoặc tỉnh"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option?.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    disabled={isFormDisabled}
                  >
                    {/* Tạo các Option cho Select Box */}
                    <Option disabled key="thanhpho" className="fw-bold">
                      Thành phố
                    </Option>
                    {citiesData
                      .filter((city) =>
                        [
                          "Hà Nội",
                          "Hồ Chí Minh",
                          "Hải Phòng",
                          "Đà Nẵng",
                          "Cần Thơ",
                          "Đà Lạt",
                        ].includes(city)
                      )
                      .map((city) => (
                        <Option key={city} value={city}>
                          {city}
                        </Option>
                      ))}
                    <Option disabled key="tinhtp" className="fw-bold">
                      Tỉnh
                    </Option>
                    {citiesData
                      .filter(
                        (city) =>
                          ![
                            "Hà Nội",
                            "Hồ Chí Minh",
                            "Hải Phòng",
                            "Đà Nẵng",
                            "Cần Thơ",
                            "Đà Lạt",
                          ].includes(city)
                      )
                      .map((city) => (
                        <Option key={city} value={city}>
                          {city}
                        </Option>
                      ))}
                  </Select>
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
                  <Input disabled={isFormDisabled} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item<FieldType>
                  label="Phone"
                  name="hotelPhoneNum"
                  rules={[
                    {
                      required: true,
                      message: "Please input your phone number hotel!",
                    },
                  ]}
                >
                  <Input disabled={isFormDisabled} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item label="Description" name="description">
                  <TextArea rows={4} disabled={isFormDisabled} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item<FieldType>
                  label="Facility"
                  name="facility"
                  rules={[
                    {
                      required: true,
                      message: "Please select your hotel facilities!",
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
                  label="Status"
                  name="status"
                  rules={[
                    {
                      required: true,
                      message: "Please input your status!",
                    },
                  ]}
                >
                  <Select
                    style={{ width: 120 }}
                    onChange={handleChange}
                    disabled={isFormDisabled}
                  >
                    <Option value="ACTIVE">ACTIVE</Option>
                    <Option value="PENDING">PENDING</Option>
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
                className="mt-5 float-end"
                disabled={isFormDisabled}
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
