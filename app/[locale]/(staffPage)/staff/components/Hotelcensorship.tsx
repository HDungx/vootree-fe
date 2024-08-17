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
  message,
} from "antd";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
// const originData = [];
// for (let i = 0; i < 100; i++) {
//   originData.push({
//     key: i.toString(),
//     firstname: `Edward ${i}`,
//     lastname: `Smith ${i}`,
//     email: `edward${i}@example.com`,
//     phoneNum: `123-456-789${i}`,
//     gender: i % 2 === 0 ? "Male" : "Female",
//     age: 32 + i,
//     status: i % 2 === 0 ? "active" : "inactive",
//   });
// }
const url_deploy = "https://vootreeveevuu.up.railway.app";
const url_local = "http://localhost:8080";
const EditableCell = ({
  editing, // Xác định xem ô này có đang ở chế độ chỉnh sửa hay không
  dataIndex, // Tên thuộc tính của dữ liệu (ví dụ: 'name', 'age', 'address')
  title, // Tiêu đề của ô, sử dụng trong thông báo lỗi nếu không có giá trị
  inputType, // Loại input (ví dụ: 'number' hoặc 'text')
  record, // Dữ liệu của hàng hiện tại
  index, // Chỉ số của hàng hiện tại
  children, // Các phần tử con (nội dung hiển thị của ô khi không ở chế độ chỉnh sửa)
  ...restProps // Các thuộc tính còn lại được truyền vào (ví dụ: các thuộc tính của ô <td>)
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

const Hotelcensorship = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [roomsData, setRoomsData] = useState({});

  useEffect(() => {
    // Fetch hotels data from API
    const fetchData = async () => {
      try {
        const response = await axios.get(`${url_deploy}/api/hotels`);
        const fetchedData = response.data
          .filter(
            (item) => item.status === "PENDING" && item.edit_status === "CREATE"
          )
          .map((item) => ({
            key: item.id.toString(),
            ...item,
          }));
        setData(fetchedData);
        console.log(fetchedData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    // Fetch room data from API
    const fetchRoomData = async () => {
      try {
        const response = await axios.get(`${url_deploy}/api/rooms`);
        const fetchedRoomData = response.data
          .filter(
            (item) => item.status === "PENDING" && item.edit_status === "CREATE"
          )
          .reduce((acc, room) => {
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
              edit_status: room.edit_status,
            });

            return acc;
          }, {});
        setRoomsData(fetchedRoomData);
        // console.log( fetchedRoomData);
      } catch (error) {
        console.error("Error fetching room data: ", error);
      }
    };

    fetchData();
    fetchRoomData();
  }, []);

  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
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
  const save = async (key) => {
    try {
      const row1 = await form.validateFields();

      const row = { ...row1, id: key };
      console.log(row);
      console.log(
        `Saving data for key ${key} to:`,
        `${url_deploy}/api/hotels/staff/update/${key}`
      );
      await axios.put(
        `${url_deploy}/api/hotels/staff/update/${key}`,
        row
      );
      const newData = [...data].filter((item) => item.status === "PENDING");
      const index = newData.findIndex((item) => key === item.key);
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

  const acceptHotel = async (key) => {
    try {
      const row = { id: key, status: "ACTIVE" };
      console.log(row);
      console.log(
        `Saving data for key ${key} to:`,
        `${url_deploy}/api/hotels/staff/accept/${key}`
      );
      await axios.put(
        `${url_deploy}/api/hotels/staff/accept/${key}`,
        row
      );
      message.success("Request accepted!");
      const newData = [...data].filter((item) => item.status === "PENDING");
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          status: "ACTIVE",
        });
        setData(newData);
      } else {
        newData.push(row);
        setData(newData);
      }
    } catch (errInfo) {
      console.log("Accept Failed:", errInfo);
    }
  };

  const rejectHotel = async (key) => {
    try {
      const row = { id: key, status: "REJECTED" };
      console.log(row);
      console.log(
        `Saving data for key ${key} to:`,
        `${url_deploy}/api/hotels/staff/reject/${key}`
      );
      await axios.put(
        `${url_deploy}/api/hotels/staff/reject/${key}`,
        row
      );
      message.success("Request rejected!");
      const newData = [...data].filter((item) => item.status === "PENDING");
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          status: "REJECTED",
        });
        setData(newData);
      } else {
        newData.push(row);
        setData(newData);
      }
    } catch (errInfo) {
      console.log("Reject Failed:", errInfo);
    }
  };

  // search filter
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
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
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
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
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  //set columns
  const columns = [
    {
      title: "Index",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => index + 1,
      fixed: "left",
    },
    {
      title: "Hotel Name",
      dataIndex: "hotelName",
      fixed: "left",
      editable: false,
      ...getColumnSearchProps("hotelName"),
    },
    {
      title: "Address",
      dataIndex: "address",

      editable: false,
      ...getColumnSearchProps("address"),
    },
    {
      title: "City",
      dataIndex: "city",

      editable: false,
      ...getColumnSearchProps("city"),
    },
    {
      title: "Stars",
      dataIndex: "hotelStars",

      editable: false,
      ...getColumnSearchProps("hotelStars"),
    },
    {
      title: "Phone Number",
      dataIndex: "hotelPhoneNum",

      editable: false,
      ...getColumnSearchProps("hotelPhoneNum"),
    },
    {
      title: "checkInTime",
      dataIndex: "checkInTime",

      editable: false,
      ...getColumnSearchProps("checkInTime"),
    },
    {
      title: "checkOutTime",
      dataIndex: "checkOutTime",

      editable: false,
      ...getColumnSearchProps("checkOutTime"),
    },
    {
      title: "Edit Status",
      dataIndex: "edit_status",
      fixed: "right",
      editable: false,
    },
    {
      title: "Status",
      dataIndex: "status",
      fixed: "right",
      editable: true,
    },
    {
      title: "operation",
      dataIndex: "operation",
      fixed: "right",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => acceptHotel(record.key)}
            disabled={record.status !== "PENDING"}
          >
            Accept
          </Button>
          <Button
            type="primary"
            danger
            onClick={() => rejectHotel(record.key)}
            disabled={record.status !== "PENDING"}
          >
            Reject
          </Button>
        </Space>
      ),
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const clearFiltersAndSorters = () => {
    // Xóa tất cả các filters và sorters bằng cách đặt lại giá trị state
    setSearchText("");
    setSearchedColumn("");

    // Gọi hàm handleSearch với selectedKeys là mảng rỗng để xóa bộ lọc
    const selectedKeys = [];
    handleSearch(selectedKeys, () => {}, searchedColumn);
  };
  const expandedRowRender = (record) => {
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
        title: "Edit Status",
        dataIndex: "edit_status",

        editable: false,
      },
      {
        title: "Diện tích",
        dataIndex: "roomSize",
        key: "roomSize",
        render: (text) => `${text} m²`,
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
          x: 2000,
          y: 600,
        }}
      />
    </Form>
  );
};
export default Hotelcensorship;
