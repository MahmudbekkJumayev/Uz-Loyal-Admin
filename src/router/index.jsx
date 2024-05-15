import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Categories from "../pages/Categories/Categories";
import Faqs from "../pages/Faqs/Faqs";
import News from "../pages/News/News";
import Blogs from "../pages/Blogs/Blogs";
import Services from "../pages/Services/Services";
import App from "../App";
import Error from "../pages/Error/Error";
import Soursec from "../pages/Soursec/Soursec";
import Login from "../pages/Auth/Login";
import PrivateRoute from "../components/Private/PrivateRoute";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: "categories",
        element: <PrivateRoute element={<Categories />} />,
      },
      {
        path: "faqs",
        element: <PrivateRoute element={<Faqs />} />,
      },
      {
        path: "news",
        element: <PrivateRoute element={<News />} />,
      },
      {
        path: "blogs",
        element: <PrivateRoute element={<Blogs />} />,
      },
      {
        path: "services",
        element: <PrivateRoute element={<Services />} />,
      },
      {
        path: "sources",
        element: <PrivateRoute element={<Soursec />} />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export default Router;
