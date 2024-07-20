import React from "react";
import StatisticsHotel from "./components/StatisticsHotel";
import StatisticsRoom from "./components/StatisticsRoom";
export default function page() {
  return (
    <div>
      <div>
        <StatisticsHotel />
      </div>
      <br />
      <hr />
      <div>
        <StatisticsRoom />
      </div>
      <br />
    </div>
  );
}
