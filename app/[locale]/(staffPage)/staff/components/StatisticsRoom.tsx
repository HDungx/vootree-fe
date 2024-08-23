import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import "chart.js/auto";
const url_deploy1 = "https://vootreeveevuu.up.railway.app";
const url_local = "http://localhost:8080";
const StatisticsRoom = () => {
  const [selectedYear, setSelectedYear] = useState("");
  const [roomBookingData, setRoomBookingData] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await axios.get(`${url_local}/api/bookings`);
        const bookings = response.data;

        // Get distinct years from booking dates
        const years = [
          ...new Set(
            bookings.map((booking) =>
              new Date(booking.bookingDate).getFullYear()
            )
          ),
        ].sort();
        setAvailableYears(years);

        // Set selectedYear to current year if availableYears is set and selectedYear is not already set
        if (years.length > 0 && !selectedYear) {
          setSelectedYear(new Date().getUTCFullYear().toString());
        }

        // Get distinct room types from bookings
        const types = [...new Set(bookings.map((booking) => booking.roomType))];
        setRoomTypes(types);

        // Initialize room booking data structure
        const roomData = {};

        // Loop through bookings and populate roomData
        bookings.forEach((booking) => {
          const bookingDate = new Date(booking.bookingDate);
          const bookingYear = bookingDate.getFullYear();
          const bookingMonth = bookingDate.getMonth(); // Month is zero-indexed

          // Ensure the booking is within the selected year
          if (bookingYear === parseInt(selectedYear)) {
            if (!roomData[bookingYear]) {
              roomData[bookingYear] = {
                labels: Array.from({ length: 12 }, (_, index) => index + 1), // Labels for months
                datasets: types.map((type) => ({
                  label: type,
                  data: new Array(12).fill(0),
                })),
              };
            }

            // Increment the count for the corresponding room type and month
            const roomTypeIndex = types.indexOf(booking.roomType);
            if (roomTypeIndex !== -1) {
              roomData[bookingYear].datasets[roomTypeIndex].data[
                bookingMonth
              ]++;
            }
          }
        });

        // Update state with the processed room data
        setRoomBookingData(roomData);
      } catch (error) {
        console.error("Error fetching booking data:", error);
      }
    };

    fetchBookingData();
  }, [selectedYear]); // Fetch data when selectedYear changes

  const handleChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Monthly Room Booking Statistics for the Year ${selectedYear}`,
      },
    },
    scales: {
      y: {
        suggestedMin: 0, // Để trục y bắt đầu từ 0
        beginAtZero: true, // Đảm bảo bắt đầu từ 0 nếu không có dữ liệu
        ticks: {
          stepSize: 1, // Đặt bước là 1 để chỉ hiển thị số nguyên trên trục y
          precision: 0, // Số chữ số thập phân sẽ được hiển thị là 0
        },
      },
    },
  };

  if (!roomBookingData) return <p>Loading...</p>; // Show loading message while data is fetching

  return (
    <div>
      <h2>Room Booking Statistics</h2>
      <select value={selectedYear} onChange={handleChange}>
        {availableYears.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      {roomBookingData[selectedYear] ? (
        <div className="w-10/12 m-auto">
          <Bar data={roomBookingData[selectedYear]} options={options} />
        </div>
      ) : (
        <p>No data available for the selected year</p>
      )}
    </div>
  );
};

export default StatisticsRoom;
