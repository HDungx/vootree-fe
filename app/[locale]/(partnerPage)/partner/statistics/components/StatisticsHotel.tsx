"use client";
import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "chart.js/auto";
const url_deploy1 = "https://vootreeveevuu.up.railway.app";
const url_local = "http://localhost:8080";
const StatisticsHotel = () => {
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedHotel, setSelectedHotel] = useState("");
  const [roomBookingData, setRoomBookingData] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found");
        }

        // Giải mã token để lấy decodeJWT.id
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;

        // Gọi API để lấy toàn bộ danh sách khách sạn
        const response = await axios.get(`${url_local}/api/hotels`);
        const hotels = response.data;

        // Lọc danh sách khách sạn dựa trên userId
        const filteredHotels = hotels.filter(
          (hotel) => hotel.user.id === userId
        );
        setHotels(filteredHotels);

        // Set selectedHotel to the first hotel if available
        if (filteredHotels.length > 0 && !selectedHotel) {
          setSelectedHotel(filteredHotels[0].hotelName);
        }
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    };

    fetchHotels();
  }, []); // Fetch hotels on component mount

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found");
        }

        // Giải mã token để lấy decodeJWT.id
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;

        const response = await axios.get(`${url_local}/api/bookings`);
        const bookings = response.data;

        // Lọc danh sách đặt phòng theo hotelOwnerId và selectedHotel
        const filteredBookings = bookings.filter(
          (booking) =>
            booking.hotelOwnerId === userId &&
            booking.hotelName === selectedHotel
        );

        // Get distinct years from booking dates
        const years = [
          ...new Set(
            filteredBookings.map((booking) =>
              new Date(booking.bookingDate).getFullYear()
            )
          ),
        ].sort();
        setAvailableYears(years);

        // Set selectedYear to current year if availableYears is set and selectedYear is not already set
        if (years.length > 0 && !selectedYear) {
          setSelectedYear(new Date().getUTCFullYear().toString());
        }

        // Initialize room booking data structure
        const roomData = {};

        // Loop through bookings and populate roomData with total revenue per month
        filteredBookings.forEach((booking) => {
          const bookingDate = new Date(booking.bookingDate);
          const bookingYear = bookingDate.getFullYear();
          const bookingMonth = bookingDate.getMonth(); // Month is zero-indexed
          const bookingPrice = booking.totalPrice; // Price of the booking

          // Ensure the booking is within the selected year
          if (bookingYear.toString() === selectedYear) {
            if (!roomData[bookingYear]) {
              roomData[bookingYear] = {
                labels: [
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ], // Labels for months
                datasets: [
                  { label: "Total Revenue", data: new Array(12).fill(0) },
                ],
              };
            }

            // Increment the total revenue for the corresponding month
            roomData[bookingYear].datasets[0].data[bookingMonth] +=
              bookingPrice;
          }
        });

        // Update state with the processed room data
        setRoomBookingData(roomData);
      } catch (error) {
        console.error("Error fetching booking data:", error);
      }
    };

    fetchBookingData();
  }, [selectedYear, selectedHotel]); // Fetch data when selectedYear or selectedHotel changes

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleHotelChange = (event) => {
    setSelectedHotel(event.target.value);
    setSelectedYear(""); // Reset selectedYear when changing hotel
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Monthly Room Booking Revenue for the Year ${selectedYear}`,
      },
    },
  };

  if (!roomBookingData) return <p>Loading...</p>; // Show loading message while data is fetching

  return (
    <div>
      <h2 className="font-semibold text-2xl text-center text-blue-900">
        Room Booking Statistics
      </h2>
      <br />
      <div>
        <label htmlFor="hotel-select" className="font-semibold text-lg">
          Select Hotel :
        </label>
        <select
          id="hotel-select"
          value={selectedHotel}
          onChange={handleHotelChange}
          style={{
            width: "50%",
            padding: "5px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            fontSize: "15px",
            margin: "5px",
          }}
        >
          {hotels.map((hotel) => (
            <option key={hotel.id} value={hotel.hotelName}>
              {hotel.hotelName}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="year-select" className="font-semibold text-lg">
          Select Year :
        </label>
        <select
          id="year-select"
          value={selectedYear}
          onChange={handleYearChange}
          style={{
            padding: "5px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            fontSize: "15px",
            margin: "15px",
          }}
        >
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      {roomBookingData[selectedYear] ? (
        <div className="w-9/12 m-auto">
          <Line data={roomBookingData[selectedYear]} options={options} />
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          <p>No data available for the selected year</p>
        </div>
      )}
    </div>
  );
};

export default StatisticsHotel;
