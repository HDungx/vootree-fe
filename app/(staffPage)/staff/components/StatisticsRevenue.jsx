import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

const StatisticsRevenue = () => {
  const [selectedYear, setSelectedYear] = useState('');
  const [chartData, setChartData] = useState({
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'Monthly Revenue',
        data: [],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
    ],
  });
  const [years, setYears] = useState([]);

  const fetchRevenueData = async (year) => {
    try {
      const response = await axios.get('http://localhost:8080/api/bookings');
      const bookings = response.data;

      // Filter bookings to include only those with status 'PAID'
      const paidBookings = bookings.filter(booking => booking.status === 'PAID');

      // Extract unique years from the bookings
      const uniqueYears = Array.from(new Set(paidBookings.map(booking => new Date(booking.bookingDate).getFullYear())));
      setYears(uniqueYears);

      // Set the default selected year if it's not already set
      if (!selectedYear && uniqueYears.length > 0) {
        setSelectedYear(uniqueYears[0]);
        year = uniqueYears[0]; // Use the first year as the default
      }

      if (year) {
        // Process bookings to calculate monthly revenue for the selected year
        const monthlyRevenue = Array(12).fill(0);
        paidBookings.forEach(booking => {
          const bookingYear = new Date(booking.bookingDate).getFullYear();
          if (bookingYear === parseInt(year)) {
            const bookingMonth = new Date(booking.bookingDate).getMonth();
            monthlyRevenue[bookingMonth] += booking.totalPrice;
          }
        });

        setChartData({
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
          datasets: [
            {
              label: 'Monthly Revenue',
              data: monthlyRevenue,
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
            },
          ],
        });
      }
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    }
  };

  useEffect(() => {
    fetchRevenueData(selectedYear);
  }, [selectedYear]);

  const handleChangeYear = (event) => {
    setSelectedYear(event.target.value);
  };

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
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
      <div className='w-10/12 m-auto'>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default StatisticsRevenue;
