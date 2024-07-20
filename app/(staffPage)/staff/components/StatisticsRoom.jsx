
import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const roomBookingData = {
  2022: {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'Single Room',
        data: [30, 25, 20, 35, 40, 45, 50, 55, 60, 65, 70, 75],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Double Room',
        data: [20, 30, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
      {
        label: 'Suite',
        data: [10, 15, 10, 15, 20, 25, 20, 25, 30, 35, 40, 45],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: 'Delux',
        data: [23, 15, 27, 24, 38, 39, 39, 34, 48, 35, 59, 55],
        backgroundColor: 'rgba(75, 83, 192, 0.5)',
      },
    ],
  },
  2023: {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'Single Room',
        data: [40, 35, 30, 45, 50, 55, 60, 65, 70, 75, 80, 85],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Double Room',
        data: [30, 40, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
      {
        label: 'Suite',
        data: [20, 25, 20, 25, 30, 35, 30, 35, 40, 45, 50, 55],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: 'Delux',
        data: [23, 15, 27, 24, 38, 39, 39, 34, 48, 35, 59, 55],
        backgroundColor: 'rgba(75, 83, 192, 0.5)',
      },
    ],
  },
};

const StatisticsRoom = () => {
  const [selectedYear, setSelectedYear] = useState('2023');

  const handleChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Monthly Room Booking Statistics for the Year ${selectedYear}`,
      },
    },
  };

  return (
    <div>
      <h2>Room Booking Statistics</h2>
      <select value={selectedYear} onChange={handleChange}>
        <option value="2022">2022</option>
        <option value="2023">2023</option>
      </select>
      <div className='w-10/12 m-auto'>
      <Bar data={roomBookingData[selectedYear]} options={options} />
      </div>
      
    </div>
  );
};

export default StatisticsRoom;
