"use client";
import React, { useState } from "react";
import "chart.js/auto";
import { Bar } from "react-chartjs-2";

const roomBookingData = {
  "Hotel A": {
    2022: {
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
      ],
      datasets: [
        {
          label: "Single Room",
          data: [30, 25, 20, 35, 40, 45, 50, 55, 60, 65, 70, 75],
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
        {
          label: "Double Room",
          data: [20, 30, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70],
          backgroundColor: "rgba(54, 162, 235, 0.5)",
        },
        {
          label: "Suite",
          data: [10, 15, 10, 15, 20, 25, 20, 25, 30, 35, 40, 45],
          backgroundColor: "rgba(255, 159, 64, 0.2)",
        },
        {
          label: "Delux",
          data: [23, 15, 27, 24, 38, 39, 39, 34, 48, 35, 59, 55],
          backgroundColor: "rgba(75, 83, 192, 0.5)",
        },
      ],
    },
    2023: {
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
      ],
      datasets: [
        {
          label: "Single Room",
          data: [40, 35, 30, 45, 50, 55, 60, 65, 70, 75, 80, 85],
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
        {
          label: "Double Room",
          data: [30, 40, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80],
          backgroundColor: "rgba(54, 162, 235, 0.5)",
        },
        {
          label: "Suite",
          data: [20, 25, 20, 25, 30, 35, 30, 35, 40, 45, 50, 55],
          backgroundColor: "rgba(255, 165, 0, 0.5)",
        },
        {
          label: "Delux",
          data: [23, 15, 27, 24, 38, 39, 39, 34, 48, 35, 59, 55],
          backgroundColor: "rgba(75, 83, 192, 0.5)",
        },
      ],
    },
  },
  "Hotel B": {
    2022: {
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
      ],
      datasets: [
        {
          label: "Single Room",
          data: [25, 20, 15, 30, 35, 40, 45, 50, 55, 60, 65, 70],
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
        {
          label: "Double Room",
          data: [15, 25, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65],
          backgroundColor: "rgba(54, 162, 235, 0.5)",
        },
        {
          label: "Suite",
          data: [8, 12, 10, 12, 15, 18, 16, 20, 22, 25, 28, 30],
          backgroundColor: "rgba(255, 165, 0, 0.5)",
        },
        {
          label: "Delux",
          data: [18, 10, 20, 17, 28, 30, 32, 29, 35, 28, 42, 38],
          backgroundColor: "rgba(75, 83, 192, 0.5)",
        },
      ],
    },
    2023: {
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
      ],
      datasets: [
        {
          label: "Single Room",
          data: [30, 25, 20, 35, 40, 45, 50, 55, 60, 65, 70, 75],
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
        {
          label: "Double Room",
          data: [20, 30, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70],
          backgroundColor: "rgba(54, 162, 235, 0.5)",
        },
        {
          label: "Suite",
          data: [12, 18, 15, 18, 22, 25, 22, 26, 30, 33, 38, 42],
          backgroundColor: "rgba(255, 165, 0, 0.5)",
        },
        {
          label: "Delux",
          data: [25, 17, 30, 28, 40, 42, 42, 38, 45, 36, 55, 50],
          backgroundColor: "rgba(75, 83, 192, 0.5)",
        },
      ],
    },
  },
};

const StatisticsRoom = () => {
  const [selectedHotel, setSelectedHotel] = useState("Hotel A");
  const [selectedYear, setSelectedYear] = useState("2023");

  const handleChangeHotel = (event) => {
    setSelectedHotel(event.target.value);
  };

  const handleChangeYear = (event) => {
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
        text: `Monthly Room Booking Statistics for ${selectedHotel} - ${selectedYear}`,
      },
    },
  };

  return (
    <div>
      <h2 className="font-bold mt-3 m-5">Room Booking Statistics</h2>
      <div className=" m-5 font-medium">
        <label>Select Hotel:</label>
        <select value={selectedHotel} onChange={handleChangeHotel}>
          <option value="Hotel A">Hotel A</option>
          <option value="Hotel B">Hotel B</option>
          {/* Thêm các khách sạn khác tương tự */}
        </select>
        <label>Select Year:</label>
        <select value={selectedYear} onChange={handleChangeYear}>
          <option value="2022">2022</option>
          <option value="2023">2023</option>
        </select>
      </div>
      <div className="w-8/12 m-auto ">
        <Bar
          data={roomBookingData[selectedHotel][selectedYear]}
          options={options}
        />
      </div>
    </div>
  );
};

export default StatisticsRoom;
