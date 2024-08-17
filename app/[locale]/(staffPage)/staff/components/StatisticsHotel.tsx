// RevenueChart.js
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import { Select, Spin } from "antd";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const { Option } = Select;
const url_deploy = "https://vootreeveevuu.up.railway.app";
const url_local = "http://localhost:8080";
const StatisticsHotel = () => {
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState({});
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [availableYears, setAvailableYears] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so add 1
    const currentYear = String(currentDate.getFullYear());

    setSelectedMonth(currentMonth);
    setSelectedYear(currentYear);

    axios
      .get(`${url_deploy}/api/bookings`)
      .then((response) => {
        const fetchedData = response.data || [];
        setData(fetchedData);

        const years = Array.from(
          new Set(fetchedData.map((item) => item.bookingDate.slice(0, 4)))
        );
        setAvailableYears(years);

        if (!years.includes(currentYear) && years.length > 0) {
          setSelectedYear(years[0]);
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedYear && data.length > 0) {
      const filteredData = data.filter((item) =>
        item.bookingDate.startsWith(`${selectedYear}-${selectedMonth}`)
      );

      const revenueByHotel = filteredData.reduce((acc, booking) => {
        acc[booking.hotelName] =
          (acc[booking.hotelName] || 0) + booking.totalPrice;
        return acc;
      }, {});

      console.log(revenueByHotel);
      const sortedHotels = Object.entries(revenueByHotel)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

      setChartData({
        labels: sortedHotels.map((item) => item[0]),
        datasets: [
          {
            label: "Total Revenue",
            data: sortedHotels.map((item) => item[1]),
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      });
    } else {
      setChartData({
        labels: [],
        datasets: [],
      });
    }
  }, [data, selectedMonth, selectedYear]);

  return (
    <div>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        Month:
        <Select
          value={selectedMonth}
          onChange={(value) => setSelectedMonth(value)}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <Option key={i + 1} value={String(i + 1).padStart(2, "0")}>
              {i + 1}
            </Option>
          ))}
        </Select>
        Year:
        <Select
          value={selectedYear}
          onChange={(value) => setSelectedYear(value)}
        >
          {availableYears.map((year) => (
            <Option key={year} value={year}>
              {year}
            </Option>
          ))}
        </Select>
      </div>
      {loading ? (
        <Spin tip="Loading data..." />
      ) : chartData.labels.length > 0 ? (
        <Bar
          className="w-10/12 m-auto"
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
              title: {
                display: true,
                text: "Top 10 Hotels by Revenue",
              },
            },
            scales: {
              y: {
                title: {
                  display: true,
                  text: "Total Revenue",
                },
              },
              x: {
                title: {
                  display: true,
                  text: "Hotel Name",
                },
              },
            },
          }}
        />
      ) : (
        <p>No data available for the selected month and year.</p>
      )}
    </div>
  );
};

export default StatisticsHotel;
