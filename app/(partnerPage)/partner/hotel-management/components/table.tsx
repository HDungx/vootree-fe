"use client";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FormOutlined, SearchOutlined } from "@ant-design/icons";
import type { InputRef, TableColumnsType, TableColumnType } from "antd";
import { Button, Input, Space, Table, Tag } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import { log } from "console";

export default function Tables({
  onRowSelect,
  reloadTable,
}: {
  onRowSelect: (row: any) => void;
  reloadTable: boolean;
}) {
  const [data, setData] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/hotels")
      .then((response) => {
        const fetchedData = response.data
          .filter((item: any) => item.status === "ACTIVE")
          .map((item: any, index: number) => ({
            key: item.id,
            name: item.hotelName,
            address: item.address,
            city: item.city,
            hotelPhoneNum: item.hotelPhoneNum,

            status: item.status,
            hotelStars: item.hotelStars,
            hotelDescription: item.hotelDescription,
            checkInTime: item.checkInTime,
            checkOutTime: item.checkOutTime,

            accommodationType: item.accommodationType,
            hotelFacilities: item.hotelFacilities,
            userID: item.user.id,

            hotelImages:item.hotelImages
          }));

        console.log(fetchedData);

        setData(fetchedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [reloadTable]);

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: string
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex: string): TableColumnType<any> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const handleEdit = (record: any) => {
    console.log(record);

    onRowSelect(record);
  };

  const columns: TableColumnsType<any> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "30%",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      ...getColumnSearchProps("address"),
      sorter: (a, b) => a.address.length - b.address.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      ...getColumnSearchProps("status"),
      sorter: (a, b) => a.status.length - b.status.length,
      sortDirections: ["descend", "ascend"],
      render: (status: string) => (
        <Tag color={status === "ACTIVE" ? "blue" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}>
            <FormOutlined /> Edit
          </a>
        </Space>
      ),
    },
  ];
  return (
    <>
      <div>
        <div className="mb-3 mx-36 font-bold">
          Current active accommodations
        </div>
        <div className="justify-center flex items-center">
          <Table
            className="w-4/5 border shadow-md rounded-md"
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 5 }}
          />
        </div>
      </div>
    </>
  );
}
