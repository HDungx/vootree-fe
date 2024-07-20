import { DatePicker, Form, GetProps, InputNumber, Row } from "antd";
import React, { useState } from "react";
import dayjs from "dayjs";

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;
const { RangePicker } = DatePicker;
const disabledDate: RangePickerProps["disabledDate"] = (current) => {
  // Can not select days before today and today
  return current && current < dayjs().endOf("day");
};

export default function SelectedInfo({
  setDaysCount,
  setRooms,
  setGuests,
  setDayPicker,
  setFormattedEndDate,
  setFormattedStartDate,
  setCheckInDate,
  setCheckOutDate,
}) {
  const handleDatePickerChange = (dates) => {
    setDayPicker(dates);
    if (dates && dates.length === 2) {
      const startDate = dates[0];
      const endDate = dates[1];
      const count = endDate.diff(startDate, "days");
      setDaysCount(count);

      setFormattedStartDate(startDate.format("ddd, D/M/YYYY"));
      setFormattedEndDate(endDate.format("ddd, D/M/YYYY"));
      setCheckInDate(startDate.format("YYYY/MM/DD"));
      setCheckOutDate(endDate.format("YYYY/MM/DD"));
    } else {
      setDaysCount(0);
      setFormattedStartDate("");
      setFormattedEndDate("");
      setCheckInDate("");
      setCheckOutDate("");
    }
  };
  const handleRoomChange = (num) => {
    setRooms(num);
  };
  const handleGuestChange = (num) => {
    setGuests(num);
  };
  return (
    <>
      <div className="">
        <Form layout="vertical">
          <Row gutter={24} className="gap-10">
            <Form.Item
              name="dateRange"
              label="Chọn ngày nhận/trả phòng"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn ngày nhận/trả phòng!",
                },
              ]}
            >
              <RangePicker
                size="large"
                className=" text-xl"
                disabledDate={disabledDate}
                onChange={handleDatePickerChange}
              />
            </Form.Item>
            <Form.Item name="numOfRoom" label="Số lượng phòng">
              <InputNumber
                size="large"
                defaultValue={1}
                min={1}
                max={20}
                className="w-32"
                onChange={handleRoomChange}
              />
            </Form.Item>
            <Form.Item name="numOfGuest" label="Số lượng khách">
              <InputNumber
                size="large"
                defaultValue={2}
                min={2}
                max={40}
                className="w-32"
                onChange={handleGuestChange}
              />
            </Form.Item>
          </Row>
        </Form>
      </div>
    </>
  );
}
