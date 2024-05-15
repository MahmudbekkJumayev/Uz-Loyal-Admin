import React from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer/Footer";

const Layouts = () => {
  return (
    <div className="w-full">
      <div className="main_wrapper flex w-full">
        <aside>
          <Sidebar />
        </aside>
        <div className="secon-container">
          <Header />
          <main>
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Layouts;
