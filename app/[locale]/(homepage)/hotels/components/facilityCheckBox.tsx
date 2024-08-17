import { Checkbox } from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";

type FacilityCheckBoxProps = {
  setCheckedValues: (checkedValues: any[]) => void;
};
const url_deploy = "https://vootreeveevuu.up.railway.app";
const url_local = "http://localhost:8080";
export default function FacilityCheckBox({
  setCheckedValues,
}: FacilityCheckBoxProps) {
  const [data, setData] = useState<{ key: string; label: string; value: string }[]>([]);

  const CheckboxGroup = Checkbox.Group;

  useEffect(() => {
    axios
      .get(`${url_deploy}/api/facilities`)
      .then((response) => {
        const fetchedData = response.data.map((item: any) => ({
          key: item.facId,
          label: item.facName, // sử dụng 'label' cho Checkbox options
          value: item.facId, // sử dụng 'value' cho Checkbox options
        }));
        setData(fetchedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const onChange = (checkedValues: any[]) => {
    setCheckedValues(checkedValues);
  };

  return (
    <div className="border p-4 rounded-md shadow-md mt-4">
      <div className="mb-2">
        <strong>Loại tiện ích</strong>
      </div>
      <CheckboxGroup
        onChange={onChange}
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          marginBottom: "10px",
        }}
      >
        {data.map((item) => (
          <Checkbox key={item.key} value={item.value}>
            {item.label}
          </Checkbox>
        ))}
      </CheckboxGroup>
    </div>
  );
}
