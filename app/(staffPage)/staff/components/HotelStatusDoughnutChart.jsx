import React from 'react';
import { Doughnut } from 'react-chartjs-2';

const HotelStatusDoughnutChart = () => {
  // Dữ liệu mẫu cho biểu đồ
  const data = {
    labels: ['ACTIVE', 'PENDING', 'INACTIVE'],
    datasets: [
      {
        label: 'Hotel Status',
        data: [15, 10, 5], // Số lượng khách sạn tương ứng với từng trạng thái
        backgroundColor: ['#36a2eb', '#ffcd56', '#ff6384'],
        hoverOffset: 4,
      },
    ],
  };

  // Cấu hình biểu đồ
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Hotel Status Overview',
      },
    },
  };

  return (
    <div className='w-6/12 m-auto'>
      <h2 className='flex justify-center items-center'>Hotel Status Doughnut Chart</h2>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default HotelStatusDoughnutChart;
