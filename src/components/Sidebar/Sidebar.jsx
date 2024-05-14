import React, { useEffect, useState } from "react";
import { TiHome } from "react-icons/ti";
import { NavLink, Link } from "react-router-dom";
import { Button, Menu } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { BsShopWindow } from "react-icons/bs";
import { HiOutlineNewspaper } from "react-icons/hi";
import { GrMapLocation } from "react-icons/gr";
import { BiSolidCity } from "react-icons/bi";
import { IoCarSportOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("1");

  useEffect(() => {
    const storedActiveTab = localStorage.getItem("activeTab");
    if (storedActiveTab) {
      setActiveTab(storedActiveTab);
    }
  }, []);

  const handleMenuClick = (key) => {
    setActiveTab(key);
    localStorage.setItem("activeTab", key);
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }
  const items = [
    getItem(
      <div className="logo">
        <Link to="/" onClick={() => handleMenuClick("0")}>
          {collapsed ? (
            <img
              style={{ width: "50px", height: "50px" }}
              alt="Avtozoom logo"
            />
          ) : (
            "UzLoyalAdmin"
          )}
        </Link>
      </div>
    ),
    getItem(
      <NavLink
        to="/categories"
        style={{ fontSize: 16, fontWeight: 600 }}
        onClick={() => handleMenuClick("1")}
      >
        Categories
      </NavLink>,
      "1",
      <TiHome style={{ fontSize: "20px" }} />
    ),
    getItem(
      <NavLink
        to="/faqs"
        style={{ fontSize: 16, fontWeight: 600 }}
        onClick={() => handleMenuClick("2")}
      >
        Faqs
      </NavLink>,
      "2",
      <IoSettingsOutline style={{ fontSize: "20px" }} />
    ),
    getItem(
      <NavLink
        to="/news"
        style={{ fontSize: 16, fontWeight: 600 }}
        onClick={() => handleMenuClick("3")}
      >
        News
      </NavLink>,
      "3",
      <BsShopWindow style={{ fontSize: "20px" }} />
    ),
    getItem(
      <NavLink
        to="/Blogs"
        style={{ fontSize: 16, fontWeight: 600 }}
        onClick={() => handleMenuClick("4")}
      >
        Blogs
      </NavLink>,
      "4",
      <HiOutlineNewspaper style={{ fontSize: "20px" }} />
    ),
    getItem(
      <NavLink
        to="/services"
        style={{ fontSize: 16, fontWeight: 600 }}
        onClick={() => handleMenuClick("5")}
      >
        Services
      </NavLink>,
      "5",
      <GrMapLocation style={{ fontSize: "20px" }} />
    ),
    getItem(
      <NavLink
        to="/sources"
        style={{ fontSize: 16, fontWeight: 600 }}
        onClick={() => handleMenuClick("6")}
      >
        Sources
      </NavLink>,
      "6",
      <GrMapLocation style={{ fontSize: "20px" }} />
    ),
  ];

  return (
    <>
      <Button
        type="primary"
        onClick={toggleCollapsed}
        style={{
          marginBottom: 16,
          position: "absolute",
          top: 16,
          left: `${collapsed ? "120px" : "275px"}`,
          zIndex: 999,
          transition: "0.1s",
        }}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
      <Menu
        selectedKeys={[activeTab]}
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
        items={items}
        style={{ height: "90vh" }}
      />
    </>
  );
};

export default Sidebar;
