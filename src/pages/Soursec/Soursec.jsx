import {
  message,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  Select,
} from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import style from "./Soursec.module.css";
import { useNavigate } from "react-router-dom";

const Soursec = () => {
  const [soursec, setSourcec] = useState([]);
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedCity, setSelectedCity] = useState(null);
  const navigate = useNavigate();
  const urlimage = "https://api.dezinfeksiyatashkent.uz/api/uploads/images/";

  const columns = [
    {
      title: "ID",
      dataIndex: "number",
      key: "number",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "name",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "text",
    },
    {
      title: "src",
      dataIndex: "src",
      key: "src",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
    },
  ];

  const dataSourse = soursec.map((item, index) => ({
    key: item.id,
    number: index + 1,
    title: item.title,
    category: item.category,
    src: <img style={{ width: "100px" }} src={`${urlimage}${item.src}`} />,
    action: (
      <>
        <span style={{ marginRight: "20px" }}>
          <Button type="primary" onClick={() => handleEdit(item)}>
            Edit
          </Button>
        </span>
        <span>
          <Button type="primary" danger onClick={() => handleDelete(item.id)}>
            Delete
          </Button>
        </span>
      </>
    ),
  }));

  const getData = () => {
    setLoading(true);
    axios
      .get("https://api.dezinfeksiyatashkent.uz/api/sources")
      .then((response) => {
        setSourcec(response.data.data);
        console.log(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error getting sources.", error);
        message.error("Error getting sources.");
        setLoading(false);
      });
  };

  // categor get
  const getCategory = () => {
    setLoading(true);
    axios
      .get("https://api.dezinfeksiyatashkent.uz/api/categories")
      .then((response) => {
        setCategory(response.data.data);

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error getting category.", error);
        message.error("Error getting category.");
        setLoading(false);
      });
  };

  useEffect(() => {
    localStorage.getItem("access_token") ? "" : navigate("/login");
    getData();
    getCategory();
  }, []);

  const handleEdit = (item) => {
    const imageUrl = `${urlimage}${item.src}`;
    setSelectedCity({
      id: item?.id,
      title: item?.title,
      category: item?.category,
      src: imageUrl,
    });
    setVisible(true);
    form.setFieldsValue(item);
  };

  const handleDelete = (id) => {
    const authToken = localStorage.getItem("access_token");
    const config = {
      headers: { Authorization: `Bearer ${authToken}` },
    };
    Modal.confirm({
      title: "Do you want to delete this city?",
      onOk() {
        axios
          .delete(
            `https://api.dezinfeksiyatashkent.uz/api/sources/${id}`,
            config
          )
          .then(() => {
            message.success("City deleted successfully");
            getData();
          })
          .catch((error) => {
            console.error("Error deleting city.", error);
            message.error("Error deleting city.");
          });
      },
    });
  };

  const handleAdd = () => {
    setSelectedCity(null);
    setVisible(true);
    form.resetFields();
  };

  const handleOk = () => {
    const authToken = localStorage.getItem("access_token");
    form.validateFields().then((values) => {
      const formData = new FormData();
      formData.append("title", values?.title);
      formData.append("category", values?.category);
      if (values?.src && values?.src?.length > 0) {
        values.src.forEach((src) => {
          if (src && src?.originFileObj) {
            formData.append("images", src?.originFileObj, src.name);
          }
        });
      }
      const url = selectedCity
        ? `https://api.dezinfeksiyatashkent.uz/api/sources/${selectedCity.id}`
        : "https://api.dezinfeksiyatashkent.uz/api/sources";
      const method = selectedCity ? "PUT" : "POST";

      axios({
        url,
        method,
        data: formData,
        headers: { Authorization: `Bearer ${authToken}` },
      })
        .then(() => {
          message.success(
            selectedCity
              ? "City updated successfully"
              : "City added successfully"
          );
          setVisible(false);
          form.resetFields();
          getData();
        })
        .catch((error) => {
          console.error("Error adding/updating city.", error);
          message.error("Error adding/updating city.");
        });
    });
  };

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };
  const beforeUpload = (file) => {
    const extension = file.name.split(".").pop().toLowerCase();
    const isJpgorPng =
      extension === "jpeg" || extension === "jpg" || extension === "png";
    if (!isJpgorPng) {
      message.error("Rasm yuklang");
    }
    return isJpgorPng;
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e?.fileList;
  };

  return (
    <div className={style["add-container"]}>
      <div style={{ overflowX: "auto" }}>
        <Button
          type="primary"
          className={style["add-btn"]}
          onClick={handleAdd}
          style={{ margin: 0 }}
        >
          Add City
        </Button>
        <Table
          columns={columns}
          loading={loading}
          rowKey="id"
          dataSource={dataSourse}
        />
      </div>
      <Modal
        title={selectedCity ? "Edit City" : "Add City"}
        open={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="title"
            rules={[{ required: true, message: "Please enter the name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="category"
            label="category"
            rules={[{ required: true, message: "Please enter the text" }]}
          >
            <Select placeholder="Select Brand">
              {category.map((item) => (
                <Select.Option
                  key={item.id}
                  value={item.id}
                  disabled={item.disabled}
                >
                  {item.category_id}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Upload Image"
            name="images"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: "Please upload an image" }]}
          >
            <Upload
              customRequest={({ onSuccess }) => {
                onSuccess("ok");
              }}
              maxCount={1}
              beforeUpload={beforeUpload}
              listType="picture-card"
            >
              <div>
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Soursec;
