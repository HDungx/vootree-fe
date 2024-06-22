"use client";
import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const StatisticsHotel = () => {
  const yearlyData = {
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
          label: "Hotel A",
          data: [
            10000, 14000, 12000, 15000, 16000, 17000, 14000, 13000, 15000,
            16000, 18000, 19000,
          ],
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          fill: false,
        },
        {
          label: "Hotel B",
          data: [
            9000, 12000, 10000, 13000, 14000, 15000, 12000, 11000, 13000, 14000,
            16000, 17000,
          ],
          borderColor: "rgba(54, 162, 235, 1)",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          fill: false,
        },
        {
          label: "Hotel C",
          data: [
            8000, 11000, 9000, 12000, 13000, 14000, 11000, 10000, 12000, 13000,
            15000, 16000,
          ],
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          fill: false,
        },
        {
          label: "Hotel D",
          data: [
            7000, 10000, 8000, 11000, 12000, 13000, 10000, 9000, 11000, 12000,
            14000, 15000,
          ],
          borderColor: "rgba(153, 102, 255, 1)",
          backgroundColor: "rgba(153, 102, 255, 0.2)",
          fill: false,
        },
        {
          label: "Hotel E",
          data: [
            6000, 9000, 7000, 10000, 11000, 12000, 9000, 8000, 10000, 11000,
            13000, 14000,
          ],
          borderColor: "rgba(255, 159, 64, 1)",
          backgroundColor: "rgba(255, 159, 64, 0.2)",
          fill: false,
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
          label: "Hotel A",
          data: [
            12000, 15000, 13000, 16000, 17000, 18000, 15000, 14000, 16000,
            17000, 19000, 20000,
          ],
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          fill: false,
        },
        {
          label: "Hotel B",
          data: [
            11000, 14000, 12000, 15000, 16000, 17000, 14000, 13000, 15000,
            16000, 18000, 19000,
          ],
          borderColor: "rgba(54, 162, 235, 1)",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          fill: false,
        },
        {
          label: "Hotel C",
          data: [
            10000, 13000, 11000, 14000, 15000, 16000, 13000, 12000, 14000,
            15000, 17000, 18000,
          ],
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          fill: false,
        },
        {
          label: "Hotel D",
          data: [
            9000, 12000, 10000, 13000, 14000, 15000, 12000, 11000, 13000, 14000,
            16000, 17000,
          ],
          borderColor: "rgba(153, 102, 255, 1)",
          backgroundColor: "rgba(153, 102, 255, 0.2)",
          fill: false,
        },
        {
          label: "Hotel E",
          data: [
            8000, 11000, 9000, 12000, 13000, 14000, 11000, 10000, 12000, 13000,
            15000, 16000,
          ],
          borderColor: "rgba(255, 159, 64, 1)",
          backgroundColor: "rgba(255, 159, 64, 0.2)",
          fill: false,
        },
      ],
    },
  };

  const [selectedYear, setSelectedYear] = useState("2023");

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
        text: `Monthly Revenue of 5 Hotels for the Year ${selectedYear}`,
      },
    },
  };

  return (
    <div>
      <h2 className="font-bold mt-3 m-5">Hotel Revenue Chart</h2>
      <div className=" m-5 font-medium">
        <select value={selectedYear} onChange={handleChange}>
          <option value="2022">2022</option>
          <option value="2023">2023</option>
        </select>
      </div>
      <div className="w-8/12 m-auto">
        <Line data={yearlyData[selectedYear]} options={options} />
      </div>
    </div>
  );
};

export default StatisticsHotel;
