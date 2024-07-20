import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';

// Dữ liệu mẫu cho tổng doanh thu theo từng tháng trong các năm
const revenueData = {
  2022: [12000, 15000, 13000, 16000, 17000, 18000, 15000, 14000, 16000, 17000, 19000, 20000],
  2023: [14000, 16000, 15000, 18000, 19000, 20000, 17000, 16000, 18000, 19000, 21000, 22000],
  // Thêm các năm khác và dữ liệu tương ứng
};

const StatisticsRevenue = () => {
  const [selectedYear, setSelectedYear] = useState('2023'); // Năm mặc định ban đầu là 2023

  const handleChangeYear = (event) => {
    setSelectedYear(event.target.value);
  };

  // Dữ liệu cho biểu đồ
  const chartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'Monthly Revenue',
        data: revenueData[selectedYear],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
    ],
  };

  // Cấu hình biểu đồ
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `Total Revenue per Month in ${selectedYear}`,
      },
    },
  };

  return (
    <div>
      <h2>Total Revenue Statistics</h2>
      <div>
        <label>Select Year:</label>
        <select value={selectedYear} onChange={handleChangeYear}>
          <option value="2022">2022</option>
          <option value="2023">2023</option>
          {/* Thêm các năm khác tương tự */}
        </select>
      </div>
      <div className='w-full'>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default StatisticsRevenue;
