import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Table, Modal, message, Input, Upload } from "antd";
import { ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons";

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const authToken = localStorage.getItem('access_token');
  const urlimage = 'https://api.dezinfeksiyatashkent.uz/api/uploads/images/'
  const [loading,setLoading] = useState(false);

  const getData = () => {
    setLoading(true)
    axios.get(`https://api.dezinfeksiyatashkent.uz/api/blogs`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((response) => {
        setBlogs(response.data.data);
        setLoading(false)
       })
      .catch((error) => {
        console.log("Error", error);
      });
  };
  useEffect(() => {
    getData();
  }, []);

  const handleOk = (values) => {
    setLoading(true)
    const formData = new FormData();
    formData.append('title_en', values.title_en);
    formData.append('title_ru', values.title_ru);
    formData.append('title_uz', values.title_uz);
    formData.append('text_uz', values.text_uz);
    formData.append('text_en', values.text_en);
    formData.append('text_ru', values.text_ru);
    formData.append('author', values.author);
    if (values.images && values.images.length > 0) {
      values.images.forEach((image) => {
        if (image && image.originFileObj) {
          formData.append('images', image.originFileObj, image.name);
        }
      });
    }
    const url = form.id ? ` blogs/${form.id}` : "https://api.dezinfeksiyatashkent.uz/api/blogs";
    const method = form.id ? 'PUT' : 'POST';
    const headers = {
      'Authorization': `Bearer ${authToken}`,
    };
    axios({
      url: url,
      method: method,
      data: formData,
      headers: headers,
    })
      .then(res => {
        if (res && res.data) {
          message.success(form.id ? "Blogs updated successfully" : "Blogs added successfully");
          handleCancel();
          getData();
        } else {
          message.error("Failed to save Blogs");
        }
      })
      .catch(error => {
        console.error(error);
        message.error("An error occurred while processing the request");
      }).finally(()=>{
        setLoading(false)
      })
  };

  const showModal = () => {
    setIsModalOpen(true);
    form.resetFields();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  }

  const editModal = (item) => {
    setIsModalOpen(true);
    form.setFieldsValue({
      title_en: item?.title_en,
      title_ru: item?.title_ru,
      title_uz: item?.title_uz,
      text_en: item?.text_en,
      text_ru: item?.text_ru,
      text_uz: item?.text_uz,
      author: item?.author,
      images: [{ uid: item.id, name: 'image', status: 'done', url: `${urlimage}${item?.blog_images[0]?.image?.src}` }], 
    });
    form.id = item.id;
  };

  const dataSource = blogs.map((item, index) => {
    console.log(item.blog_images[0]);
    const imageUrl =
      item.blog_images && item.blog_images.length > 0
        ? `${urlimage}${item.blog_images[0]?.image?.src || ''}`
        : '';
  
    return {
      key: item.id,
      number: index + 1,
      titleuz: item.title_uz,
      textuz: item.text_uz,
      author: item.author,
      images: imageUrl ? (
        <img
          style={{ width: "70px", height: "70px" }}
          src={imageUrl}
          alt="Error"
        />
      ) : null,
      action: (
        <>
          <Button onClick={() => editModal(item)} className="mr-3" type="primary">Edit</Button>
          <Button onClick={() => deleteUser(item.id)} type="primary" danger>Delete</Button>
        </>
      )
    };
  });
  
  

  const deleteUser = (id) => {
    console.log(id);
    const config = {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    }
    Modal.confirm({
      title: 'Are you sure you want to delete this user?',
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      cancelText: 'No',
      onOk() {
        axios.delete(`https://api.dezinfeksiyatashkent.uz/api/blogs/${id}`, config)
          .then(res => {
            if (res && res.data.success) {
              message.success("User deleted successfully");
              const updatedUsers = categories.filter(user => user.id !== id);
              setCategories(updatedUsers);
            } else {
              message.error("Failed to delete user");
            }
          })
          .catch(error => {
            console.error("Error deleting user:", error);
            message.error("An error occurred while deleting user");
          });
      },
      onCancel() {
        console.log("Deletion canceled");
      },
    });
  };
  const columns = [
    {
      title: '№',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: 'Images',
      dataIndex: 'images',
      key: 'images',
    },
    {
      title: 'Name Uz',
      dataIndex: 'titleuz',
      key: 'titleuz',
    },
    {
      title: 'Text Uz',
      dataIndex: 'textuz',
      key: 'textuz',
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: 'Harakat',
      dataIndex: 'action',
      key: 'action',
    },
  ];
  const beforeUpload = (file) => {
    const allowedExtensions = ['jpg', 'jpeg', 'png'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const isValidFile = allowedExtensions.includes(fileExtension);

    if (!isValidFile) {
      message.error('You can only upload JPG/JPEG/PNG files!');
    }

    return isValidFile;
  };

  // Handle file upload events
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }

  return (
    <div className="table-modal" >
      <Button style={{ marginBottom: '30px' }} onClick={showModal} type="primary">Add</Button>
      <Table dataSource={dataSource} columns={columns} />
      <Modal title="Add" open={isModalOpen} onCancel={handleCancel} footer={null}>
        <Form form={form} name="validateOnly" layout="vertical" autoComplete="off" onFinish={handleOk}
          style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}
        >
          <Form.Item
            name="title_en"
            label="Name En "
            rules={[{ required: true, message: 'Please enter the name in Russian' }]}
            style={{ flex: '0 0 33%', paddingRight: '8px' }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="title_uz"
            label="Name Uz "
            rules={[{ required: true, message: 'Please enter the name in Russian' }]}
            style={{ flex: '0 0 33%', paddingRight: '8px' }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="title_ru"
            label="Name En "
            rules={[{ required: true, message: 'Please enter the name in Russian' }]}
            style={{ flex: '0 0 33%', paddingRight: '8px' }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="text_uz"
            label="Text Uz "
            rules={[{ required: true, message: 'Please enter the name in Russian' }]}
            style={{ flex: '0 0 33%', paddingRight: '8px' }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="text_en"
            label="Text En "
            rules={[{ required: true, message: 'Please enter the name in Russian' }]}
            style={{ flex: '0 0 33%', paddingRight: '8px' }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="text_ru"
            label="Text Ru "
            rules={[{ required: true, message: 'Please enter the name in Russian' }]}
            style={{ flex: '0 0 33%', paddingRight: '8px' }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="author"
            label="Author"
            rules={[{ required: true, message: 'Please enter the name in Russian' }]}
            style={{ flex: '0 0 33%', paddingRight: '8px' }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="images"
            label="Upload the  Images"
            rules={[{ required: true, message: 'Please upload the cover image' }]}
            valuePropName="fileList"
            getValueFromEvent={normFile}
            style={{ flex: '0 0 33%', paddingRight: '8px' }}
          >
            <Upload
              customRequest={({ onSuccess }) => {
                onSuccess('ok');
              }}
              beforeUpload={beforeUpload}
              listType="picture-card"
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
          <Form.Item style={{ flex: '0 0 100%' }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Blogs;