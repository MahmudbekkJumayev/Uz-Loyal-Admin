import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Input, Table } from "antd";
import axios from "axios";

const Services = () => {
  const [services, setServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const urlimage = "https://api.dezinfeksiyatashkent.uz/api/uploads/images/";

  function getServices() {
    axios
      .get("https://api.dezinfeksiyatashkent.uz/api/services")
      .then((response) => setServices(response.data.data))
      .catch((error) => console.log(error));
  }

  console.log(services);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    getServices();
  }, []);

  const onFinish = (values) => {
    console.log("Success:", values);
    axios
      .post("https://api.dezinfeksiyatashkent.uz/api/services", values, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
    getServices();
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const columns = [
    {
      title: "№",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Image",
      dataIndex: "img",
      key: "img",
    },
    {
      title: "Title_eng",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Title_uz",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Title_ru",
      dataIndex: "txt_ru",
      key: "txt_ru",
    },
    {
      title: "Title_zh",
      dataIndex: "txt_zh",
      key: "txt_zh",
    },
    {
      title: (
        <div className="flex items-center justify-between">
          <Button type="primary" onClick={() => showModal()}>
            Add services
          </Button>
        </div>
      ),
      dataIndex: "actions",
      key: "actions",
    },
  ];

  const dataSource = services.map((item, index) => ({
    key: index,
    id: index + 1,
    img: (
      <img style={{ width: "100px" }} src={`${urlimage}${item.image_src}`} />
    ),
    title: item.title_uz,
    name: item?.text_uz,
    txt_ru: item.title_ru,
    txt_zh: item.title_zh,
    actions: (
      <div className="flex items-center gap-x-5">
        <Button type="primary" onClick={() => showModal()}>
          Edit
        </Button>
        <Button type="primary" danger onClick={""}>
          Delete
        </Button>
      </div>
    ),
  }));

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} />
      <Modal
        title="Add faq"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        footer={null}
      >
        <Form
          name="basic"
          initialValues={{
            remember: true,
          }}
          footer:null
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Text in English"
            name="title_en"
            rules={[
              {
                required: true,
                message: "Please fill the field!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Text in Russian"
            name="title_ru"
            rules={[
              {
                required: true,
                message: "Please fill the field!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Text in Uzbek"
            name="title_uz"
            rules={[
              {
                required: true,
                message: "Please fill the field!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Text in Uzbek"
            name="text_uz"
            rules={[
              {
                required: true,
                message: "Please fill the field!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Text in Russian"
            name="text_ru"
            rules={[
              {
                required: true,
                message: "Please fill the field!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Text in English"
            name="text_en"
            rules={[
              {
                required: true,
                message: "Please fill the field!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <div className="flex items-center justify-between gap-x-5 mt-5">
              <Button style={{ width: "50%" }} onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="primary" style={{ width: "50%" }} htmlType="submit">
                Submit
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Services;
