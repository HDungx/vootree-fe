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
  } else if (dataIndex === "enabled") {
    inputNode = (
      <Select>
        <Select.Option value={true}>ACTIVE</Select.Option>
        <Select.Option value={false}>INACTIVE</Select.Option>
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
const url_deploy = "https://vootreeveevuu.up.railway.app";
const url_local = "http://localhost:8080";
const Partner = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");



  useEffect(() => {
    // Fetch data from API
    const fetchData = async () => {
      try {
        const response = await axios.get(`${url_deploy}/api/accounts`);
        const fetchedData = response.data
        .filter(item => item.roles.some(role => role.name === "PARTNER")) // Lọc các tài khoản có role là "CUSTOMER"
        .map((item, index) => ({
          key: item.id.toString(),
          firstName: item.user.firstName,
          lastName: item.user.lastName,
          gender: item.user.gender,
          dob: item.user.dob,
          enabled: item.enabled,
          ...item,
        }));
        setData(fetchedData);
        console.log(fetchedData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchData();
  }, []);


  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      firstname: "",
      lastname: "",
      email: "",
      phoneNum: "",
      gender: "",
      age: "",
      enabled: "",
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
      const row = {...row1, id: key};
      console.log(row);
      console.log(`Saving data for key ${key} to:`, `${url_deploy}/api/accounts/update/${key}`);
      await axios.put(`${url_deploy}/api/accounts/update/${key}`, row);
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        console.log(newData);
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
      width: "5%",
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      width: "10%",
      editable: false,
      ...getColumnSearchProps("firstName"),
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      width: "10%",
      editable: false,
      ...getColumnSearchProps("lastName"),
    },
    {
      title: "Email",
      dataIndex: "email",
      width: "15%",
      editable: false,
      ...getColumnSearchProps("email"),
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNum",
      width: "15%",
      editable: false,
      ...getColumnSearchProps("phoneNum"),
    },
    {
      title: "Gender",
      dataIndex: "gender",
      width: "10%",
      editable: false,
      filters: [
        { text: "Male", value: "MALE" },
        { text: "Female", value: "FEMALE" },
      ],
      onFilter: (value, record) => record.gender === value,
    },
    {
      title: "Date of birth",
      dataIndex: "dob",
      width: "10%",
      editable: false,
      ...getColumnSearchProps("dob"),
      sorter: (a, b) => new Date(a.dob) - new Date(b.dob),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Status",
      dataIndex: "enabled",
      width: "10%",
      editable: true,
      render: (enabled) => (enabled ? "ACTIVE" : "INACTIVE")
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            Edit
          </Typography.Link>
        );
      },
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
    // Xóa tất cả các filters
    setSearchText("");
    setSearchedColumn("");
  
    // Xóa tất cả các sorters
    // Cập nhật lại state của data để hiển thị lại dữ liệu gốc
    // Lấy dữ liệu gốc
  // let newData = [...originData];

  // Cập nhật lại state của data để hiển thị lại dữ liệu gốc
  // setData(newData);
  // console.log(newData);
  };
  
  return (
    <Form form={form} component={false}>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={() => clearFiltersAndSorters()}>Clear filters and sorters</Button>

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
        scroll={{
          y: 600,
        }}
      />
    </Form>
  );
};
export default Partner;
