"use client";
import {
  Button,
  Checkbox,
  Col,
  ConfigProvider,
  Form,
  Input,
  InputNumber,
  Radio,
  Rate,
  Row,
  Segmented,
  Select,
  Steps,
  TimePicker,
  message,
} from "antd";
import axios from "axios";
import { format } from "date-fns";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";
import { useEffect, useState } from "react";

const formats = "HH:mm";
const { Step } = Steps;
const { TextArea } = Input;
const MultiStepForm = () => {
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState({});
  const [form] = Form.useForm();
  const [facilities, setFacilities] = useState([]);
  const [hotelFacilities, setHotelFacilities] = useState([]);
  const [roomFacilities, setRoomFacilities] = useState([]);
  const [userId, setUserId] = useState();
  useEffect(() => {
    const token = localStorage.getItem("token");
    const decode = jwtDecode(token);
    setUserId(decode?.user_id);

    const getFacilities = async () => {
      const response = await fetch("http://localhost:8080/api/facilities"); // API backend trả về toàn bộ giá trị
      const allData = await response.json();
      setHotelFacilities(
        allData.filter((item: any) => item.facType === "HOTEL")
      );
      setRoomFacilities(allData.filter((item: any) => item.facType === "ROOM"));
    };
    getFacilities();
  }, []);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  interface hotel {
    hotelName: string;
    address: string;
    checkInTime: string;
    checkOutTime: string;
    city: string;
    hotelDescription: string;
    hotelPhoneNum: string;
    hotelStars: number;
    status: string;
    accommodationType: object;
    user: object;
  }

  const complete = async () => {
    // const formatCheckInTime = formData.checkIn
    const checkInTimeData = formData.checkIn;
    const checkOutTimeData = formData.checkOut;
    const formatCheckInTime = checkInTimeData.format("HH:mm:ss");
    const formatCheckOutTime = checkOutTimeData.format("HH:mm:ss");
    const accommodationTypeObject = { id: formData.propertyType };
    const userObject = { id: userId };
    const hotelFacilitiesObject = formData.facilities.map((num) => ({
      facilityId: num,
    }));
    const roomFacilitiesOject = formData.roomFacilities.map((num) => ({
      facilityId: num,
    }));
    console.log(hotelFacilitiesObject);

    const filteredHotel = {
      hotelName: formData.hotelName,
      address: formData.address,
      checkInTime: formatCheckInTime,
      checkOutTime: formatCheckOutTime,
      city: formData.city,
      hotelDescription: formData.description,
      hotelPhoneNum: formData.hotelPhoneNum,
      hotelStars: formData.stars,
      status: formData.status,
      accommodationTypeId: formData.propertyType.id,
      userId: userId,
      hotelFacilities: hotelFacilitiesObject,
      rooms: [
        {
          capacity: formData.roomCapacity,
          price: formData.roomPrice,
          quantity: formData.roomQuantity,
          roomSize: formData.roomSize,
          description: formData.description,
          serveBreakfast: formData.breakfast,
          roomTypeId: formData.roomType,
          roomFacilities: roomFacilitiesOject,
        },
      ],
    };

    console.log(filteredHotel);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/hotels",
        filteredHotel
      );
      message.success("Bạn đã đăng kí thành công!");
    } catch (error) {
      console.error("Failed to submit data:", error);
      message.error("Failed to submit data");
    }

    console.log("Form Data:", formData);
  };

  const status = "PENDING";
  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
  const steps = [
    {
      title: "Thông tin cơ bản",
      content: (
        <div className="w-9/12">
          <div>
            <span className="text-lg font-bold">Thông tin chỗ nghỉ</span>
          </div>
          <div className="p-10">
            <div>
              <Row className="border-4 rounded-md p-3">
                <Col span={20}>
                  <span className="font-semibold text-lg">
                    Giúp bạn tiếp cận đối tượng khách hàng phù hợp nhất.
                  </span>
                  <p>
                    Vui lòng cung cấp mọi thông tin được yêu cầu trừ khi có đánh
                    dấu không bắt buộc.
                  </p>
                </Col>
                <Col span={4} className="text-end justify-end flex">
                  <Image
                    src="/icon/partner/check-list.png"
                    width={50}
                    height={50}
                    alt=""
                  />
                </Col>
              </Row>
            </div>
            <Form
              className="mt-5"
              form={form}
              layout="vertical"
              // initialValues={{ propertyType: 1 }}
              onFinish={(values) => {
                if (values.propertyType === undefined) {
                  values.propertyType = { id: 1 };
                }
                if (values.stars === undefined) {
                  values.stars = 0;
                }
                setFormData((prev) => ({ ...prev, ...values }));
                next();
              }}
            >
              <div>
                <span className="text-lg font-bold">Đặt tên cho nhà</span>
                <p className="font-semibold">
                  Hãy tận dụng, và làm cho nó nghe có vẻ hấp dẫn.
                </p>
                <div className="border rounded-md p-2 mt-2">
                  <Form.Item
                    name="hotelName"
                    rules={[
                      { required: true, message: "Hãy nhập tên nhà của bạn!" },
                    ]}
                  >
                    <Input
                      size="large"
                      placeholder="Ví dụ: Khách sạn Mường Thanh"
                    />
                  </Form.Item>
                </div>
              </div>
              <div className="mt-10">
                <span className="text-lg font-bold">Số điện thoại</span>
                <p className="font-semibold">
                  Số điện thoại của khách sạn để khách hàng có thể liên lạc nếu
                  cần thiết
                </p>
                <div className="border rounded-md p-2 mt-2">
                  <Form.Item
                    className="w-96"
                    name="hotelPhoneNum"
                    rules={[
                      {
                        required: true,
                        message: "Hãy nhập số điện thoại nhà của bạn!",
                      },
                    ]}
                  >
                    <InputNumber className="w-52" size="large" placeholder="" />
                  </Form.Item>
                </div>
              </div>
              <div className="mt-10">
                <span className="text-lg font-bold">
                  Chọn loại hình kinh doanh
                </span>
                <p className="font-semibold">Chọn một loại hình chỗ nghỉ</p>
                <div className="border rounded-md p-2 mt-2 h-36 justify-center flex">
                  <Form.Item name="propertyType">
                    <ConfigProvider
                      theme={{
                        components: {
                          Segmented: {
                            itemSelectedBg: "#009acc",
                            itemSelectedColor: "#ffffff",
                            trackBg: "#ffffff",
                          },
                        },
                      }}
                    >
                      <Segmented
                        defaultValue={1}
                        onChange={(value) => {
                          form.setFieldValue("propertyType", value);
                        }}
                        options={[
                          {
                            label: (
                              <div>
                                <div className="justify-center flex p-4">
                                  <Image
                                    src="/icon/partner/hotel.png"
                                    width={60}
                                    height={60}
                                    alt=""
                                  />
                                </div>
                                <p className="text-lg">Khách sạn</p>
                              </div>
                            ),
                            value: 1,
                          },
                          {
                            label: (
                              <div>
                                <div className="justify-center flex p-4">
                                  <Image
                                    src="/icon/partner/motel.png"
                                    width={60}
                                    height={60}
                                    alt=""
                                  />
                                </div>
                                <p className="text-lg">Nhà nghỉ</p>
                              </div>
                            ),
                            value: 2,
                          },
                          {
                            label: (
                              <div>
                                <div className="justify-center flex p-4">
                                  <Image
                                    src="/icon/partner/resort.png"
                                    width={60}
                                    height={60}
                                    alt=""
                                  />
                                </div>
                                <p className="text-lg">Khu nghỉ mát</p>
                              </div>
                            ),
                            value: 3,
                          },
                          {
                            label: (
                              <div>
                                <div className="justify-center flex p-4">
                                  <Image
                                    src="/icon/partner/homestay.png"
                                    width={60}
                                    height={60}
                                    alt=""
                                  />
                                </div>
                                <p className="text-lg">Nhà trọ</p>
                              </div>
                            ),
                            value: 4,
                          },
                          {
                            label: (
                              <div>
                                <div className="justify-center flex p-4">
                                  <Image
                                    src="/icon/partner/building.png"
                                    width={60}
                                    height={60}
                                    alt=""
                                  />
                                </div>
                                <p className="text-lg">Căn hộ</p>
                              </div>
                            ),
                            value: 5,
                          },
                          {
                            label: (
                              <div>
                                <div className="justify-center flex p-4">
                                  <Image
                                    src="/icon/partner/villa.png"
                                    width={60}
                                    height={60}
                                    alt=""
                                  />
                                </div>
                                <p className="text-lg">Biệt thự</p>
                              </div>
                            ),
                            value: 6,
                          },
                        ]}
                      />
                    </ConfigProvider>
                  </Form.Item>
                </div>
              </div>
              <div className="mt-10">
                <span className="text-lg font-bold">Xếp hạng sao</span>
                <p className="font-semibold">
                  Xếp hạng nhà của bạn để giúp đặt ra kỳ vọng cho khách du lịch
                  lưu trú.
                </p>
                <div className="border rounded-md p-2 mt-2">
                  <Form.Item name="stars">
                    <Rate defaultValue={0} />
                  </Form.Item>
                </div>
              </div>

              <div className="mt-5 text-end">
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  className="h-12 w-32"
                >
                  <span className="font-semibold"> TIẾP THEO</span>
                </Button>
              </div>
            </Form>
          </div>
        </div>
      ),
    },
    {
      title: "Địa điểm và tiện nghi",
      content: (
        <>
          <Form
            form={form}
            layout="vertical"
            onFinish={(values) => {
              setFormData((prev) => ({ ...prev, ...values }));
              next();
            }}
          >
            <div className="w-9/12">
              <div className="mt-10">
                <span className="text-lg font-bold">Địa điểm</span>
                <p className="font-semibold">
                  Khách sẽ chỉ nhận được địa chỉ chính xác của bạn sau khi họ đã
                  xác nhận đặt phòng.
                </p>
                <div className="border rounded-md p-2 mt-2">
                  <Form.Item
                    name="address"
                    label="Địa chỉ"
                    className="font-semibold"
                    rules={[
                      { required: true, message: "Vui lòng địa chỉ của bạn!" },
                    ]}
                  >
                    <Input
                      size="large"
                      className="font-normal"
                      count={{ max: 255, show: true }}
                    />
                  </Form.Item>
                  <Row>
                    <Col span={12}>
                      <Form.Item
                        name="city"
                        label="Tỉnh/Thành phố"
                        className="font-semibold"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng tỉnh thành của bạn!",
                          },
                        ]}
                      >
                        <Select
                          showSearch
                          placeholder="Chọn tỉnh/thành phố"
                          optionFilterProp="children"
                          filterOption={filterOption}
                          options={[
                            {
                              value: "Hồ Chí Minh",
                              label: "Hồ Chí Minh",
                            },
                            {
                              value: "Đà Lạt",
                              label: "Đà Lạt",
                            },
                            {
                              value: "Vũng Tàu",
                              label: "Vũng Tàu",
                            },
                          ]}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              </div>
              <div className="mt-10">
                <span className="text-lg font-bold">
                  Thời gian nhận/trả phòng
                </span>
                <div className="border rounded-md p-2 mt-2">
                  <Form.Item
                    name="checkIn"
                    label="Khi nào khách có thể nhận phòng?"
                    className="font-semibold"
                    rules={[
                      { required: true, message: "Vui lòng chọn thời gian!" },
                    ]}
                  >
                    <TimePicker minuteStep={15} format={formats} size="large" />
                  </Form.Item>
                  <Form.Item
                    name="checkOut"
                    label="Khi nào khách có thể trả phòng?"
                    className="font-semibold"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng thời gian của bạn!",
                      },
                    ]}
                  >
                    <TimePicker minuteStep={15} format={formats} size="large" />
                  </Form.Item>
                </div>
              </div>
              <div className="mt-10">
                <span className="text-lg font-bold">Tiện nghi</span>
                <p className="font-semibold">
                  Xếp hạng nhà của bạn để giúp đặt ra kỳ vọng cho khách du lịch
                  lưu trú.
                </p>
                <div className="border rounded-md p-2 mt-2">
                  <Form.Item
                    name="facilities"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn dịch vụ & tiện ích của bạn!",
                      },
                    ]}
                  >
                    <Checkbox.Group className="font-semibold">
                      <Row gutter={[16, 16]}>
                        {hotelFacilities.map((fac, index) => (
                          <Col span={8} key={index}>
                            <Checkbox value={fac.facId}>{fac.facName}</Checkbox>
                          </Col>
                        ))}
                      </Row>
                    </Checkbox.Group>
                  </Form.Item>
                </div>
              </div>
              <div className="mt-10">
                <span className="text-lg font-bold">Mô tả chỗ của bạn</span>
                <p className="font-semibold">
                  Những đặc điểm nổi bật của căn hộ để thu hút du khách
                </p>
                <div className="border rounded-md p-2 mt-2">
                  <Form.Item
                    name="description"
                    rules={[
                      { required: true, message: "Vui lòng địa chỉ của bạn!" },
                    ]}
                  >
                    <TextArea rows={4} count={{ max: 255, show: true }} />
                  </Form.Item>
                </div>
              </div>
              <div className="text-end mt-5 ">
                <Button onClick={prev} className="h-12 w-32" size="large">
                  <span className="font-semibold ">TRƯỚC</span>
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="h-12 w-32 ms-4"
                  size="large"
                >
                  <span className="font-semibold ">TIẾP THEO</span>
                </Button>
              </div>
            </div>
          </Form>
        </>
      ),
    },
    {
      title: "Thông tin phòng",
      content: (
        <>
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
            <Form
              form={form}
              layout="vertical"
              onFinish={(values) => {
                setFormData((prev) => ({ ...prev, ...values, status }));
                next();
              }}
            >
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
                      filterOption={filterOption}
                      size="large"
                      options={[
                        {
                          value: "1",
                          label: "Phòng Delux",
                        },
                        {
                          value: "2",
                          label: "Phòng thường",
                        },
                        {
                          value: "3",
                          label: "Phòng VIP",
                        },
                      ]}
                    />
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
                  Những dịch vụ này được tìm thấy ở hầu hết các tài sản thành
                  công của chúng tôi
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
                        {roomFacilities.map((fac, index) => (
                          <Col span={8} key={index}>
                            <Checkbox value={fac.facId}>{fac.facName}</Checkbox>
                          </Col>
                        ))}
                      </Row>
                    </Checkbox.Group>
                  </Form.Item>
                </div>
              </div>

              <div className="text-end mt-5 ">
                <Button onClick={prev} className="h-12 w-32" size="large">
                  <span className="font-semibold ">TRƯỚC</span>
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="h-12 w-32 ms-4"
                  size="large"
                >
                  <span className="font-semibold ">TIẾP THEO</span>
                </Button>
              </div>
            </Form>
          </div>
        </>
      ),
    },
    {
      title: "Chính sách",
      content: (
        <>
          <div className="w-9/12">
            <div className="mt-5">
              <Row className="border-4 rounded-md p-3">
                <Col span={20}>
                  <span className="font-semibold text-lg">
                    Hãy ký hợp đồng và bắt đầu đặt chỗ.
                  </span>
                  <p>Chỉ một vài thông tin nữa thôi!</p>
                </Col>
                <Col span={4} className="text-end justify-end flex">
                  <Image
                    src="/icon/partner/contract.png"
                    width={50}
                    height={50}
                    alt=""
                  />
                </Col>
              </Row>
            </div>
            <div className="mt-10">
              <span className="text-lg font-bold">
                Biết luật pháp, quy định và thuế địa phương của bạn.
              </span>
              <div className="border rounded-md p-2 mt-2">
                <strong>
                  Bạn có trách nhiệm xem xét luật pháp và thuế địa phương.
                </strong>
                <p className="mt-2">
                  Hãy tìm hiểu các quy định, luật pháp và nghĩa vụ thuế tại địa
                  phương của bạn trước khi bạn đặt chỗ. Nhiều quốc gia và một số
                  thành phố có luật cụ thể về việc sử dụng tài sản của bạn dưới
                  dạng cho thuê ngắn hạn, chia sẻ nhà và/hoặc cho thuê chỗ ở
                  chuyên nghiệp. Bạn có trách nhiệm làm việc trong khuôn khổ
                  pháp lý của quốc gia mình, có thể bao gồm việc xin giấy phép,
                  giấy phép hoặc đăng ký liên quan trước khi đặt chỗ và thanh
                  toán mọi khoản thuế hiện hành đối với mọi thu nhập bạn tạo ra
                  từ việc đặt chỗ đó.
                </p>
                <p className="mt-4 font-bold">Hoa hồng theo hợp đồng</p>
                <p className="mt-4 font-bold">20%</p>
                <p className="mt-4 font-bold">Loại giá</p>
                <p className="mt-4 font-bold">Bán trọn gói</p>
              </div>
            </div>
            <Form
              form={form}
              layout="vertical"
              onFinish={(values) => {
                setFormData((prev) => ({ ...prev, ...values }));
                next();
              }}
            >
              <div className="mt-10">
                <span className="text-lg font-bold">
                  Xem lại các điều khoản và điều kiện của bạn
                </span>
                <div className="border rounded-md p-2 mt-2">
                  <Form.Item
                    name="policy"
                    rules={[
                      {
                        required: true,
                        message:
                          "Vui lòng chấp nhận điều khoản để có thể tiếp tục!",
                      },
                    ]}
                  >
                    <Checkbox.Group
                      className="font-semibold"
                      options={[
                        {
                          label:
                            "Các điều khoản và điều kiện chung áp dụng cho tất cả chỗ nghỉ của bạn được liệt kê qua VooTreeVeeVuu",
                          value: "accept",
                        },
                      ]}
                    />
                  </Form.Item>
                </div>
              </div>
            </Form>
            <div className="text-end mt-5 ">
              <Button onClick={prev} className="h-12 w-32" size="large">
                <span className="font-semibold ">TRƯỚC</span>
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className="h-12 w-32 ms-4"
                size="large"
                //  href="/partner/home"
              >
                <span className="font-semibold " onClick={complete}>
                  Hoàn thành
                </span>
              </Button>
            </div>
          </div>
        </>
      ),
    },
  ];

  return (
    <>
      <div>
        <div className="ms-96 mt-10">
          <span className="font-bold text-2xl ">Đăng ký chỗ nghỉ</span>
        </div>
        <Row style={{ height: "500px" }}>
          <Col
            span={6}
            className="justify-center flex mt-10 ps-20"
            style={{ height: "500px" }}
          >
            <Steps current={current} direction="vertical">
              {steps.map((item) => (
                <Step key={item.title} title={item.title} />
              ))}
            </Steps>
          </Col>
          <Col span={18}>
            <div className="steps-content mt-10">{steps[current].content}</div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default MultiStepForm;
