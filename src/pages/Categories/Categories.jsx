import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Table, Modal, message, Input, Upload } from "antd";
import { ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons";

function Categories() {
    const [categories, setCategories] = useState([]);
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const authToken = localStorage.getItem('access_token');
    const urlimage = 'https://autoapi.dezinfeksiyatashkent.uz/api/uploads/images/' 

    const getData = () => {
        axios.get(`https://api.dezinfeksiyatashkent.uz/api/categories`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        })
            .then((response) => {
                setCategories(response.data.data);
            })
            .catch((error) => {
                console.log("Error", error);
            });
    };
    useEffect(() => {
        getData();
    }, []);

    const handleOk = (values) => {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('description', values.description)
                   
        const url = form.id ? `https://api.dezinfeksiyatashkent.uz/api/categories/${form.id}` : "https://api.dezinfeksiyatashkent.uz/api/categories";
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
                    message.success(form.id ? "Category updated successfully" : "Category added successfully");
                    handleCancel();
                    getData();
                } else {
                    message.error("Failed to save category");
                }
            })
            .catch(error => {
                console.error(error);
                message.error("An error occurred while processing the request");
            });
    };

   
    const showModal = () => {
        setIsModalOpen(true);
        form.resetFields();
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const editModal = (item) => {
        setIsModalOpen(true);
        form.setFieldsValue({
            name: item.name,
            description: item.description,
        });
        form.id = item.id;
    };
    

    const dataSource = categories.map((item, index) => ({
        key: item.id,
        number: index + 1,
        id: item.id,
        name: item.name,
        description: item.description,
        action: (
            <>
                <Button onClick={() => editModal(item)} type="primary">Edit</Button>
                <Button onClick={() => deleteUser(item.id)} type="primary" danger>Delete</Button>
            </>
        )
    }));

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
                axios.delete(`https://api.dezinfeksiyatashkent.uz/api/categories/${id}`, config)
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
            title: 'id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Harakat',
            dataIndex: 'action',
            key: 'action',
        },
    ];

    return (
        <div className="table-modal" >
            <Button style={{ marginBottom: '30px' }} onClick={showModal} type="primary">Add</Button>
         
            <Table dataSource={dataSource} columns={columns} />
            <Modal title="Add" open={isModalOpen} onCancel={handleCancel} footer={null}>
                <Form form={form} name="validateOnly" layout="vertical" autoComplete="off" onFinish={handleOk}>
                    <Form.Item name="name" label="Name " rules={[{ required: true, message: 'Please enter the name in Russian' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please enter the name in Russian' }]}>
                        <Input />
                    </Form.Item>
                   
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Save
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default Categories;