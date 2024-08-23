"use client";
import { FormOutlined, SearchOutlined } from "@ant-design/icons";
import type { InputRef, TableColumnType, TableColumnsType } from "antd";
import { Button, Input, Space, Table, Tag } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import axios from "axios";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
const url_deploy1 = "https://vootreeveevuu.up.railway.app";
const url_local = "http://localhost:8080";
export default function ActiveTable() {
  const [data, setData] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const router = useRouter();
  //const router = useRouter();
  useEffect(() => {
    axios
      .get(`${url_local}/api/hotels`)
      .then((response) => {
        const fetchedData = response.data
          .filter((item: any) => item.status === "ACTIVE")
          .map((item: any, index: number) => ({
            key: item.id,
            name: item.hotelName,
            address: item.address,
            status: item.status,
            hotelStars: item.hotelStars,
            hotelDescription: item.hotelDescription,
            checkInTime: item.checkInTime,
            checkOutTime: item.checkOutTime,
            accommodationType: item.accommodationType.typeName,
          }));
        setData(fetchedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

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

  const handleEdit = (record) => {
    sessionStorage.setItem("selectedHotel", JSON.stringify(record));
    // redirect("/partner/hotel-management");
    router.push(`/partner/hotel-management`);
  };

  const columns: TableColumnsType<any> = [
    {
      title: "Index",
      dataIndex: "index",
      key: "index",
      render: (text: any, record: any, index: number) => index + 1,
      width: "7%",
    },
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
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "ACTIVE" ? "blue" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)} className="text-blue-500">
            <FormOutlined /> <span>Edit</span>
          </a>
        </Space>
      ),
    },
  ];
  return (
    <>
      <div>
        <div className="justify-center flex items-center">
          <Table
            className="w-full border shadow-md rounded-md"
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 5 }}
          />
        </div>
      </div>
    </>
  );
}
