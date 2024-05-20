import { Button, Modal, Form, Input, Table } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

const Faqs = () => {
  const [faqs, setFaqs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    getFaqs();
  }, []);

  const getFaqs = () => {
    axios
      .get("https://api.dezinfeksiyatashkent.uz/api/faqs")
      .then((response) => setFaqs(response.data.data))
      .catch((error) => console.log(error));
  };

  const onFinish = (values) => {
    console.log("Success:", values);
    axios
      .post("https://api.dezinfeksiyatashkent.uz/api/faqs", values, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
    getFaqs();
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const deleteFaq = (id) => {
    axios
      .delete(`https://api.dezinfeksiyatashkent.uz/api/faqs/${id}`, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
    getFaqs();
  };

  const columns = [
    {
      title: "№",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: (
        <div className="flex items-center justify-between">
          <p>Actions</p>
          <Button type="primary" onClick={showModal}>
            Add faq
          </Button>
        </div>
      ),
      dataIndex: "actions",
      key: "actions",
    },
  ];

  const dataSource = faqs.map((item, index) => ({
    key: index,
    id: index + 1,
    name: item?.text_uz,
    actions: (
      <div className="flex items-center gap-x-5">
        <Button type="primary">Edit</Button>
        <Button type="primary" danger onClick={() => deleteFaq(item?.id)}>
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
            label="Title in English"
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
            label="Title in Russian"
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
            label="Title in Uzbek"
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

export default Faqs;
