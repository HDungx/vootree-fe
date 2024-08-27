import React, { useRef, useState, useEffect } from "react";
import {
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Table,
  Typography,
  Select,
  Button,
  Space,
  Tag,
  message,
  InputRef,
} from "antd";

import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import { TrashIcon } from "@heroicons/react/24/outline";
import { FilterDropdownProps, SortOrder } from "antd/es/table/interface";
import { jwtDecode } from "jwt-decode";
import { CustomJWT } from "@/utils/jwtCustom";
const url_deploy1 = "https://vootreeveevuu.up.railway.app";
const url_local = "http://localhost:8080";
const deleteRow = async (id) => {
  try {
    await axios.delete(`/api/data/${id}`);
    message.success("Row deleted successfully");
    //fetchData(); // Refresh data after delete
  } catch (error) {
    message.error("Error deleting row");
    console.error("Error deleting data", error);
  }
};
const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}: {
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: string;
  record: any;
  index: number;
  children: React.ReactNode;
}) => {
  // const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

  let inputNode;
  if (inputType === "number") {
    inputNode = <InputNumber />;
  } else if (dataIndex === "status") {
    inputNode = (
      <Select>
        <Select.Option value="ACTIVE">ACTIVE</Select.Option>
        <Select.Option value="PENDING">PENDING</Select.Option>
      </Select>
    );
  } else {
    inputNode = <Input />;
  }
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const PendingTable = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [roomsData, setRoomsData] = useState({});
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decode = jwtDecode<CustomJWT>(token);
        const id = decode.id;
        const response = await axios.get(`${url_local}/api/hotels`);
        const fetchedData = response.data
          .filter((item) => item.status === "PENDING" && item?.user?.id === id)  // Lọc chỉ giữ lại các khách sạn có trạng thái là "active"
          .map((item: { id: { toString: () => any } }) => ({
            key: item.id.toString(),
            ...item,
          }));
        setData(fetchedData);
        // console.log(fetchedData);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  // Fetch room data from API
  const fetchRoomData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decode = jwtDecode<CustomJWT>(token);
        const id = decode.id;
        const response = await axios.get(`${url_local}/api/rooms`);
        // const filteredData = response.data.filter((item) =>item)
        const fetchedRoomData = response.data.reduce(
          (
            acc: {
              [x: string]: {
                key: any;
                roomNumber: any;
                roomType: any;
                price: any;
                capacity: any;
                quantity: any;
                roomSize: any;
              }[];
            },
            room: {
              hotelId: { toString: () => any };
              id: { toString: () => any };
              roomType: { typeName: any };
              price: any;
              capacity: any;
              quantity: any;
              roomSize: any;
            }
          ) => {
            const hotelId = room.hotelId.toString();
            if (!acc[hotelId]) {
              acc[hotelId] = [];
            }
            acc[hotelId].push({
              key: room.id.toString(),
              roomNumber: room.id,
              roomType: room.roomType.typeName,
              price: room.price,
              capacity: room.capacity,
              quantity: room.quantity,
              roomSize: room.roomSize,
            });

            return acc;
          },
          {}
        );
        setRoomsData(fetchedRoomData);
        // console.log( fetchedRoomData);
      }
    } catch (error) {
      console.error("Error fetching room data: ", error);
    }
  };

  const deleteRow = async (id) => {
    try {
      await axios.delete(`${url_local}/api/hotels/${id}`);
      message.success("Row deleted successfully");
      fetchData(); // Refresh data after delete
    } catch (error) {
      message.error("Error deleting row");
      console.error("Error deleting data", error);
    }
  };
  useEffect(() => {
    // Fetch hotels data from API

    fetchData();
    fetchRoomData();
  }, []);

  const isEditing = (record: { key: string }) => record.key === editingKey;
  const edit = (record: { key: React.SetStateAction<string> }) => {
    form.setFieldsValue({
      hotelName: "",
      address: "",
      city: "",
      hotelStars: "",
      hotelPhoneNum: "",
      checkInTime: "",
      checkOutTime: "",
      status: "",
      ...record,
    });
    setEditingKey(record.key);
  };
  const cancel = () => {
    setEditingKey("");
  };
  const save = async (key: any) => {
    try {
      const row1 = await form.validateFields();
      const row = { ...row1, id: key };
      console.log(row);
      console.log(
        `Saving data for key ${key} to:`,
        `${url_local}/api/hotels/staff/update/${key}`
      );
      await axios.put(
        `${url_local}/api/hotels/staff/update/${key}`,
        row
      );
      const newData = [...data].filter(
        (item: any) => item?.status === "PENDING"
      ) as any;
      const index = newData.findIndex((item: any) => key === item?.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  // search filter
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const handleSearch = (
    selectedKeys: React.SetStateAction<string>[],
    confirm: () => void,
    dataIndex: React.SetStateAction<string>
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex: string) => ({
    filterDropdown:
      (props: FilterDropdownProps) =>
        ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) =>
        (
          <div
            style={{
              padding: 8,
            }}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <Input
              ref={searchInput}
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() =>
                handleSearch(selectedKeys, confirm, dataIndex)
              }
              style={{
                marginBottom: 8,
                display: "block",
              }}
            />
            <Space>
              <Button
                type="primary"
                onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                icon={<SearchOutlined />}
                size="small"
                style={{
                  width: 90,
                }}
              >
                Search
              </Button>
              <Button
                onClick={() => clearFilters && handleReset(clearFilters)}
                size="small"
                style={{
                  width: 90,
                }}
              >
                Reset
              </Button>
              <Button
                type="link"
                size="small"
                onClick={() => {
                  confirm({
                    closeDropdown: false,
                  });
                  setSearchText(selectedKeys[0]);
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
    filterIcon: (filtered: any) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (
      value: string,
      record: { [x: string]: { toString: () => string } }
    ) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible: any) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  //set columns
  const columns = [
    {
      title: "Index",
      dataIndex: "index",
      key: "index",
      render: (text: any, record: any, index: number) => index + 1,
      width: "7%",
    },
    {
      title: "Hotel Name",
      dataIndex: "hotelName",
      width: "20%",
      editable: false,
      ...getColumnSearchProps("hotelName"),
    },
    {
      title: "City",
      dataIndex: "city",
      width: "15%",
      editable: false,
      ...getColumnSearchProps("city"),
    },
    {
      title: "Stars",
      dataIndex: "hotelStars",
      width: "5%",
      editable: false,
      sorter: (a: { hotelStars: number }, b: { hotelStars: number }) =>
        a.hotelStars - b.hotelStars,
      sortDirections: ["descend", "ascend"] as SortOrder[],
    },
    {
      title: "Check In Time",
      dataIndex: "checkInTime",
      width: "13%",
      editable: false,
    },
    {
      title: "Check Out Time",
      dataIndex: "checkOutTime",
      width: "13%",
      editable: false,
    },

    {
      title: "Status",
      dataIndex: "status",
      width: "10%",
      render: (status: string) => (
        <Tag color={status === "PENDING" ? "purple" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "",
      dataIndex: "operation",
      render: (text, record) => (
        <Popconfirm
          title="Are you sure to delete this row?"
          onConfirm={() => deleteRow(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="link" danger>
            <TrashIcon className="text-orange-600 h-4 w-4" />
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: any) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const clearFiltersAndSorters = () => {
    // Xóa tất cả các filters
    setSearchText("");
    setSearchedColumn("");

    // Xóa tất cả các sorters
    // Cập nhật lại state của data để hiển thị lại dữ liệu gốc
    // Lấy dữ liệu gốc
    // let newData = [...originData];

    // // Cập nhật lại state của data để hiển thị lại dữ liệu gốc
    // setData(newData);
    // console.log(newData);
  };
  const expandedRowRender = (record: { key: string | number }) => {
    const columns = [
      // {
      //   title: "Số phòng",
      //   dataIndex: "roomNumber",
      //   key: "roomNumber",
      // },
      {
        title: "Loại phòng",
        dataIndex: "roomType",
        key: "roomType",
      },
      {
        title: "Giá",
        dataIndex: "price",
        key: "price",
        render: (text) => formatCurrency(text)
      },
      {
        title: "Sức chứa",
        dataIndex: "capacity",
        key: "capacity",
      },

      {
        title: "Số lượng",
        dataIndex: "quantity",
        key: "quantity",
      },
      {
        title: "Diện tích",
        dataIndex: "roomSize",
        key: "roomSize",
        render: (text: any) => `${text} m²`,
      },
    ];
    // Log dữ liệu dataSource
    console.log("Data source for expanded row:", roomsData[record.key]);
    return (
      <Table
        columns={columns}
        dataSource={roomsData[record.key]}
        pagination={false}
      />
    );
  };

  return (
    <Form form={form} component={false}>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={() => clearFiltersAndSorters()}>
          Clear filters and sorters
        </Button>

        {/* Rest of your UI */}
      </Space>
      <Table
        className="shadow-md"
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
        expandable={{
          expandedRowRender,
          defaultExpandedRowKeys: ["0"],
        }}
        scroll={{
          y: 600,
        }}
      />
    </Form>
  );
};
export default PendingTable;
