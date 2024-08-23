import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import axios from 'axios';
const url_deploy1 = "https://vootreeveevuu.up.railway.app";
const url_local = "http://localhost:8080";
const HotelStatusDoughnutChart = () => {
  // Dữ liệu mẫu cho biểu đồ
  const [chartData, setChartData] = useState({
    labels: ['ACTIVE', 'PENDING', 'INACTIVE'],
    datasets: [
      {
        label: 'Hotel Status',
        data: [0, 0, 0],
        backgroundColor: ['#36a2eb', '#ffcd56', '#ff6384'],
        hoverOffset: 4,
      },
    ],
  });

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        const response = await axios.get('${url_local}/api/hotels'); // Replace with your API endpoint
        const hotels = response.data;

        const statusCounts = hotels.reduce(
          (counts, hotel) => {
            if (hotel.status === 'ACTIVE') counts.ACTIVE += 1;
            else if (hotel.status === 'PENDING') counts.PENDING += 1;
            else if (hotel.status === 'INACTIVE') counts.INACTIVE += 1;
            return counts;
          },
          { ACTIVE: 0, PENDING: 0, INACTIVE: 0 }
        );

        setChartData({
          labels: ['ACTIVE', 'PENDING', 'INACTIVE'],
          datasets: [
            {
              label: 'Hotel Status',
              data: [statusCounts.ACTIVE, statusCounts.PENDING, statusCounts.INACTIVE],
              backgroundColor: ['#36a2eb', '#ffcd56', '#ff6384'],
              hoverOffset: 4,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching hotel data:', error);
      }
    };

    fetchHotelData();
  }, []);

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
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default HotelStatusDoughnutChart;
