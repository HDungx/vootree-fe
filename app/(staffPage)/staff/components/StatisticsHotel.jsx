import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';

const hotelData = {
  '2022-01': [
    { province: 'Ho Chi Minh City', bookings: 140 },
    { province: 'Hanoi', bookings: 110 },
    { province: 'Da Nang', bookings: 90 },
    { province: 'Quang Ninh', bookings: 80 },
    { province: 'Khanh Hoa', bookings: 75 },
    { province: 'Lam Dong', bookings: 70 },
    { province: 'Can Tho', bookings: 65 },
    { province: 'Binh Thuan', bookings: 60 },
    { province: 'Ba Ria - Vung Tau', bookings: 55 },
    { province: 'Thua Thien Hue', bookings: 50 },
  ],
  '2022-02': [
    { province: 'Ho Chi Minh City', bookings: 150 },
    { province: 'Hanoi', bookings: 120 },
    { province: 'Da Nang', bookings: 100 },
    { province: 'Quang Ninh', bookings: 90 },
    { province: 'Khanh Hoa', bookings: 85 },
    { province: 'Lam Dong', bookings: 80 },
    { province: 'Can Tho', bookings: 75 },
    { province: 'Binh Thuan', bookings: 70 },
    { province: 'Ba Ria - Vung Tau', bookings: 65 },
    { province: 'Thua Thien Hue', bookings: 60 },
  ],
  '2023-01': [
    { province: 'Ho Chi Minh City', bookings: 150 },
    { province: 'Hanoi', bookings: 120 },
    { province: 'Da Nang', bookings: 100 },
    { province: 'Quang Ninh', bookings: 90 },
    { province: 'Khanh Hoa', bookings: 85 },
    { province: 'Lam Dong', bookings: 80 },
    { province: 'Can Tho', bookings: 75 },
    { province: 'Binh Thuan', bookings: 70 },
    { province: 'Ba Ria - Vung Tau', bookings: 65 },
    { province: 'Thua Thien Hue', bookings: 60 },
  ],
  '2023-02': [
    { province: 'Ho Chi Minh City', bookings: 160 },
    { province: 'Hanoi', bookings: 130 },
    { province: 'Da Nang', bookings: 110 },
    { province: 'Quang Ninh', bookings: 95 },
    { province: 'Khanh Hoa', bookings: 90 },
    { province: 'Lam Dong', bookings: 85 },
    { province: 'Can Tho', bookings: 80 },
    { province: 'Binh Thuan', bookings: 75 },
    { province: 'Ba Ria - Vung Tau', bookings: 70 },
    { province: 'Thua Thien Hue', bookings: 65 },
  ],
  // Các tháng và năm khác có thể thêm vào tương tự
};

const StatisticsHotel = () => {
  const [selectedMonth, setSelectedMonth] = useState('01');
  const [selectedYear, setSelectedYear] = useState('2023');

  const handleChangeMonth = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleChangeYear = (event) => {
    setSelectedYear(event.target.value);
  };

  // Lọc dữ liệu cho tháng và năm đã chọn
  const filteredData = hotelData[`${selectedYear}-${selectedMonth}`];

  // Sắp xếp dữ liệu theo số lượng đặt phòng giảm dần và lấy top 10
  const topProvinces = filteredData
    ? filteredData
        .sort((a, b) => b.bookings - a.bookings)
        .slice(0, 10)
        .map((item) => item.province)
    : [];

  // Dữ liệu cho biểu đồ
  const chartData = {
    labels: topProvinces,
    datasets: [
      {
        label: 'Bookings',
        data: filteredData ? filteredData.map((item) => item.bookings) : [],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
          
      },
    ],
  };

  // Cấu hình biểu đồ
  const options = {
    indexAxis: 'x',
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `Top 10 Provinces with Most Hotel Bookings - ${selectedMonth}/${selectedYear}`,
      },
    },
  };

  return (
    <div>
      <h1>Hotel Booking Statistics</h1>
      <div>
        <label>Select Month:</label>
        <select value={selectedMonth} onChange={handleChangeMonth}>
          <option value="01">January</option>
          <option value="02">February</option>
          {/* Thêm các tháng khác tương tự */}
        </select>
        <label>Select Year:</label>
        <select value={selectedYear} onChange={handleChangeYear}>
          <option value="2022">2022</option>
          <option value="2023">2023</option>
          {/* Thêm các năm khác tương tự */}
        </select>
      </div>
      <div className='w-10/12 m-auto'>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default StatisticsHotel;
