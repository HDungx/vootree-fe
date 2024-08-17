"use client";
import {
  Checkbox,
  Col,
  Empty,
  Form,
  InputNumber,
  Radio,
  Row,
  Select,
  Table,
  Tag,
  Button,
  Space,
} from "antd";
import { message, Upload } from "antd";
import axios from "axios";
import TextArea from "antd/es/input/TextArea";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd";
import type { UploadProps } from "antd";
import withAuth from "@/components/withAuth";
const { Dragger } = Upload;
const { Option } = Select;
const url_deploy = "https://vootreeveevuu.up.railway.app";
const url_local = "http://localhost:8080";
const RoomCreate = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [roomFacilities, setRoomFacilities] = useState([]);
  const [hotelNames, setHotelNames] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [propertyTypes, setPropertyTypes] = useState<
    { id: string; typeName: string }[]
  >([]);
  const [hotelSelected, setHotelSelected] = useState(false);
  const [roomList, setRoomList] = useState<UploadFile[]>([]);
  useEffect(() => {
    fetchData();
    getFacilities();
    fetchPropertyTypes();
  }, []);

  const propsRoom: UploadProps = {
    name: "file",
    multiple: true,
    beforeUpload: (file) => false, // Ngăn tải lên tự động
    // fileList: fileList, // Sử dụng trạng thái fileList hiện tại
    onRemove: (file) => {
      const newRoomList = roomList.filter((item) => item.uid !== file.uid);
      setRoomList(newRoomList);
    },
    onChange(info) {
      let newRoomList = [...info.fileList];

      // Giới hạn số lượng file được tải lên
      // newFileList = newFileList.slice(-10);

      // Đọc từ phản hồi và hiển thị liên kết file
      newRoomList = newRoomList.map((file) => {
        if (file.response) {
          // Component sẽ hiển thị file.url như một liên kết
          file.url = file.response.url;
        }
        return file;
      });

      setRoomList(newRoomList);
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

      setRoomList([...roomList, ...newFiles]);
    },
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`${url_deploy}/api/hotels`);
      const allData = await response.json();
      setData(allData);
    } catch (error) {
      console.error("Failed to fetch hotels:", error);
    }
  };

  const getFacilities = async () => {
    try {
      const response = await fetch(`${url_deploy}/api/facilities`);
      const facData = await response.json();
      setRoomFacilities(facData.filter((item: any) => item.facType === "ROOM"));
    } catch (error) {
      console.error("Failed to fetch facilities:", error);
    }
  };

  const fetchPropertyTypes = async () => {
    try {
      const response = await fetch(`${url_deploy}/api/roomTypes`);
      const data = await response.json();
      setPropertyTypes(data);
    } catch (error) {
      console.error("Failed to fetch property types:", error);
    }
  };

  useEffect(() => {
    if (!selectedHotel) {
      setFilteredData([]);
      return;
    }

    const selectedHotelData = data.find((hotel) => hotel.id === selectedHotel);
    console.log(selectedHotelData);

    if (selectedHotelData) {
      setFilteredData(selectedHotelData.rooms);
    } else {
      setFilteredData([]);
    }
  }, [selectedHotel, data]);

  const onChange = (value) => {
    setSelectedHotel(value);
    setHotelSelected(true);
  };

  const columns = [
    {
      title: "Loại phòng",
      dataIndex: "roomType",
      key: "roomType",
      render: (text, record) => <span>{record.roomType.typeName}</span>,
    },
    {
      title: "Sức chứa",
      dataIndex: "capacity",
      key: "capacity",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (text) => <span>{text.toLocaleString()} VNĐ</span>,
    },
    {
      title: "Dịch vụ ăn sáng",
      dataIndex: "serveBreakfast",
      key: "serveBreakfast",
      render: (serveBreakfast) => (
        <Tag color={serveBreakfast ? "green" : "red"}>
          {serveBreakfast ? "Có" : "Không"}
        </Tag>
      ),
    },
  ];

  const onFinish = async (values) => {
    // Lấy hotelId từ selectedHotel và thêm vào values
    const hotelId = selectedHotel;
    const updatedValues = {
      ...values,
      capacity: values.roomCapacity,
      price: values.roomPrice,
      quantity: values.roomQuantity,
      // roomSize: values.roomSize,
      roomTypeId: values.roomType,
      // roomFacilities:values.roomFacilities,
      status: "PENDING",
      hotelId,
    };

    console.log("Form values:", updatedValues);

    try {
      // Gửi dữ liệu lên server
      const response = await axios.post(
        `${url_deploy}/api/rooms/partner/create/${hotelId}`,
        updatedValues
      );

      // Xử lý response từ server (nếu cần)
      console.log("Server response:", response.data);

      if (response.status === 200 || response.status === 201) {
        const roomId = response.data.id;

        // Upload room images
        const filesRoomToUpdate = roomList.filter(
          (file) => file.status !== "done"
        );

        if (filesRoomToUpdate.length > 0) {
          const formData2 = new FormData();
          filesRoomToUpdate.forEach((file) => {
            formData2.append("files", file.originFileObj || file);
          });

          // Upload new files for room
          await axios.post(
            `${url_deploy}/api/rooms/${roomId}/images`,
            formData2,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          message.success("Image Room upload successful!");
        }
      }
      // Thực hiện fetch lại dữ liệu khách sạn đã chọn sau khi thêm phòng thành công

      // Reset form sau khi submit thành công (nếu cần)
      form.resetFields();

      // Hiển thị thông báo hoặc chuyển hướng (nếu cần)
      // Ví dụ:
      message.success("Đã thêm phòng thành công!");
      fetchData();
    } catch (error) {
      console.error("Failed to add room:", error);
      // Xử lý lỗi (nếu cần)
      message.error("Đã xảy ra lỗi khi thêm phòng, vui lòng thử lại sau.");
    }
  };

  return (
    <>
      <div className="p-20 px-40">
        <div className="w-9/12">
          <div>
            <span className="text-lg font-bold">Thông tin phòng</span>
          </div>
          <div className="mt-5">
            <Row className="border-4 rounded-md p-3">
              <Col span={20}>
                <span className="font-semibold text-lg">
                  Thiết lập phòng của bạn
                </span>
                <p>
                  Liệt kê khách sạn của bạn trên VooTreeVeeVuu bằng cách thiết
                  lập giá cả và chi tiết phòng cho một loại phòng{" "}
                  <span className="text-sky-600 font-semibold">
                    {" "}
                    (Bạn có thể thêm nhiều loại phòng khác sau!)
                  </span>
                </p>
              </Col>
              <Col span={4} className="text-end justify-end flex">
                <Image
                  src="/icon/partner/beds.png"
                  width={50}
                  height={50}
                  alt=""
                />
              </Col>
            </Row>
          </div>
          <div className="mt-10">
            <span className="text-lg font-bold">
              Chọn nơi ở muốn thêm phòng
            </span>
            <div className="mt-5 border rounded-md p-5">
              <Select
                className="w-80"
                size="large"
                showSearch
                placeholder="Chọn nơi nghỉ của bạn"
                optionFilterProp="label"
                value={selectedHotel}
                onChange={onChange}
              >
                {data.map((hotel) => (
                  <Option key={hotel.id} value={hotel.id}>
                    {hotel.hotelName}
                  </Option>
                ))}
              </Select>
              <Table dataSource={filteredData} columns={columns} rowKey="id" />
            </div>
          </div>
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <div className="mt-10">
              <span className="text-lg font-bold">
                Thông tin phòng và giá cả
              </span>
              <div className="border rounded-md p-5 mt-2">
                <strong>Thông tin cơ bản</strong>
                <Form.Item
                  className="mt-4 w-6/12"
                  name="roomType"
                  label="Tên phòng"
                  rules={[
                    { required: true, message: "Vui lòng chọn thông tin!" },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Chọn tên lọa phòng"
                    optionFilterProp="children"
                    size="large"
                  >
                    {propertyTypes.map((type) => (
                      <Option key={type.id} value={type.id}>
                        {type.typeName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  className="mt-4 "
                  name="roomSize"
                  label="Kích thước phòng"
                  rules={[
                    { required: true, message: "Vui lòng nhập thông tin!" },
                  ]}
                >
                  <InputNumber
                    className="w-52"
                    addonAfter="m²"
                    size="large"
                    min={1}
                  />
                </Form.Item>
                <Form.Item
                  className="mt-4 "
                  name="roomCapacity"
                  label="Sức chứa"
                  rules={[
                    { required: true, message: "Vui lòng nhập thông tin!" },
                  ]}
                >
                  <InputNumber
                    className="w-52"
                    size="large"
                    addonAfter="Người"
                    min={1}
                  />
                </Form.Item>
                <Form.Item
                  className="mt-4 "
                  name="roomPrice"
                  label="Giá mỗi đêm"
                  rules={[
                    {
                      required: true,
                      message: "Giá mỗi đêm ít nhất phải là 80,000 Vnđ!",
                    },
                  ]}
                >
                  <InputNumber
                    className="w-52"
                    size="large"
                    addonAfter="Vnđ"
                    min={80000}
                  />
                </Form.Item>
                <Form.Item label="Description" name="description">
                  <TextArea rows={4} />
                </Form.Item>
                <div>
                  <strong>Số lượng phòng</strong>
                  <p>
                    Bạn có bao nhiêu phòng loại này trong khuôn viên của mình?
                  </p>
                </div>
                <Form.Item
                  className="mt-2"
                  name="roomQuantity"
                  rules={[
                    { required: true, message: "Vui lòng nhập thông tin!" },
                  ]}
                >
                  <InputNumber
                    className="w-52"
                    size="large"
                    addonAfter="Phòng"
                    min={1}
                  />
                </Form.Item>
                <div>
                  <strong>Có bao gồm bữa sáng không?</strong>
                </div>
                <Form.Item className="mt-2" name="breakfast">
                  <Radio.Group size="large">
                    <Radio.Button value={true}>Bao gồm bữa sáng</Radio.Button>
                    <Radio.Button value={false}>
                      Không bao gồm bữa sáng
                    </Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </div>
            </div>
            <div className="mt-10">
              <span className="text-lg font-bold">
                Dịch vụ & tiện ích phòng
              </span>
              <p>
                Những dịch vụ này được tìm thấy ở hầu hết các tài sản thành công
                của chúng tôi
              </p>
              <div className="border rounded-md p-2 mt-2">
                <Form.Item
                  name="roomFacilities"
                  rules={[
                    { required: true, message: "Vui lòng chọn thông tin!" },
                  ]}
                >
                  <Checkbox.Group className="font-semibold">
                    <Row gutter={[16, 16]}>
                      {roomFacilities.map((fac) => (
                        <Col span={8} key={fac.facId}>
                          <Checkbox value={fac.facId}>{fac.facName}</Checkbox>
                        </Col>
                      ))}
                    </Row>
                  </Checkbox.Group>
                </Form.Item>
              </div>
            </div>
            <div className="mt-10">
              <span className="text-lg font-bold">Hình ảnh</span>
              <p className="font-semibold">
                Thêm hình ảnh đại diện cho phòng của bạn
              </p>
              <div className="border rounded-md p-2 mt-2">
                <Form.Item
                  name="images"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng tải lên ít nhất một hình ảnh!",
                    },
                  ]}
                >
                  <Upload.Dragger
                    {...propsRoom}
                    listType="picture"
                    // fileList={[...listHotelImg]}
                  >
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                      Click hoặc kéo thả hình ảnh vào đây để tải lên
                    </p>
                    <p className="ant-upload-hint">
                      Hỗ trợ tải lên từng tập tin hoặc nhiều tập tin. Cấm nghiêm
                      ngặt tải lên dữ liệu công ty hoặc các tập tin bị cấm khác.
                    </p>
                  </Upload.Dragger>
                </Form.Item>
              </div>
            </div>
            <Form.Item name="hotelId" style={{ display: "none" }}>
              <input type="hidden" value={selectedHotel} />
            </Form.Item>
            <Form.Item className="mt-4">
              <Button
                type="primary"
                htmlType="submit"
                disabled={!hotelSelected}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};
export default withAuth(RoomCreate, "PARTNER");
