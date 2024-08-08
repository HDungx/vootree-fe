import { CustomJWT } from "@/utils/jwtCustom";
import { CheckCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Collapse,
  Form,
  Input,
  Modal,
  Pagination,
  Rate,
  message,
} from "antd";
import FormItem from "antd/es/form/FormItem";
import axios from "axios";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
const { TextArea } = Input;
export default function HistoryBooking() {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [userId, setUserId] = useState(null);
  const [hotelId, setHotelId] = useState(null);
  const [bookingId, setBookingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 4;

  useEffect(() => {
    const token = localStorage.getItem("token"); // Thay thế bằng phương thức lưu trữ token của bạn

    if (token) {
      try {
        const decoded = jwtDecode<CustomJWT>(token);
        const userId = decoded?.id; // Điều chỉnh theo cấu trúc của JWT của bạn
        setUserId(userId);

        const fetchData = async () => {
          try {
            const response = await axios.get(
              `http://localhost:8080/api/bookings/${userId}/booking-history`
            );
            setBookings(response.data);
            setHotelId(response.data.hotelId);
            //setBookingId(response.data.id);
          } catch (error) {
            console.error("Có lỗi xảy ra khi lấy dữ liệu đặt phòng!", error);
          }
        };

        fetchData();
      } catch (error) {
        console.error("Token không hợp lệ");
      }
    } else {
      console.error("Không tìm thấy token");
    }
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Tính toán các thẻ sẽ hiển thị trên trang hiện tại
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentBookings = bookings.slice(indexOfFirstCard, indexOfLastCard);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const showModal = (hotelId, id) => {
    setHotelId(hotelId);
    setBookingId(id);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = (values) => {
    // Xử lý khi submit form
    const toDay = dayjs().format("YYYY-MM-DD");
    form
      .validateFields()
      .then(async (values) => {
        const submitValues = { ...values, hotelId, toDay, userId, bookingId };
        try {
          const response = await axios.post(
            "http://localhost:8080/api/ratings",
            submitValues
          );
          console.log(values);

          if (response.status === 200) {
            message.success("Đánh giá thành công!");
            const changeReviewStatus = axios.put(
              `http://localhost:8080/api/bookings/update/review-status/${bookingId}`
            );
          }
        } catch (error) {
          message.error("Thêm thất bại!");
        }
        console.log(submitValues);

        console.log("Received values from form:", values);
        // Thực hiện các xử lý tiếp theo, ví dụ như gửi dữ liệu lên server
        setIsModalOpen(false); // Đóng Modal sau khi xử lý xong
      })
      .catch((errorInfo) => {
        console.log("Validation failed:", errorInfo);
      });
    // Đóng Modal
    //setIsModalOpen(false);
  };
  return (
    <div>
      <div className="grid grid-cols-1 gap-4">
        {currentBookings.map((booking) => {
          const {
            id,
            hotelName,
            checkInDate,
            checkOutDate,
            numOfGuest,
            numOfRoom,
            totalPrice,
            hotelId,
            roomType,
            bookingDate,
            reviewStatus,
          } = booking;
          const currentDate = dayjs();
          return (
            <>
              <Collapse
                key={id}
                items={[
                  {
                    showArrow: false,
                    key: "1",
                    label: (
                      <div className="p-2 flex">
                        <div className="w-6/12">
                          <span className="text-lg text-sky-500">
                            {hotelName}
                          </span>
                          <p className="font-semibold mb-2">
                            Loại phòng:{" "}
                            <span className="text-blue-500">{roomType}</span>
                          </p>
                        </div>
                        <div className="w-6/12 text-end font-semibold">
                          <p className="text-sky-500">
                            {dayjs(bookingDate).format("DD-MM-YYYY")}
                          </p>
                          <div>
                            {currentDate.isAfter(dayjs(checkInDate)) && (
                              <div>
                                {reviewStatus === false ? (
                                  <Button
                                    type="link"
                                    onClick={() => showModal(hotelId, id)}
                                  >
                                    Review
                                  </Button>
                                ) : (
                                  <div className="mt-2">
                                    <span className="text-green-700 mt-2">
                                      <CheckCircleOutlined /> Reviewed
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ),
                    children: (
                      <div className="font-semibold">
                        <div>
                          <div>
                            <span>Ngày nhận/trả phòng:</span>{" "}
                            <span className="text-sky-500">
                              {dayjs(checkInDate).format("DD-MM-YYYY")} /{" "}
                              {dayjs(checkOutDate).format("DD-MM-YYYY")}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <span>Số người/phòng:</span>{" "}
                          <span className="text-sky-500">
                            {numOfGuest} Người / {numOfRoom} Phòng
                          </span>
                        </div>
                        <div className="mt-2">
                          <span>Tổng giá:</span>{" "}
                          <span className="text-sky-500 font-bold">
                            {formatPrice(totalPrice)}
                          </span>
                        </div>
                      </div>
                    ),
                  },
                ]}
              />
              <Modal
                //key={id}
                title={`Đánh giá khách sạn`}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                  <Button key="cancel" onClick={handleCancel}>
                    Hủy
                  </Button>,
                  <Button key="submit" type="primary" onClick={onFinish}>
                    Gửi đánh giá
                  </Button>,
                ]}
              >
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={onFinish}
                  initialValues={{ bookingId: id, hotelId: hotelId }}
                >
                  <FormItem
                    className="mt-5"
                    name="rate"
                    //  initialValue={defaultRateValue} // Giá trị mặc định cho Rate
                    rules={[
                      {
                        required: true,
                        message: "Hãy đánh giá chúng tôi theo thang điểm!",
                      },
                    ]}
                  >
                    <Rate
                      count={10}
                      character={({ index = 0 }) => index + 1}
                      className="text-sky-500"
                    />
                  </FormItem>
                  <FormItem
                    name="comment"
                    label="Nhận xét"
                    rules={[
                      {
                        required: true,
                        message: "Hãy nhập nhận xét!",
                      },
                    ]}
                  >
                    <TextArea rows={5} showCount maxLength={255} />
                  </FormItem>
                </Form>
              </Modal>
            </>
          );
        })}
      </div>
      <Pagination
        current={currentPage}
        pageSize={cardsPerPage}
        total={bookings.length}
        onChange={handlePageChange}
        style={{ textAlign: "center", marginTop: "20px" }}
      />
    </div>
  );
}
