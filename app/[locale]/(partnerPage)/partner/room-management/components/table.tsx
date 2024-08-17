"use client";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FormOutlined, SearchOutlined } from "@ant-design/icons";
import type { InputRef, TableColumnsType, TableColumnType } from "antd";
import { Button, Input, Space, Table, Tag } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import { log } from "console";

// const data: DataType[] = [
//   {
//     key: "1",
//     name: "Muong Thanh Hotel",
//     address: "123 Vung Tau, xuxuna,xuxuna",
//     status: "Active",
//   },
//   {
//     key: "2",
//     name: "Muong Thanh Hotel",
//     address: "123 Vung Tau, xuxuna,xuxuna",
//     status: "Active",
//   },
//   {
//     key: "3",
//     name: "Muong Thanh Hotel",
//     address: "123 Vung Tau, xuxuna,xuxuna",
//     status: "Active",
//   },
//   {
//     key: "4",
//     name: "Muong Thanh Hotel",
//     address: "123 Vung Tau, xuxuna,xuxuna",
//     status: "Active",
//   },
// ];

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
  const url_deploy = "https://vootreeveevuu.up.railway.app";
  const url_local = "http://localhost:8080";
  useEffect(() => {
    axios
      .get(`${url_deploy}/api/rooms`)
      .then((response) => {
        const fetchedData = response.data.map((item: any, index: number) => ({
          key: item.id,
          name: item.hotelName,
          roomType: item.roomType,
          typeName: item.roomType.typeName,
          price: item.price,
          capacity: item.capacity,
          quantity: item.quantity,
          roomSize: item.roomSize,
          description: item.description,
          serveBreakfast: item.serveBreakfast,
          hotelId: item.hotelId,
          roomFacilities: item.roomFacilities,
          roomStatus: item.status,

          room_images: item.room_images,
        }));
        setData(fetchedData);
        // console.log(fetchedData);
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
      title: "Room type",
      dataIndex: "typeName",
      key: "typeName",
      ...getColumnSearchProps("typeName"),
      sorter: (a, b) => a.typeName.length - b.typeName.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(text),
      ...getColumnSearchProps("price"),
      sorter: (a, b) => parseFloat(a.price) - parseFloat(b.price),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Status",
      dataIndex: "roomStatus",
      key: "roomStatus",
      width: "10%",
      ...getColumnSearchProps("roomStatus"),
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
        <div className="mb-3 mx-32 text-base font-bold">
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
